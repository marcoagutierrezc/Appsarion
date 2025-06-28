package com.Backend.EPI.service;

import com.Backend.EPI.persistence.entity.Report;
import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
public class PdfGeneratorService {

    public ByteArrayInputStream generateReport(Report report) {
        try {
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            PdfWriter writer = new PdfWriter(out);
            com.itextpdf.kernel.pdf.PdfDocument pdfDoc = new com.itextpdf.kernel.pdf.PdfDocument(writer);
            Document document = new Document(pdfDoc);

            // Título del reporte
            Paragraph title = new Paragraph("Reporte de Evaluación")
                    .setFont(PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD))
                    .setFontSize(20)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(20);
            document.add(title);

            // Información del Piscicultor
            if (report.getRealData().getPiscicultor() != null) {
                document.add(new Paragraph("Información del Piscicultor")
                        .setFont(PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD))
                        .setFontSize(16)
                        .setMarginBottom(10));

                Table piscicultorTable = new Table(UnitValue.createPercentArray(new float[]{1, 2}))
                        .useAllAvailableWidth();

                piscicultorTable.addCell(getCell("Nombre:", true));
                piscicultorTable.addCell(getCell(report.getRealData().getPiscicultor().getUser().getName(), false));

                piscicultorTable.addCell(getCell("Tipo de Documento:", true));
                piscicultorTable.addCell(getCell(report.getRealData().getPiscicultor().getUser().getDocumentType(), false));

                piscicultorTable.addCell(getCell("Número de Documento:", true));
                piscicultorTable.addCell(getCell(String.valueOf(report.getRealData().getPiscicultor().getUser().getDocumentNumber()), false));

                piscicultorTable.addCell(getCell("Teléfono:", true));
                piscicultorTable.addCell(getCell(String.valueOf(report.getRealData().getPiscicultor().getUser().getPhoneNumber()), false));

                piscicultorTable.addCell(getCell("Email:", true));
                piscicultorTable.addCell(getCell(report.getRealData().getPiscicultor().getUser().getEmail(), false));

                piscicultorTable.addCell(getCell("Propiedad:", true));
                piscicultorTable.addCell(getCell(report.getRealData().getPiscicultor().getNameProperty(), false));

                piscicultorTable.addCell(getCell("Departamento:", true));
                piscicultorTable.addCell(getCell(report.getRealData().getPiscicultor().getDepartment(), false));

                piscicultorTable.addCell(getCell("Municipio:", true));
                piscicultorTable.addCell(getCell(report.getRealData().getPiscicultor().getMunicipality(), false));

                piscicultorTable.addCell(getCell("Barrio:", true));
                piscicultorTable.addCell(getCell(report.getRealData().getPiscicultor().getNeighborhood(), false));

                document.add(piscicultorTable);
                document.add(new Paragraph("\n"));
            }

            // Detalles de la Evaluación
            document.add(new Paragraph("Detalles de la Evaluación")
                    .setFont(PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD))
                    .setFontSize(16)
                    .setMarginBottom(10));

            Table evaluationTable = new Table(UnitValue.createPercentArray(new float[]{1, 2}))
                    .useAllAvailableWidth();

            evaluationTable.addCell(getCell("Ubicación:", true));
            evaluationTable.addCell(getCell(report.getRealData().getUbication(), false));

            evaluationTable.addCell(getCell("Fecha:", true));
            evaluationTable.addCell(getCell(report.getRealData().getDate().toString(), false));

            evaluationTable.addCell(getCell("Hora:", true));
            evaluationTable.addCell(getCell(report.getRealData().getHour().toString(), false));

            evaluationTable.addCell(getCell("Temperatura:", true));
            evaluationTable.addCell(getCell(report.getRealData().getTemperature(), false));

            evaluationTable.addCell(getCell("Olor:", true));
            evaluationTable.addCell(getCell(String.valueOf(report.getRealData().getSmell()), false));

            evaluationTable.addCell(getCell("Pelaje:", true));
            evaluationTable.addCell(getCell(String.valueOf(report.getRealData().getFur()), false));

            evaluationTable.addCell(getCell("Carne:", true));
            evaluationTable.addCell(getCell(String.valueOf(report.getRealData().getMeat()), false));

            evaluationTable.addCell(getCell("Ojos:", true));
            evaluationTable.addCell(getCell(String.valueOf(report.getRealData().getEyes()), false));

            evaluationTable.addCell(getCell("Textura:", true));
            evaluationTable.addCell(getCell(String.valueOf(report.getRealData().getTexture()), false));

            evaluationTable.addCell(getCell("Color:", true));
            evaluationTable.addCell(getCell(String.valueOf(report.getRealData().getColor()), false));

            evaluationTable.addCell(getCell("Branquias:", true));
            evaluationTable.addCell(getCell(String.valueOf(report.getRealData().getGills()), false));

            document.add(evaluationTable);
            document.add(new Paragraph("\n"));

            // Calificación Final
            Paragraph finalGrade = new Paragraph("Calificación Final: " + report.getFinalGrade())
                    .setFont(PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD))
                    .setFontSize(14)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginTop(20);
            document.add(finalGrade);

            document.close();
            return new ByteArrayInputStream(out.toByteArray());
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

// Método auxiliar para crear celdas de tabla con manejo de valores nulos
    private Cell getCell(Object text, boolean isHeader) throws IOException {
        String value = text != null ? text.toString() : "";  // Convertimos el valor a cadena, si es null, será una cadena vacía
        Cell cell = new Cell().add(new Paragraph(value));
        if (isHeader) {
            cell.setFont(PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD));
        }
        return cell;
    }

}
