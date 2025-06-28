package com.Backend.EPI.persistence.crud;

import com.Backend.EPI.persistence.entity.Comercializador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface ComercializadorRepository extends JpaRepository<Comercializador, Long> {
    Optional<Comercializador> findByUserId(Long userId);

}

