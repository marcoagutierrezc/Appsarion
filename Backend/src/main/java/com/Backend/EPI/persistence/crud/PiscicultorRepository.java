package com.Backend.EPI.persistence.crud;

import com.Backend.EPI.persistence.entity.Piscicultor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface PiscicultorRepository extends JpaRepository<Piscicultor, Long> {
    Optional<Piscicultor> findByUserId(Long userId);
}
