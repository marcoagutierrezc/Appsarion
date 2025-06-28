package com.Backend.EPI.persistence.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "fish_lot")
public class FishLot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "piscicultorId")
    private Long piscicultorId;

    @Column(name = "comercializador_id")
    private Long comercializadorId;

    @Column(name = "evaluador_id")
    private Long evaluadorId;

    @Column(name = "academico_id")
    private Long academicoId;

    @Column(name = "address")
    private String address;

    @Column(name = "lot_name")
    private String lotName;

    @Column(name = "coordinates")
    private String coordinates;

    @Column(name = "department")
    private String department;

    @Column(name = "municipality")
    private String municipality;

    @Column(name = "neighborhood")
    private String neighborhood;

    @Column(name = "vereda")
    private String vereda;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPiscicultorId() {
        return piscicultorId;
    }

    public void setPiscicultorId(Long piscicultorId) {
        this.piscicultorId = piscicultorId;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
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

    public String getNeighborhood() {
        return neighborhood;
    }

    public void setNeighborhood(String neighborhood) {
        this.neighborhood = neighborhood;
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

    public String getVereda() {
        return vereda;
    }

    public void setVereda(String vereda) {
        this.vereda = vereda;
    }
}
