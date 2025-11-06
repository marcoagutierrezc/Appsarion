package com.Backend.EPI.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import java.io.IOException;
import java.net.URI;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BackblazeService {

    @Value("${backblaze.keyId}")
    private String keyId;

    @Value("${backblaze.apiKey}")
    private String apiKey;

    @Value("${backblaze.endpoint}")
    private String endpoint;

    @Value("${backblaze.region}")
    private String regionName;

    @Value("${backblaze.bucket}")
    private String bucketName;

    private S3Client s3Client;
    private static final String DOCUMENTOS_SOPORTE_FOLDER = "DocumentosDeSoporte/";

    @PostConstruct
    public void initialize() {
        Region region = Region.of(regionName.toUpperCase().replace("-", "_"));

        AwsBasicCredentials awsCreds = AwsBasicCredentials.create(
            keyId,
            apiKey
        );

        this.s3Client = S3Client.builder()
                .credentialsProvider(StaticCredentialsProvider.create(awsCreds))
                .endpointOverride(URI.create(endpoint))
                .region(region)
                .build();
    }

    @PreDestroy
    public void cleanup() {
        if (s3Client != null) {
            s3Client.close();
        }
    }

    /**
     * Sube un documento de soporte para un usuario específico
     * @param userId ID del usuario
     * @param file Archivo a subir
     * @return URL del archivo subido en Backblaze
     */
    public String uploadSupportDocument(Long userId, MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("El archivo está vacío");
        }

        // Generar nombre único para el archivo
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null && originalFilename.contains(".")
            ? originalFilename.substring(originalFilename.lastIndexOf("."))
            : "";

        String fileName = String.format("%suser_%d/%s_%s%s",
            DOCUMENTOS_SOPORTE_FOLDER,
            userId,
            timestamp,
            sanitizeFilename(originalFilename),
            extension
        );

        try {
            // Subir archivo a Backblaze B2
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileName)
                    .contentType(file.getContentType())
                    .build();

            s3Client.putObject(putObjectRequest,
                RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

            // Retornar la URL del archivo
            return String.format("%s/%s/%s", endpoint, bucketName, fileName);
        } catch (S3Exception e) {
            throw new RuntimeException("Error al subir archivo a Backblaze: " + e.getMessage(), e);
        }
    }

    /**
     * Lista todos los documentos de soporte de un usuario
     * @param userId ID del usuario
     * @return Lista de URLs de los documentos
     */
    public List<String> listUserSupportDocuments(Long userId) {
        String prefix = DOCUMENTOS_SOPORTE_FOLDER + "user_" + userId + "/";

        try {
            ListObjectsV2Request listRequest = ListObjectsV2Request.builder()
                    .bucket(bucketName)
                    .prefix(prefix)
                    .build();

            ListObjectsV2Response listResponse = s3Client.listObjectsV2(listRequest);

            return listResponse.contents().stream()
                    .map(s3Object -> String.format("%s/%s/%s", endpoint, bucketName, s3Object.key()))
                    .collect(Collectors.toList());
        } catch (S3Exception e) {
            throw new RuntimeException("Error al listar archivos de Backblaze: " + e.getMessage(), e);
        }
    }

    /**
     * Lista documentos con metadata completa
     * @param userId ID del usuario
     * @return Lista de información detallada de los documentos
     */
    public List<DocumentInfo> listUserSupportDocumentsWithMetadata(Long userId) {
        String prefix = DOCUMENTOS_SOPORTE_FOLDER + "user_" + userId + "/";

        try {
            ListObjectsV2Request listRequest = ListObjectsV2Request.builder()
                    .bucket(bucketName)
                    .prefix(prefix)
                    .build();

            ListObjectsV2Response listResponse = s3Client.listObjectsV2(listRequest);

            return listResponse.contents().stream()
                    .map(s3Object -> new DocumentInfo(
                        s3Object.key(),
                        String.format("%s/%s/%s", endpoint, bucketName, s3Object.key()),
                        s3Object.size(),
                        s3Object.lastModified().toString(),
                        extractFilename(s3Object.key())
                    ))
                    .collect(Collectors.toList());
        } catch (S3Exception e) {
            throw new RuntimeException("Error al listar archivos de Backblaze: " + e.getMessage(), e);
        }
    }

    /**
     * Elimina un documento de soporte
     * @param fileKey Clave del archivo en B2
     */
    public void deleteSupportDocument(String fileKey) {
        try {
            DeleteObjectRequest deleteRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileKey)
                    .build();

            s3Client.deleteObject(deleteRequest);
        } catch (S3Exception e) {
            throw new RuntimeException("Error al eliminar archivo de Backblaze: " + e.getMessage(), e);
        }
    }

    /**
     * Obtiene la URL pública de un archivo
     * @param fileKey Clave del archivo
     * @return URL del archivo
     */
    public String getFileUrl(String fileKey) {
        return String.format("%s/%s/%s", endpoint, bucketName, fileKey);
    }

    /**
     * Descarga un documento desde Backblaze
     * @param fileKey Clave del archivo en B2
     * @return Bytes del archivo
     */
    public byte[] downloadDocument(String fileKey) {
        try {
            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileKey)
                    .build();

            return s3Client.getObject(getObjectRequest).readAllBytes();
        } catch (S3Exception e) {
            throw new RuntimeException("Error al descargar archivo de Backblaze: " + e.getMessage(), e);
        } catch (IOException e) {
            throw new RuntimeException("Error al leer archivo de Backblaze: " + e.getMessage(), e);
        }
    }

    /**
     * Obtiene información del archivo (tipo, tamaño, etc)
     * @param fileKey Clave del archivo
     * @return Metadata del archivo
     */
    public HeadObjectResponse getDocumentMetadata(String fileKey) {
        try {
            HeadObjectRequest headRequest = HeadObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileKey)
                    .build();

            return s3Client.headObject(headRequest);
        } catch (S3Exception e) {
            throw new RuntimeException("Error al obtener metadata del archivo: " + e.getMessage(), e);
        }
    }

    /**
     * Sanitiza el nombre del archivo
     */
    private String sanitizeFilename(String filename) {
        if (filename == null) return "document";

        // Remover extensión
        String nameWithoutExt = filename.contains(".")
            ? filename.substring(0, filename.lastIndexOf("."))
            : filename;

        // Remover caracteres especiales y espacios
        return nameWithoutExt
                .replaceAll("[^a-zA-Z0-9._-]", "_")
                .replaceAll("_{2,}", "_")
                .toLowerCase();
    }

    /**
     * Extrae el nombre del archivo de la clave completa
     */
    private String extractFilename(String key) {
        if (key == null || !key.contains("/")) return key;
        return key.substring(key.lastIndexOf("/") + 1);
    }

    /**
     * Clase interna para información de documentos
     */
    public static class DocumentInfo {
        private String key;
        private String url;
        private Long size;
        private String lastModified;
        private String filename;

        public DocumentInfo(String key, String url, Long size, String lastModified, String filename) {
            this.key = key;
            this.url = url;
            this.size = size;
            this.lastModified = lastModified;
            this.filename = filename;
        }

        // Getters
        public String getKey() { return key; }
        public String getUrl() { return url; }
        public Long getSize() { return size; }
        public String getLastModified() { return lastModified; }
        public String getFilename() { return filename; }

        // Setters
        public void setKey(String key) { this.key = key; }
        public void setUrl(String url) { this.url = url; }
        public void setSize(Long size) { this.size = size; }
        public void setLastModified(String lastModified) { this.lastModified = lastModified; }
        public void setFilename(String filename) { this.filename = filename; }
    }
}
