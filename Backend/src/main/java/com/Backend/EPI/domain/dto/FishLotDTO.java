package com.Backend.EPI.domain.dto;

import jakarta.validation.constraints.NotNull;

public class FishLotDTO {

    private Long piscicultorId;
    private Long comercializadorId;
    private Long evaluadorId;
    private Long academicoId;

    @NotNull
    private String lotName;

    private String coordinates;
    private String department;
    private String municipality;
    private String vereda;

    private String neighborhood;

    // Getters y Setters
    public Long getPiscicultorId() {
        return piscicultorId;
    }

    public void setPiscicultorId(Long piscicultorId) {
        this.piscicultorId = piscicultorId;
    }

    public Long getComercializadorId() {
        return comercializadorId;
    }

    public void setComercializadorId(Long comercializadorId) {
        this.comercializadorId = comercializadorId;
    }

    public Long getEvaluadorId() {
        return evaluadorId;
    }

    public void setEvaluadorId(Long evaluadorId) {
        this.evaluadorId = evaluadorId;
    }

    public Long getAcademicoId() {
        return academicoId;
    }

    public void setAcademicoId(Long academicoId) {
        this.academicoId = academicoId;
    }

    public String getLotName() {
        return lotName;
    }

    public void setLotName(String lotName) {
        this.lotName = lotName;
    }

    public String getCoordinates() {
        return coordinates;
    }

    public void setCoordinates(String coordinates) {
        this.coordinates = coordinates;
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

    public String getVereda() {
        return vereda;
    }

    public void setVereda(String vereda) {
        this.vereda = vereda;
    }

    public String getNeighborhood() {
        return neighborhood;
    }

    public void setNeighborhood(String neighborhood) {
        this.neighborhood = neighborhood;
    }
}
