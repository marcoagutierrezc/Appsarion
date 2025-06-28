package com.Backend.EPI.domain.dto;


public class AnswerDTO {

    private Long id;
    private Long questionId;
    private String answerText;
    private Boolean isCorrect;

    public AnswerDTO(Long id, String answerText, boolean isCorrect) {
        this.id = id;
        this.answerText = answerText;
        this.isCorrect = isCorrect;

    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public String getAnswerText() {
        return answerText;
    }

    public void setAnswerText(String answerText) {
        this.answerText = answerText;
    }

    public Boolean getIsCorrect() {
        return isCorrect;
    }

    public void setIsCorrect(Boolean isCorrect) {
        this.isCorrect = isCorrect;
    }
}

