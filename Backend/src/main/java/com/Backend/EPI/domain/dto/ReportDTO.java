package com.Backend.EPI.domain.dto;

import jakarta.validation.constraints.NotNull;

public class ReportDTO {
    @NotNull
    private Long realDataId;

    private String finalGrade;

    // Getters and Setters
    public Long getRealDataId() {
        return realDataId;
    }

    public void setRealDataId(Long realDataId) {
        this.realDataId = realDataId;
    }

    public String getFinalGrade() {
        return finalGrade;
    }

    public void setFinalGrade(String finalGrade) {
        this.finalGrade = finalGrade;
    }
}
