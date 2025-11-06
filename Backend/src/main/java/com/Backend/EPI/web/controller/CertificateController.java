package com.Backend.EPI.web.controller;

import com.Backend.EPI.domain.dto.CertificateDTO;
import com.Backend.EPI.persistence.entity.Certificate;
import com.Backend.EPI.service.CertificateService;
import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.List;


@RestController
@RequestMapping("/certificates")
public class CertificateController {

    private final CertificateService certificateService;

    @Autowired
    public CertificateController(CertificateService certificateService) {
        this.certificateService = certificateService;
    }

    // Generar un certificado para un usuario que aprobó una evaluación
    @PostMapping("/generate/{userId}/{evaluationId}")
    public ResponseEntity<CertificateDTO> generateCertificate(@PathVariable Long userId,
                                                              @PathVariable Long evaluationId) {
        try {
            CertificateDTO certificate = certificateService.generateCertificate(userId, evaluationId);
            return new ResponseEntity<>(certificate, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }



    @GetMapping("/{certificateId}")
    public ResponseEntity<Certificate> getCertificateById(@PathVariable Long certificateId) {
        Certificate certificate = certificateService.getCertificateById(certificateId);
        if (certificate != null) {
            return ResponseEntity.ok(certificate);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/download/{certificateId}")
    public ResponseEntity<InputStreamResource> downloadCertificate(@PathVariable Long certificateId) {
        Certificate certificate = certificateService.getCertificateById(certificateId);
        if (certificate == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        try {
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            PdfWriter writer = new PdfWriter(out);
            PdfDocument pdfDoc = new PdfDocument(writer);
            Document document = new Document(pdfDoc);
            document.setMargins(50, 50, 50, 50);

            // Agregar logo
            try {
                ClassPathResource logoResource = new ClassPathResource("logo.png");
                InputStream logoStream = logoResource.getInputStream();
                byte[] logoBytes = logoStream.readAllBytes();
                Image logo = new Image(ImageDataFactory.create(logoBytes));
                logo.setWidth(150);
                logo.setHeight(150);
                logo.setHorizontalAlignment(com.itextpdf.layout.properties.HorizontalAlignment.CENTER);
                document.add(logo);
            } catch (Exception imgEx) {
                System.out.println("Advertencia: No se pudo cargar la imagen del logo.");
                imgEx.printStackTrace();
            }

            // Título del certificado
            Paragraph title = new Paragraph("CERTIFICADO DE CAPACITACIÓN")
                    .setFont(PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD))
                    .setFontSize(28)
                    .setFontColor(ColorConstants.BLACK)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginTop(20);
            document.add(title);

            document.add(new Paragraph("\n"));

            // Información principal
            Paragraph subtitle = new Paragraph("Certifica a:")
                    .setFont(PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD))
                    .setFontSize(20)
                    .setFontColor(new DeviceRgb(64, 64, 64))
                    .setTextAlignment(TextAlignment.CENTER);
            document.add(subtitle);

            Paragraph userName = new Paragraph(certificate.getUser().getName())
                    .setFont(PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD))
                    .setFontSize(28)
                    .setFontColor(ColorConstants.BLACK)
                    .setTextAlignment(TextAlignment.CENTER);
            document.add(userName);

            document.add(new Paragraph("\n"));

            // Curso
            Paragraph courseText = new Paragraph("Por completar satisfactoriamente el curso:")
                    .setFont(PdfFontFactory.createFont(StandardFonts.HELVETICA))
                    .setFontSize(14)
                    .setTextAlignment(TextAlignment.CENTER);
            document.add(courseText);

            Paragraph courseName = new Paragraph("PISCICULTURA BASADO EN LA NORMA NTC 1443")
                    .setFont(PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD))
                    .setFontSize(20)
                    .setFontColor(new DeviceRgb(64, 64, 64))
                    .setTextAlignment(TextAlignment.CENTER);
            document.add(courseName);

            document.add(new Paragraph("\n"));

            // Tabla con detalles del certificado
            Table table = new Table(UnitValue.createPercentArray(new float[]{1, 2}));
            table.setWidth(UnitValue.createPercentValue(80));
            table.setHorizontalAlignment(com.itextpdf.layout.properties.HorizontalAlignment.CENTER);
            table.setMarginTop(20);

            addTableCell(table, "Código del Certificado:", true);
            addTableCell(table, certificate.getCertificateCode(), false);
            addTableCell(table, "Evaluación:", true);
            addTableCell(table, String.valueOf(certificate.getEvaluation().getId()), false);
            addTableCell(table, "Emitido el:", true);
            addTableCell(table, certificate.getIssuedAt().toString(), false);

            document.add(table);

            document.add(new Paragraph("\n\n"));

            // Agregar firma
            try {
                ClassPathResource firmaResource = new ClassPathResource("firma.png");
                InputStream firmaStream = firmaResource.getInputStream();
                byte[] firmaBytes = firmaStream.readAllBytes();
                Image firma = new Image(ImageDataFactory.create(firmaBytes));
                firma.setWidth(150);
                firma.setHeight(50);
                firma.setHorizontalAlignment(com.itextpdf.layout.properties.HorizontalAlignment.CENTER);
                document.add(firma);
            } catch (Exception imgEx) {
                System.out.println("Advertencia: No se pudo cargar la firma.");
            }

            Paragraph firmante = new Paragraph("Director Académico")
                    .setFont(PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD))
                    .setFontSize(14)
                    .setTextAlignment(TextAlignment.CENTER);
            document.add(firmante);

            document.close();

            ByteArrayInputStream in = new ByteArrayInputStream(out.toByteArray());

            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Disposition", "inline; filename=certificate.pdf");

            return ResponseEntity.ok()
                    .headers(headers)
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(new InputStreamResource(in));
        } catch (Exception e) {
            System.out.println("Error al generar el certificado PDF:");
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private void addTableCell(Table table, String text, boolean isBold) throws Exception {
        Cell cell = new Cell().add(new Paragraph(text)
                .setFont(PdfFontFactory.createFont(isBold ? StandardFonts.HELVETICA_BOLD : StandardFonts.HELVETICA))
                .setFontSize(14));
        cell.setBorder(Border.NO_BORDER);
        table.addCell(cell);
    }


    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Certificate>> getCertificatesByUserId(@PathVariable Long userId) {
        List<Certificate> certificates = certificateService.getCertificatesByUserId(userId);
        return ResponseEntity.ok(certificates);
    }



}
