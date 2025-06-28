package com.Backend.EPI.persistence.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.sql.Timestamp; // Asegúrate de usar el paquete correcto.

@Entity
@Table(name = "certificates")
public class Certificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evaluation_id", nullable = false)
    @JsonIgnore
    private Evaluation evaluation;

    @Column(name = "certificate_code", nullable = false, unique = true)
    private String certificateCode;

    @Column(name = "issued_at", nullable = false)
    private Timestamp issuedAt; // Correcto: java.sql.Timestamp

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Evaluation getEvaluation() {
        return evaluation;
    }

    public void setEvaluation(Evaluation evaluation) {
        this.evaluation = evaluation;
    }

    public String getCertificateCode() {
        return certificateCode;
    }

    public void setCertificateCode(String certificateCode) {
        this.certificateCode = certificateCode;
    }

    public Timestamp getIssuedAt() { // Correcto: java.sql.Timestamp
        return issuedAt;
    }

    public void setIssuedAt(Timestamp issuedAt) { // Correcto: java.sql.Timestamp
        this.issuedAt = issuedAt;
    }
}
