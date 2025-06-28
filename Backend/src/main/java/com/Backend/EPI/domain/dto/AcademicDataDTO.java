package com.Backend.EPI.domain.dto;

import jakarta.validation.constraints.NotNull;
import java.sql.Date;
import java.sql.Time;

public class AcademicDataDTO {
    @NotNull
    private Long academicId;

    @NotNull
    private String ubication;

    @NotNull
    private Date date;

    @NotNull
    private Time hour;

    @NotNull
    private String temperature;

    @NotNull
    private String smell;

    @NotNull
    private String fur;

    @NotNull
    private String meat;

    @NotNull
    private String eyes;

    @NotNull
    private String texture;

    @NotNull
    private String color;

    @NotNull
    private String gills;

    // Getters and Setters

    public Long getAcademicId() {
        return academicId;
    }

    public void setAcademicId(Long academicId) {
        this.academicId = academicId;
    }

    public String getUbication() {
        return ubication;
    }

    public void setUbication(String ubication) {
        this.ubication = ubication;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Time getHour() {
        return hour;
    }

    public void setHour(Time hour) {
        this.hour = hour;
    }

    public String getTemperature() {
        return temperature;
    }

    public void setTemperature(String temperature) {
        this.temperature = temperature;
    }

    public String getSmell() {
        return smell;
    }

    public void setSmell(String smell) {
        this.smell = smell;
    }

    public String getFur() {
        return fur;
    }

    public void setFur(String fur) {
        this.fur = fur;
    }

    public String getMeat() {
        return meat;
    }

    public void setMeat(String meat) {
        this.meat = meat;
    }

    public String getEyes() {
        return eyes;
    }

    public void setEyes(String eyes) {
        this.eyes = eyes;
    }

    public String getTexture() {
        return texture;
    }

    public void setTexture(String texture) {
        this.texture = texture;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getGills() {
        return gills;
    }

    public void setGills(String gills) {
        this.gills = gills;
    }
}
