package com.Backend.EPI.service;

import com.Backend.EPI.persistence.crud.ReportRepository;
import com.Backend.EPI.persistence.entity.Report;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReportService {
    @Autowired
    private ReportRepository reportRepository;

    public Report save(Report report) {
        return reportRepository.save(report);
    }

    public Optional<Report> getReport(Long id) {
        return reportRepository.findById(id);
    }

    public List<Report> getAllReports() {
        return (List<Report>) reportRepository.findAll();
    }

    public void deleteReport(Long id) {
        reportRepository.deleteById(id);
    }
}
