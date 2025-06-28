package com.Backend.EPI.persistence.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "reports")
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "real_data_id", referencedColumnName = "id")
    private RealData realData;

    @Column(name = "finalGrade")
    private float finalGrade;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public RealData getRealData() {
        return realData;
    }

    public void setRealData(RealData realData) {
        this.realData = realData;
    }

    public float getFinalGrade() {
        return finalGrade;
    }

    public void setFinalGrade(float finalGrade) {
        this.finalGrade = finalGrade;
    }
}
