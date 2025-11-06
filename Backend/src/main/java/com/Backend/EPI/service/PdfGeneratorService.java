package com.Backend.EPI.service;

import com.Backend.EPI.persistence.entity.Report;
import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.events.Event;
import com.itextpdf.kernel.events.IEventHandler;
import com.itextpdf.kernel.events.PdfDocumentEvent;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.Rectangle;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfPage;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.canvas.PdfCanvas;
import com.itextpdf.layout.Canvas;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.Date;

@Service
public class PdfGeneratorService {

    public ByteArrayInputStream generateReport(Report report) {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdfDoc = new PdfDocument(writer);

            // Cargar logos
            byte[] logoBytes = loadImageBytes("logo.png");
            byte[] logoAppsarionBytes = loadImageBytes("LogoName.png");

            // Agregar event handler para header y footer
            HeaderFooterHandler handler = new HeaderFooterHandler(logoBytes, logoAppsarionBytes);
            pdfDoc.addEventHandler(PdfDocumentEvent.END_PAGE, handler);

            Document document = new Document(pdfDoc);
            document.setMargins(120, 36, 80, 36);

            PdfFont boldFont = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);
            PdfFont normalFont = PdfFontFactory.createFont(StandardFonts.HELVETICA);
            PdfFont italicFont = PdfFontFactory.createFont(StandardFonts.HELVETICA_OBLIQUE);

            DeviceRgb primaryColor = new DeviceRgb(11, 94, 215); // #0B5ED7
            DeviceRgb mutedColor = new DeviceRgb(107, 114, 128);

            // Sección 1: Información del Piscicultor
            addSectionTitle(document, "Información del Piscicultor", boldFont, primaryColor);
            Table piscicultorTable = createDataTable();
            addDataRow(piscicultorTable, "Nombre", safe(report.getRealData().getPiscicultor().getUser().getName()), boldFont, normalFont);
            addDataRow(piscicultorTable, "Tipo de Documento", safe(report.getRealData().getPiscicultor().getUser().getDocumentType()), boldFont, normalFont);
            addDataRow(piscicultorTable, "Número de Documento", String.valueOf(report.getRealData().getPiscicultor().getUser().getDocumentNumber()), boldFont, normalFont);
            addDataRow(piscicultorTable, "Teléfono", String.valueOf(report.getRealData().getPiscicultor().getUser().getPhoneNumber()), boldFont, normalFont);
            addDataRow(piscicultorTable, "Email", safe(report.getRealData().getPiscicultor().getUser().getEmail()), boldFont, normalFont);
            addDataRow(piscicultorTable, "Propiedad", safe(report.getRealData().getPiscicultor().getNameProperty()), boldFont, normalFont);
            addDataRow(piscicultorTable, "Departamento", safe(report.getRealData().getPiscicultor().getDepartment()), boldFont, normalFont);
            addDataRow(piscicultorTable, "Municipio", safe(report.getRealData().getPiscicultor().getMunicipality()), boldFont, normalFont);
            addDataRow(piscicultorTable, "Barrio", safe(report.getRealData().getPiscicultor().getNeighborhood()), boldFont, normalFont);
            document.add(piscicultorTable);

            // Sección 2: Detalles de la Evaluación
            addSectionTitle(document, "Detalles de la Evaluación", boldFont, primaryColor);
            Table evaluacionTable = createDataTable();
            addDataRow(evaluacionTable, "Ubicación", safe(report.getRealData().getUbication()), boldFont, normalFont);
            addDataRow(evaluacionTable, "Fecha", formatDate(report.getRealData().getDate()), boldFont, normalFont);
            addDataRow(evaluacionTable, "Hora", formatTime(report.getRealData().getHour()), boldFont, normalFont);
            addDataRow(evaluacionTable, "Temperatura", safe(report.getRealData().getTemperature()) + " °C", boldFont, normalFont);
            addDataRowWithDetail(evaluacionTable, "Olor", report.getRealData().getSmell(), boldFont, normalFont, italicFont, mutedColor);
            addDataRowWithDetail(evaluacionTable, "Pelaje", report.getRealData().getFur(), boldFont, normalFont, italicFont, mutedColor);
            addDataRowWithDetail(evaluacionTable, "Carne", report.getRealData().getMeat(), boldFont, normalFont, italicFont, mutedColor);
            addDataRowWithDetail(evaluacionTable, "Ojos", report.getRealData().getEyes(), boldFont, normalFont, italicFont, mutedColor);
            addDataRowWithDetail(evaluacionTable, "Textura", report.getRealData().getTexture(), boldFont, normalFont, italicFont, mutedColor);
            addDataRowWithDetail(evaluacionTable, "Color", report.getRealData().getColor(), boldFont, normalFont, italicFont, mutedColor);
            addDataRowWithDetail(evaluacionTable, "Branquias", report.getRealData().getGills(), boldFont, normalFont, italicFont, mutedColor);
            addDataRow(evaluacionTable, "Especie", safe(String.valueOf(report.getRealData().getSpecies())), boldFont, normalFont);
            addDataRow(evaluacionTable, "Peso Promedio", report.getRealData().getAverageWeight() != null ? report.getRealData().getAverageWeight().toString() + " g" : "", boldFont, normalFont);
            addDataRow(evaluacionTable, "Cantidad", report.getRealData().getQuantity() != null ? report.getRealData().getQuantity().toString() : "", boldFont, normalFont);
            addDataRow(evaluacionTable, "Observaciones", safe(report.getRealData().getObservations()), boldFont, normalFont);
            document.add(evaluacionTable);

            // Sección 3: Información del Lote
            if (report.getRealData().getFishLot() != null) {
                addSectionTitle(document, "Información del Lote", boldFont, primaryColor);
                Table loteTable = createDataTable();
                addDataRow(loteTable, "Nombre del Lote", safe(report.getRealData().getFishLot().getLotName()), boldFont, normalFont);
                addDataRow(loteTable, "Coordenadas", safe(report.getRealData().getFishLot().getCoordinates()), boldFont, normalFont);
                addDataRow(loteTable, "Departamento", safe(report.getRealData().getFishLot().getDepartment()), boldFont, normalFont);
                addDataRow(loteTable, "Municipio", safe(report.getRealData().getFishLot().getMunicipality()), boldFont, normalFont);
                addDataRow(loteTable, "Barrio", safe(report.getRealData().getFishLot().getNeighborhood()), boldFont, normalFont);
                addDataRow(loteTable, "Vereda", safe(report.getRealData().getFishLot().getVereda()), boldFont, normalFont);
                document.add(loteTable);
            }

            // Calificación Final
            Paragraph finalGrade = new Paragraph("Calificación Final: " + report.getFinalGrade())
                    .setFont(boldFont)
                    .setFontSize(14)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginTop(20)
                    .setFontColor(report.getFinalGrade() >= 3.0 ? new DeviceRgb(6, 95, 70) : new DeviceRgb(153, 27, 27))
                    .setPadding(8)
                    .setBackgroundColor(report.getFinalGrade() >= 3.0 ? new DeviceRgb(236, 253, 245) : new DeviceRgb(254, 242, 242))
                    .setBorder(new SolidBorder(report.getFinalGrade() >= 3.0 ? new DeviceRgb(16, 185, 129) : new DeviceRgb(239, 68, 68), 1));
            document.add(finalGrade);

            document.close();
            return new ByteArrayInputStream(baos.toByteArray());
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private void addSectionTitle(Document document, String title, PdfFont font, DeviceRgb color) {
        Paragraph p = new Paragraph(title)
                .setFont(font)
                .setFontSize(14)
                .setFontColor(ColorConstants.BLACK)
                .setMarginTop(16)
                .setMarginBottom(8)
                .setBorderBottom(new SolidBorder(color, 2))
                .setPaddingBottom(4);
        document.add(p);
    }

    private Table createDataTable() {
        Table table = new Table(UnitValue.createPercentArray(new float[]{35, 65}));
        table.setWidth(UnitValue.createPercentValue(100));
        table.setMarginBottom(10);
        return table;
    }

    private void addDataRow(Table table, String label, String value, PdfFont boldFont, PdfFont normalFont) throws Exception {
        Cell labelCell = new Cell().add(new Paragraph(label).setFont(boldFont).setFontSize(11))
                .setBackgroundColor(new DeviceRgb(248, 250, 252))
                .setBorder(Border.NO_BORDER)
                .setBorderBottom(new SolidBorder(new DeviceRgb(229, 231, 235), 1))
                .setPadding(6);
        Cell valueCell = new Cell().add(new Paragraph(value).setFont(normalFont).setFontSize(11))
                .setBorder(Border.NO_BORDER)
                .setBorderBottom(new SolidBorder(new DeviceRgb(241, 245, 249), 1))
                .setPadding(6);
        table.addCell(labelCell);
        table.addCell(valueCell);
    }

    private void addDataRowWithDetail(Table table, String label, int value, PdfFont boldFont, PdfFont normalFont, PdfFont italicFont, DeviceRgb mutedColor) throws Exception {
        String detailText = getCalificacionTexto(value);
        Paragraph valuePara = new Paragraph()
                .add(new Paragraph(String.valueOf(value)).setFont(normalFont).setFontSize(11))
                .add(new Paragraph(" " + detailText).setFont(italicFont).setFontSize(10).setFontColor(mutedColor));

        Cell labelCell = new Cell().add(new Paragraph(label).setFont(boldFont).setFontSize(11))
                .setBackgroundColor(new DeviceRgb(248, 250, 252))
                .setBorder(Border.NO_BORDER)
                .setBorderBottom(new SolidBorder(new DeviceRgb(229, 231, 235), 1))
                .setPadding(6);
        Cell valueCell = new Cell().add(valuePara)
                .setBorder(Border.NO_BORDER)
                .setBorderBottom(new SolidBorder(new DeviceRgb(241, 245, 249), 1))
                .setPadding(6);
        table.addCell(labelCell);
        table.addCell(valueCell);
    }

    private byte[] loadImageBytes(String classpathImage) throws Exception {
        ClassPathResource img = new ClassPathResource(classpathImage);
        try (InputStream is = img.getInputStream()) {
            return is.readAllBytes();
        }
    }

    private String safe(String v) {
        return v == null ? "" : v;
    }

    private String formatDate(Date date) {
        if (date == null) return "";
        SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy");
        return sdf.format(date);
    }

    private String formatTime(Date time) {
        if (time == null) return "";
        SimpleDateFormat sdf = new SimpleDateFormat("HH:mm");
        return sdf.format(time);
    }

    private String getCalificacionTexto(int calificacion) {
        switch (calificacion) {
            case 1: return "(Muy Deficiente)";
            case 2: return "(Deficiente)";
            case 3: return "(Aceptable)";
            case 4: return "(Bueno)";
            case 5: return "(Excelente)";
            default: return "";
        }
    }

    // Event handler para header y footer
    static class HeaderFooterHandler implements IEventHandler {
        private final byte[] logoBytes;
        private final byte[] logoAppsarionBytes;

        public HeaderFooterHandler(byte[] logoBytes, byte[] logoAppsarionBytes) {
            this.logoBytes = logoBytes;
            this.logoAppsarionBytes = logoAppsarionBytes;
        }

        @Override
        public void handleEvent(Event event) {
            PdfDocumentEvent docEvent = (PdfDocumentEvent) event;
            PdfDocument pdfDoc = docEvent.getDocument();
            PdfPage page = docEvent.getPage();
            Rectangle pageSize = page.getPageSize();

            try {
                PdfFont font = PdfFontFactory.createFont(StandardFonts.HELVETICA);
                PdfFont boldFont = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);

                // Header
                PdfCanvas canvas = new PdfCanvas(page.newContentStreamBefore(), page.getResources(), pdfDoc);
                Canvas headerCanvas = new Canvas(canvas, new Rectangle(36, pageSize.getTop() - 100, pageSize.getWidth() - 72, 90));

                // Logos
                Image logo = new Image(ImageDataFactory.create(logoBytes));
                logo.setFixedPosition(50, pageSize.getTop() - 90);
                logo.scaleToFit(60, 60);
                headerCanvas.add(logo);

                Image logoAppsarion = new Image(ImageDataFactory.create(logoAppsarionBytes));
                logoAppsarion.setFixedPosition(120, pageSize.getTop() - 90);
                logoAppsarion.scaleToFit(60, 60);
                headerCanvas.add(logoAppsarion);

                // Título
                Paragraph title = new Paragraph("Reporte de Evaluación de Calidad")
                        .setFont(boldFont)
                        .setFontSize(16)
                        .setFontColor(new DeviceRgb(11, 94, 215))
                        .setTextAlignment(TextAlignment.RIGHT)
                        .setFixedPosition(pageSize.getWidth() - 250, pageSize.getTop() - 70, 200);
                headerCanvas.add(title);

                // Línea separadora
                canvas.setStrokeColor(new DeviceRgb(11, 94, 215))
                      .setLineWidth(2)
                      .moveTo(36, pageSize.getTop() - 105)
                      .lineTo(pageSize.getWidth() - 36, pageSize.getTop() - 105)
                      .stroke();

                headerCanvas.close();

                // Footer
                Canvas footerCanvas = new Canvas(canvas, new Rectangle(36, 20, pageSize.getWidth() - 72, 50));

                // Línea separadora superior
                canvas.setStrokeColor(new DeviceRgb(229, 231, 235))
                      .setLineWidth(1)
                      .moveTo(36, 70)
                      .lineTo(pageSize.getWidth() - 36, 70)
                      .stroke();

                Paragraph footer = new Paragraph("📧 appsarion.unillanos@gmail.com")
                        .setFont(font)
                        .setFontSize(11)
                        .setFontColor(new DeviceRgb(107, 114, 128))
                        .setTextAlignment(TextAlignment.CENTER);
                footerCanvas.showTextAligned(footer, pageSize.getWidth() / 2, 45, TextAlignment.CENTER);

                footerCanvas.close();

            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}
