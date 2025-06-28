package com.Backend.EPI.persistence.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "categories")  // Especifica el nombre de la tabla si quieres personalizarlo
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")  // Especifica el nombre de la columna si lo deseas, es opcional si es el mismo nombre
    private Long id;

    @Column(name = "category_name", nullable = false)  // Aquí estamos personalizando el nombre de la columna
    private String categoryName;

    @Column(name = "created_at", updatable = false)  // Especificamos que no se puede actualizar
    @CreationTimestamp  // Autogenerado con la fecha y hora de creación
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp  // Autogenerado con la fecha y hora de la última actualización
    private LocalDateTime updatedAt;

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
