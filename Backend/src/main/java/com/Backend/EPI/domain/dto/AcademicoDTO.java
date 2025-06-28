package com.Backend.EPI.domain.dto;

public class AcademicoDTO {
    private Long id;
    private String institution;
    private String career;
    private String course;

    // Getters and Setters
    public Long getId() {return id;}

    public void setId(Long id) {this.id = id;}

    public String getInstitution() {
        return institution;
    }

    public void setInstitution(String institution) {
        this.institution = institution;
    }

    public String getCareer() {
        return career;
    }

    public void setCareer(String career) {
        this.career = career;
    }

    public String getCourse() {
        return course;
    }

    public void setCourse(String course) {
        this.course = course;
    }
}

