package com.Backend.EPI.domain.dto;

import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class RealDataDTO {
    @NotNull
    private Long fishLotId;

    @NotNull
    private Long piscicultorId;

    private Long evaluadorId;
    private Long comercializadorId;

    @NotNull
    private String ubication;

    @NotNull
    private String date;

    @NotNull
    private String hour;

    @NotNull
    private String temperature;

    @NotNull
    private int smell;

    @NotNull
    private int fur;

    @NotNull
    private int meat;

    @NotNull
    private int eyes;

    @NotNull
    private int texture;

    @NotNull
    private int color;

    @NotNull
    private int gills;

    private String species;
    private BigDecimal averageWeight;
    private Integer quantity;

    // Nuevo: Observaciones del evaluador
    private String observations;

    // Getters and Setters
    public Long getFishLotId() {
        return fishLotId;
    }

    public void setFishLotId(Long fishLotId) {
        this.fishLotId = fishLotId;
    }

    public Long getPiscicultorId() {
        return piscicultorId;
    }

    public void setPiscicultorId(Long piscicultorId) {
        this.piscicultorId = piscicultorId;
    }

    public Long getEvaluadorId() {
        return evaluadorId;
    }

    public void setEvaluadorId(Long evaluadorId) {
        this.evaluadorId = evaluadorId;
    }

    public Long getComercializadorId() {
        return comercializadorId;
    }

    public void setComercializadorId(Long comercializadorId) {
        this.comercializadorId = comercializadorId;
    }

    public String getUbication() {
        return ubication;
    }

    public void setUbication(String ubication) {
        this.ubication = ubication;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getHour() {
        return hour;
    }

    public void setHour(String hour) {
        this.hour = hour;
    }

    public String getTemperature() {
        return temperature;
    }

    public void setTemperature(String temperature) {
        this.temperature = temperature;
    }

    public int getSmell() {
        return smell;
    }

    public void setSmell(int smell) {
        this.smell = smell;
    }

    public int getFur() {
        return fur;
    }

    public void setFur(int fur) {
        this.fur = fur;
    }

    public int getMeat() {
        return meat;
    }

    public void setMeat(int meat) {
        this.meat = meat;
    }

    public int getEyes() {
        return eyes;
    }

    public void setEyes(int eyes) {
        this.eyes = eyes;
    }

    public int getTexture() {
        return texture;
    }

    public void setTexture(int texture) {
        this.texture = texture;
    }

    public int getColor() {
        return color;
    }

    public void setColor(int color) {
        this.color = color;
    }

    public int getGills() {
        return gills;
    }

    public void setGills(int gills) {
        this.gills = gills;
    }

    public String getSpecies() {
        return species;
    }

    public void setSpecies(String species) {
        this.species = species;
    }

    public BigDecimal getAverageWeight() {
        return averageWeight;
    }

    public void setAverageWeight(BigDecimal averageWeight) {
        this.averageWeight = averageWeight;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getObservations() {
        return observations;
    }

    public void setObservations(String observations) {
        this.observations = observations;
    }
}
