package com.Backend.EPI.persistence.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "real_data")
public class RealData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "fish_lot_id", referencedColumnName = "id")
    private FishLot fishLot;

    @ManyToOne
    @JoinColumn(name = "piscicultor_id", referencedColumnName = "id")
    private Piscicultor piscicultor;

    @ManyToOne
    @JoinColumn(name = "evaluador_id", referencedColumnName = "id")
    private Evaluador evaluador;

    @ManyToOne
    @JoinColumn(name = "comercializador_id", referencedColumnName = "id")
    private Comercializador comercializador;

    @Column(name = "ubication")
    private String ubication;

    @Column(name = "date")
    private Date date;

    @Column(name = "hour")
    private Date hour;

    @Column(name = "temperature")
    private String temperature;

    @Column(name = "smell")
    private int smell;

    @Column(name = "fur")
    private int fur;

    @Column(name = "meat")
    private int meat;

    @Column(name = "eyes")
    private int eyes;

    @Column(name = "texture")
    private int texture;

    @Column(name = "color")
    private int color;

    @Column(name = "gills")
    private int gills;

    @Column(name = "species")
    private String species;

    @Column(name = "average_weight")
    private BigDecimal averageWeight;

    @Column(name = "quantity")
    private Integer quantity;

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public FishLot getFishLot() {
        return fishLot;
    }

    public void setFishLot(FishLot fishLot) {
        this.fishLot = fishLot;
    }

    public Piscicultor getPiscicultor() {
        return piscicultor;
    }

    public void setPiscicultor(Piscicultor piscicultor) {
        this.piscicultor = piscicultor;
    }

    public Evaluador getEvaluador() {
        return evaluador;
    }

    public void setEvaluador(Evaluador evaluador) {
        this.evaluador = evaluador;
    }

    public Comercializador getComercializador() {
        return comercializador;
    }

    public void setComercializador(Comercializador comercializador) {
        this.comercializador = comercializador;
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

    public Date getHour() {
        return hour;
    }

    public void setHour(Date hour) {
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
}
