package com.Backend.EPI.web.controller;

import com.Backend.EPI.domain.dto.CertificateDTO;
import com.Backend.EPI.persistence.entity.Certificate;
import com.Backend.EPI.service.CertificateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import com.itextpdf.text.*;
import java.util.List;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;

import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;


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
            Document document = new Document(PageSize.A4, 50, 50, 50, 50); // Márgenes
            PdfWriter.getInstance(document, out);
            document.open();

            // Fuentes
            Font titleFont = new Font(Font.FontFamily.HELVETICA, 28, Font.BOLD, BaseColor.BLACK);
            Font subtitleFont = new Font(Font.FontFamily.HELVETICA, 20, Font.BOLD, BaseColor.DARK_GRAY);
            Font normalFont = new Font(Font.FontFamily.HELVETICA, 14, Font.NORMAL);
            Font boldFont = new Font(Font.FontFamily.HELVETICA, 14, Font.BOLD);

            // Agregar logo
            try {
                String logoPath = getClass().getClassLoader().getResource("logo.png").getPath();
                Image logo = Image.getInstance(logoPath);
                logo.scaleToFit(150, 150);
                logo.setAlignment(Element.ALIGN_CENTER);
                document.add(logo);
            } catch (Exception imgEx) {
                System.out.println("Advertencia: No se pudo cargar la imagen del logo.");
                imgEx.printStackTrace();
            }

            // Título del certificado
            Paragraph title = new Paragraph("CERTIFICADO DE CAPACITACIÓN", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            document.add(new Paragraph("\n\n"));

            // Información principal
            Paragraph subtitle = new Paragraph("Certifica a:", subtitleFont);
            subtitle.setAlignment(Element.ALIGN_CENTER);
            document.add(subtitle);

            Paragraph userName = new Paragraph(certificate.getUser().getName(), titleFont);
            userName.setAlignment(Element.ALIGN_CENTER);
            document.add(userName);

            document.add(new Paragraph("\n\n"));

            // Curso
            Paragraph courseText = new Paragraph("Por completar satisfactoriamente el curso:", normalFont);
            courseText.setAlignment(Element.ALIGN_CENTER);
            document.add(courseText);

            Paragraph courseName = new Paragraph("PISCICULTURA BASADO EN LA NORMA NTC 1443", subtitleFont);
            courseName.setAlignment(Element.ALIGN_CENTER);
            document.add(courseName);

            document.add(new Paragraph("\n\n"));

            // Tabla con detalles del certificado
            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(80);
            table.setSpacingBefore(20f);
            table.setHorizontalAlignment(Element.ALIGN_CENTER);

            addTableCell(table, "Código del Certificado:", boldFont);
            addTableCell(table, certificate.getCertificateCode(), normalFont);
            addTableCell(table, "Evaluación:", boldFont);
            addTableCell(table, String.valueOf(certificate.getEvaluation().getId()), normalFont);
            addTableCell(table, "Emitido el:", boldFont);
            addTableCell(table, certificate.getIssuedAt().toString(), normalFont);

            document.add(table);

            document.add(new Paragraph("\n\n"));

            // Agregar firma
            try {
                String firmaPath = getClass().getClassLoader().getResource("firma.png").getPath();
                Image firma = Image.getInstance(firmaPath);
                firma.scaleToFit(150, 50);
                firma.setAlignment(Element.ALIGN_CENTER);
                document.add(firma);
            } catch (Exception imgEx) {
                System.out.println("Advertencia: No se pudo cargar la firma.");
            }

            Paragraph firmante = new Paragraph("Director Académico", boldFont);
            firmante.setAlignment(Element.ALIGN_CENTER);
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

    private void addTableCell(PdfPTable table, String text, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setBorder(Rectangle.NO_BORDER);
        table.addCell(cell);
    }


    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Certificate>> getCertificatesByUserId(@PathVariable Long userId) {
        List<Certificate> certificates = certificateService.getCertificatesByUserId(userId);
        return ResponseEntity.ok(certificates);
    }



}
