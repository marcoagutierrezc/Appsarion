package com.Backend.EPI.domain.dto;

import java.util.List;

public class EvaluationDTO {

    private Long id;
    private Long userId;
    private Double score;
    private String status;
    private String createdAt;
    private String updatedAt;

    private List<UserAnswerDTO> userAnswers;

    // Nuevo: resultados detallados incluyendo respuesta correcta
    private List<EvaluationAnswerResultDTO> results;

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

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }

    public List<UserAnswerDTO> getUserAnswers() {
        return userAnswers;
    }

    public void setUserAnswers(List<UserAnswerDTO> userAnswers) {
        this.userAnswers = userAnswers;
    }

    public List<EvaluationAnswerResultDTO> getResults() {
        return results;
    }

    public void setResults(List<EvaluationAnswerResultDTO> results) {
        this.results = results;
    }
}