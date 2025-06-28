package com.Backend.EPI.web.controller;

import com.Backend.EPI.domain.dto.ReportDTO;
import com.Backend.EPI.persistence.entity.RealData;
import com.Backend.EPI.persistence.entity.Report;
import com.Backend.EPI.service.PdfGeneratorService;
import com.Backend.EPI.service.RealDataService;
import com.Backend.EPI.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/reports")
public class ReportController {

    private static final Logger logger = LoggerFactory.getLogger(ReportController.class);

    @Autowired
    private ReportService reportService;

    @Autowired
    private RealDataService realDataService;

    @Autowired
    private PdfGeneratorService pdfGeneratorService;

    @PostMapping
    public ResponseEntity<Object> save(@Validated @RequestBody ReportDTO reportDTO) {
        logger.info("Received ReportDTO: {}", reportDTO);

        Optional<RealData> realDataOptional = realDataService.getRealData(reportDTO.getRealDataId());

        if (!realDataOptional.isPresent()) {
            logger.error("RealData with ID {} not found", reportDTO.getRealDataId());
            return new ResponseEntity<>("RealData with given ID not found", HttpStatus.BAD_REQUEST);
        }

        RealData realData = realDataOptional.get();
        float finalGrade = (float) (realData.getSmell() + realData.getFur() + realData.getMeat() +
                realData.getEyes() + realData.getTexture() + realData.getColor() + realData.getGills()) / 7;

        finalGrade = Math.round(finalGrade * 10) / 10.0f;
        Report report = new Report();
        report.setRealData(realDataOptional.get());
        report.setFinalGrade(finalGrade);

        Report savedReport = reportService.save(report);
        logger.info("Saved Report: {}", savedReport);

        return new ResponseEntity<>(savedReport, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Report> getReport(@PathVariable Long id) {
        return reportService.getReport(id)
                .map(report -> new ResponseEntity<>(report, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping
    public ResponseEntity<List<Report>> getAllReports() {
        return new ResponseEntity<>(reportService.getAllReports(), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReport(@PathVariable Long id) {
        reportService.deleteReport(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/pdf")
    public ResponseEntity<byte[]> downloadReport(@RequestParam Long reportId) {
        Optional<Report> reportOptional = reportService.getReport(reportId);
        if (!reportOptional.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Report report = reportOptional.get();
        ByteArrayInputStream bis = pdfGeneratorService.generateReport(report);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "inline; filename=report.pdf");

        byte[] pdfBytes = bis.readAllBytes();

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }
}
