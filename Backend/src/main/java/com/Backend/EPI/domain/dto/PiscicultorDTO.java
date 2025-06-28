package com.Backend.EPI.domain.dto;

public class PiscicultorDTO {
    private Long id;
    private String nameProperty;
    private String department;
    private String municipality;
    private String neighborhood;

    // Getters and Setters
    public Long getId() {return id;}

    public void setId(Long id) {this.id = id;}

    public String getNameProperty() {
        return nameProperty;
    }

    public void setNameProperty(String nameProperty) {
        this.nameProperty = nameProperty;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getMunicipality() {
        return municipality;
    }

    public void setMunicipality(String municipality) {
        this.municipality = municipality;
    }

    public String getNeighborhood() {
        return neighborhood;
    }

    public void setNeighborhood(String neighborhood) {
        this.neighborhood = neighborhood;
    }
}

