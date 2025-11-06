package com.Backend.EPI.domain.dto;

public class EvaluationAnswerResultDTO {
    private Long questionId;
    private Long selectedAnswerId;
    private Long correctAnswerId;
    private String correctAnswerText;
    private boolean correct;

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public Long getSelectedAnswerId() {
        return selectedAnswerId;
    }

    public void setSelectedAnswerId(Long selectedAnswerId) {
        this.selectedAnswerId = selectedAnswerId;
    }

    public Long getCorrectAnswerId() {
        return correctAnswerId;
    }

    public void setCorrectAnswerId(Long correctAnswerId) {
        this.correctAnswerId = correctAnswerId;
    }

    public String getCorrectAnswerText() {
        return correctAnswerText;
    }

    public void setCorrectAnswerText(String correctAnswerText) {
        this.correctAnswerText = correctAnswerText;
    }

    public boolean isCorrect() {
        return correct;
    }

    public void setCorrect(boolean correct) {
        this.correct = correct;
    }
}

