package com.Backend.EPI.persistence.entity;

import jakarta.persistence.*;

import java.sql.Date;
import java.sql.Time;

@Entity
@Table(name = "academic_data")
public class AcademicData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "academic_id")
    private Long academicId;

    @Column(name = "ubication")
    private String ubication;

    @Column(name = "date")
    private Date date;

    @Column(name = "hour")
    private Time hour;

    @Column(name = "temperature")
    private String temperature;

    @Column(name = "smell")
    private String smell;

    @Column(name = "fur")
    private String fur;

    @Column(name = "meat")
    private String meat;

    @Column(name = "eyes")
    private String eyes;

    @Column(name = "texture")
    private String texture;

    @Column(name = "color")
    private String color;

    @Column(name = "gills")
    private String gills;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

