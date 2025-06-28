package com.Backend.EPI.domain.dto;


public class EvaluadorDTO {
    private Long id;
    private String company;
    private String employment;

    // Getters and Setters
    public Long getId() {return id;}

    public void setId(Long id) {this.id = id;}

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getEmployment() {
        return employment;
    }

    public void setEmployment(String employment) {
        this.employment = employment;
    }
}


