package com.Backend.EPI.persistence.crud;

import com.Backend.EPI.persistence.entity.Academico;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface AcademicoRepository extends CrudRepository<Academico, Long> {
    Optional<Academico> findByUserId(Long userId);
}
