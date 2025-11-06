package com.Backend.EPI.web.controller;

import com.Backend.EPI.persistence.entity.User;
import com.Backend.EPI.persistence.entity.UserToVerify;
import com.Backend.EPI.service.BackblazeService;
import com.Backend.EPI.service.BackblazeService.DocumentInfo;
import com.Backend.EPI.persistence.crud.UserToVerifyCrudRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Controlador REST para gestión de documentos de soporte en Backblaze B2
 *
 * ⚠️ IMPORTANTE: TODOS los endpoints requieren autenticación de ADMINISTRADOR
 *
 * Para usar estos endpoints, debe incluir el header:
 * X-User-Id: <ID del administrador>
 *
 * FLUJO DE REGISTRO (Dos opciones):
 *
 * OPCIÓN A - Usuario sube documento al registrarse (Flujo Actual):
 * 1. Usuario se registra en POST /users-to-verify CON documento (archivo local)
 * 2. Admin revisa usuarios pendientes en GET /users-to-verify/pending
 * 3. Admin aprueba el usuario con POST /users/validate/{id}
 * 4. (Opcional) Admin reemplaza/sube documento a Backblaze con POST /api/support-documents/upload/{userId}
 *
 * OPCIÓN B - Admin sube documento después de aprobar:
 * 1. Usuario se registra en POST /users-to-verify SIN documento (opcional)
 * 2. Admin revisa usuarios pendientes en GET /users-to-verify/pending
 * 3. Admin aprueba el usuario con POST /users/validate/{id}
 * 4. Admin sube documento a Backblaze con POST /api/support-documents/upload/{userId}
 *
 * NOTA: Este controlador permite al admin gestionar documentos en Backblaze B2,
 * independientemente de si el usuario ya subió uno localmente o no.
 */
@RestController
@RequestMapping("/api/support-documents")
public class SupportDocumentController {

    @Autowired
    private BackblazeService backblazeService;

    @Autowired
    private UserToVerifyCrudRepository userToVerifyCrudRepository;

    @PersistenceContext
    private EntityManager entityManager;

    private static final Logger logger = LoggerFactory.getLogger(SupportDocumentController.class);

    /**
     * Sube un documento de soporte para un usuario y guarda la ruta en la BD
     * POST /api/support-documents/upload/{userId}
     * Form-data: file
     *
     * Este endpoint puede:
     * - Subir un documento nuevo si el usuario no tiene uno
     * - Reemplazar un documento existente (local o de Backblaze)
     */
    @PostMapping("/upload/{userId}")
    @Transactional
    public ResponseEntity<Map<String, Object>> uploadSupportDocument(
            @PathVariable Long userId,
            @RequestParam("file") MultipartFile file) {

        Map<String, Object> response = new HashMap<>();

        try {
            // Buscar el usuario objetivo
            User user = entityManager.find(User.class, userId);
            if (user == null) {
                response.put("success", false);
                response.put("message", "Usuario no encontrado");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            // Validar el archivo
            if (file.isEmpty()) {
                response.put("success", false);
                response.put("message", "El archivo está vacío");
                return ResponseEntity.badRequest().body(response);
            }

            // Validar tamaño (máximo 10MB)
            long maxSize = 10 * 1024 * 1024;
            if (file.getSize() > maxSize) {
                response.put("success", false);
                response.put("message", "El archivo excede el tamaño máximo permitido (10MB)");
                return ResponseEntity.badRequest().body(response);
            }

            // Verificar si el usuario ya tiene un documento
            String previousDocument = user.getSupportingDocument();
            boolean isReplacement = previousDocument != null && !previousDocument.isEmpty();

            // Subir archivo a Backblaze
            String fileUrl = backblazeService.uploadSupportDocument(userId, file);

            // Guardar la URL en la base de datos
            user.setSupportingDocument(fileUrl);
            entityManager.merge(user);

            response.put("success", true);
            response.put("message", isReplacement
                ? "Documento reemplazado exitosamente"
                : "Documento subido exitosamente");
            response.put("fileUrl", fileUrl);
            response.put("userId", userId);
            response.put("previousDocument", previousDocument);
            response.put("isReplacement", isReplacement);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al subir documento: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Lista todos los documentos de soporte de un usuario
     * GET /api/support-documents/user/{userId}
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> listUserDocuments(@PathVariable Long userId) {

        Map<String, Object> response = new HashMap<>();


        try {
            User user = entityManager.find(User.class, userId);
            if (user == null) {
                response.put("success", false);
                response.put("message", "Usuario no encontrado");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            List<DocumentInfo> documents = backblazeService.listUserSupportDocumentsWithMetadata(userId);

            response.put("success", true);
            response.put("userId", userId);
            response.put("userName", user.getName());
            response.put("documents", documents);
            response.put("totalDocuments", documents.size());
            response.put("currentDocument", user.getSupportingDocument());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al listar documentos: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Obtiene el documento de soporte actual de un usuario
     * GET /api/support-documents/current/{userId}
     */
    @GetMapping("/current/{userId}")
    public ResponseEntity<Map<String, Object>> getCurrentDocument(@PathVariable Long userId) {

        Map<String, Object> response = new HashMap<>();


        try {
            User user = entityManager.find(User.class, userId);
            if (user == null) {
                response.put("success", false);
                response.put("message", "Usuario no encontrado");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            response.put("success", true);
            response.put("userId", userId);
            response.put("userName", user.getName());
            response.put("documentUrl", user.getSupportingDocument());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Elimina el documento actual de un usuario
     * DELETE /api/support-documents/user/{userId}/current
     */
    @DeleteMapping("/user/{userId}/current")
    @Transactional
    public ResponseEntity<Map<String, Object>> deleteCurrentDocument(@PathVariable Long userId) {

        Map<String, Object> response = new HashMap<>();

        try {
            User user = entityManager.find(User.class, userId);
            if (user == null) {
                response.put("success", false);
                response.put("message", "Usuario no encontrado");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            String currentDocument = user.getSupportingDocument();
            if (currentDocument == null || currentDocument.isEmpty()) {
                response.put("success", false);
                response.put("message", "El usuario no tiene un documento de soporte registrado");
                return ResponseEntity.badRequest().body(response);
            }

            String fileKey = extractFileKeyFromUrl(currentDocument);
            backblazeService.deleteSupportDocument(fileKey);

            user.setSupportingDocument(null);
            entityManager.merge(user);

            response.put("success", true);
            response.put("message", "Documento eliminado exitosamente");
            response.put("userId", userId);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Extrae la clave del archivo de una URL completa
     */
    private String extractFileKeyFromUrl(String url) {
        if (url.contains("AppsarionDocumentos/")) {
            return url.substring(url.indexOf("AppsarionDocumentos/") + "AppsarionDocumentos/".length());
        }
        throw new IllegalArgumentException("URL de documento inválida");
    }

    /**
     * Obtiene el documento de soporte de un usuario (busca en users_to_verify Y users)
     * @param userId ID del usuario
     * @return String con la URL del documento, o null si no existe
     */
    private String getUserSupportDocument(Long userId) {
        // Primero buscar en users_to_verify (usuarios pendientes)
        Optional<UserToVerify> userToVerify = userToVerifyCrudRepository.findById(userId);
        if (userToVerify.isPresent()) {
            String doc = userToVerify.get().getSupportingDocument();
            if (doc != null && !doc.isEmpty()) {
                logger.info("Documento encontrado en users_to_verify - userId: {}", userId);
                return doc;
            }
        }

        // Si no encuentra en users_to_verify, buscar en users (usuarios verificados)
        User user = entityManager.find(User.class, userId);
        if (user != null) {
            String doc = user.getSupportingDocument();
            if (doc != null && !doc.isEmpty()) {
                logger.info("Documento encontrado en users - userId: {}", userId);
                return doc;
            }
        }

        logger.warn("Usuario no encontrado en ninguna tabla: {}", userId);
        return null;
    }

    /**
     * Verifica si un usuario existe (en users_to_verify O users)
     */
    private boolean userExists(Long userId) {
        Optional<UserToVerify> userToVerify = userToVerifyCrudRepository.findById(userId);
        if (userToVerify.isPresent()) {
            return true;
        }

        User user = entityManager.find(User.class, userId);
        return user != null;
    }

    /**
     * Descarga un documento de soporte
     * GET /api/support-documents/download/{userId}
     *
     * Busca el documento en:
     * 1. users_to_verify (usuarios pendientes)
     * 2. users (usuarios verificados)
     */
    @GetMapping("/download/{userId}")
    public ResponseEntity<?> downloadUserDocument(
            @PathVariable Long userId,
            @RequestParam(value = "type", required = false) String type) {
        try {
            logger.info("Solicitud de descarga de documento - userId: {}, type: {}", userId, type);

            String documentUrl = null;

            // Si type es "pending", buscar SOLO en users_to_verify
            if ("pending".equalsIgnoreCase(type)) {
                Optional<UserToVerify> userToVerify = userToVerifyCrudRepository.findById(userId);
                if (userToVerify.isPresent()) {
                    documentUrl = userToVerify.get().getSupportingDocument();
                    logger.info("Usuario encontrado en users_to_verify - userId: {}", userId);
                } else {
                    logger.warn("Usuario no encontrado en users_to_verify: {}", userId);
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", false);
                    response.put("message", "Usuario no encontrado en usuarios pendientes");
                    return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
                }
            }
            // Si type es "verified", buscar SOLO en users
            else if ("verified".equalsIgnoreCase(type)) {
                User user = entityManager.find(User.class, userId);
                if (user != null) {
                    documentUrl = user.getSupportingDocument();
                    logger.info("Usuario encontrado en users - userId: {}", userId);
                } else {
                    logger.warn("Usuario no encontrado en users: {}", userId);
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", false);
                    response.put("message", "Usuario no encontrado en usuarios verificados");
                    return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
                }
            }
            // Si type es null, buscar en ambas (priorizando pending)
            else {
                // Verificar que el usuario existe en alguna tabla
                if (!userExists(userId)) {
                    logger.warn("Usuario no encontrado: {}", userId);
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", false);
                    response.put("message", "Usuario no encontrado");
                    return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
                }
                documentUrl = getUserSupportDocument(userId);
            }

            if (documentUrl == null || documentUrl.isEmpty()) {
                logger.warn("Usuario no tiene documento: {}", userId);
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "El usuario no tiene un documento de soporte registrado");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }

            // Extraer fileKey de la URL
            String fileKey = extractFileKeyFromUrl(documentUrl);

            // Descargar el archivo de Backblaze
            byte[] fileBytes = backblazeService.downloadDocument(fileKey);

            String contentType = getContentType(fileKey);
            String filename = extractFilename(fileKey);

            logger.info("Documento descargado exitosamente - userId: {}, filename: {}, size: {} bytes",
                    userId, filename, fileBytes.length);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                    .header(HttpHeaders.CONTENT_TYPE, contentType)
                    .body(fileBytes);

        } catch (Exception e) {
            logger.error("Error descargando documento - userId: {}, error: {}", userId, e.getMessage(), e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al descargar documento: " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Descarga un documento específico por su clave
     * GET /api/support-documents/download/{userId}/{fileKey}
     *
     * Busca el usuario en:
     * 1. users_to_verify (usuarios pendientes)
     * 2. users (usuarios verificados)
     *
     * Nota: fileKey debe contener "user_{userId}" para validación de acceso
     */
    @GetMapping("/download/{userId}/{fileKey}")
    public ResponseEntity<?> downloadSpecificDocument(
            @PathVariable Long userId,
            @PathVariable String fileKey) {
        try {
            logger.info("Solicitud de descarga de documento específico - userId: {}, fileKey: {}", userId, fileKey);

            // Verificar que el usuario existe en alguna tabla
            if (!userExists(userId)) {
                logger.warn("Usuario no encontrado: {}", userId);
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Usuario no encontrado");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }

            // Validar que la clave del archivo pertenece a este usuario
            if (!fileKey.contains("user_" + userId + "/")) {
                logger.warn("Intento de acceso no autorizado - userId: {}, fileKey: {}", userId, fileKey);
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Acceso denegado al documento");
                return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
            }

            // Descargar el archivo de Backblaze
            byte[] fileBytes = backblazeService.downloadDocument(fileKey);

            String contentType = getContentType(fileKey);
            String filename = extractFilename(fileKey);

            logger.info("Documento descargado exitosamente - userId: {}, filename: {}, size: {} bytes",
                    userId, filename, fileBytes.length);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                    .header(HttpHeaders.CONTENT_TYPE, contentType)
                    .body(fileBytes);

        } catch (Exception e) {
            logger.error("Error descargando documento específico - userId: {}, error: {}", userId, e.getMessage(), e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al descargar documento: " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Obtiene metadata de un documento (para preview, información, etc)
     * GET /api/support-documents/metadata/{userId}
     * GET /api/support-documents/metadata/{userId}?type=pending
     * GET /api/support-documents/metadata/{userId}?type=verified
     *
     * Parámetros de query:
     * - type: "pending" (users_to_verify), "verified" (users), o null (busca en ambas, priorizando pending)
     */
    @GetMapping("/metadata/{userId}")
    public ResponseEntity<?> getDocumentMetadata(
            @PathVariable Long userId,
            @RequestParam(value = "type", required = false) String type) {
        try {
            logger.info("Solicitud de metadata de documento - userId: {}, type: {}", userId, type);

            String documentUrl = null;

            // Si type es "pending", buscar SOLO en users_to_verify
            if ("pending".equalsIgnoreCase(type)) {
                Optional<UserToVerify> userToVerify = userToVerifyCrudRepository.findById(userId);
                if (userToVerify.isPresent()) {
                    documentUrl = userToVerify.get().getSupportingDocument();
                    logger.info("Usuario encontrado en users_to_verify - userId: {}", userId);
                } else {
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", false);
                    response.put("message", "Usuario no encontrado en usuarios pendientes");
                    return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
                }
            }
            // Si type es "verified", buscar SOLO en users
            else if ("verified".equalsIgnoreCase(type)) {
                User user = entityManager.find(User.class, userId);
                if (user != null) {
                    documentUrl = user.getSupportingDocument();
                    logger.info("Usuario encontrado en users - userId: {}", userId);
                } else {
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", false);
                    response.put("message", "Usuario no encontrado en usuarios verificados");
                    return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
                }
            }
            // Si type es null, buscar en ambas
            else {
                if (!userExists(userId)) {
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", false);
                    response.put("message", "Usuario no encontrado");
                    return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
                }
                documentUrl = getUserSupportDocument(userId);
            }

            if (documentUrl == null || documentUrl.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "El usuario no tiene documento de soporte");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }

            String fileKey = extractFileKeyFromUrl(documentUrl);
            var metadata = backblazeService.getDocumentMetadata(fileKey);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("userId", userId);
            response.put("filename", extractFilename(fileKey));
            response.put("size", metadata.contentLength());
            response.put("contentType", metadata.contentType());
            response.put("lastModified", metadata.lastModified());

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error obteniendo metadata - userId: {}, error: {}", userId, e.getMessage(), e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al obtener metadata: " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Determina el tipo de contenido basado en la extensión del archivo
     */
    private String getContentType(String fileKey) {
        String filename = fileKey.toLowerCase();

        if (filename.endsWith(".pdf")) {
            return "application/pdf";
        } else if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) {
            return "image/jpeg";
        } else if (filename.endsWith(".png")) {
            return "image/png";
        } else if (filename.endsWith(".gif")) {
            return "image/gif";
        } else if (filename.endsWith(".doc") || filename.endsWith(".docx")) {
            return "application/msword";
        } else if (filename.endsWith(".xls") || filename.endsWith(".xlsx")) {
            return "application/vnd.ms-excel";
        } else if (filename.endsWith(".zip")) {
            return "application/zip";
        } else {
            return "application/octet-stream";
        }
    }

    /**
     * Extrae el nombre del archivo de la clave completa
     */
    private String extractFilename(String key) {
        if (key == null || !key.contains("/")) return key;
        return key.substring(key.lastIndexOf("/") + 1);
    }
}
