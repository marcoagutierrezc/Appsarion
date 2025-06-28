package com.Backend.EPI.persistence.crud;

import com.Backend.EPI.persistence.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AdminRepository extends JpaRepository<Admin, Long> {

    // Método para obtener todos los IDs de usuarios que son administradores
    List<Admin> findAll();

    // Método para verificar si un usuario con ID específico existe en la tabla Admin
    boolean existsByUserId(Long userId);

    // Método para encontrar un Admin por userId
    Optional<Admin> findByUserId(Long userId);
}
