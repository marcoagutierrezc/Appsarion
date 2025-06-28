package com.Backend.EPI.persistence.crud;

import com.Backend.EPI.persistence.entity.Evaluador;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface EvaluadorRepository extends CrudRepository<Evaluador, Long> {
    Optional<Evaluador> findByUserId(Long userId);
}

