package com.Backend.EPI.domain.dto;

import java.sql.Timestamp; // Correcto.

public class CertificateDTO {

    private Long id;
    private Long userId;
    private Long evaluationId;
    private String certificateCode;
    private String issuedAt;

    public CertificateDTO(Long id, String certificateCode, Timestamp issuedAt, Long userId, Long evaluationId) {
        this.id = id;
        this.certificateCode = certificateCode;
        this.issuedAt = issuedAt.toString(); // Convertir Timestamp a String
        this.userId = userId;
        this.evaluationId = evaluationId;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getEvaluationId() {
        return evaluationId;
    }

    public void setEvaluationId(Long evaluationId) {
        this.evaluationId = evaluationId;
    }

    public String getCertificateCode() {
        return certificateCode;
    }

    public void setCertificateCode(String certificateCode) {
        this.certificateCode = certificateCode;
    }

    public String getIssuedAt() {
        return issuedAt;
    }

    public void setIssuedAt(String issuedAt) {
        this.issuedAt = issuedAt;
    }
}
