package com.Backend.EPI.persistence.crud;

import com.Backend.EPI.persistence.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    // Aquí puedes agregar consultas personalizadas si es necesario
}