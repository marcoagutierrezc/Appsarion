package com.Backend.EPI.service;

import com.Backend.EPI.persistence.crud.AcademicoRepository;
import com.Backend.EPI.persistence.entity.Academico;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AcademicoService {
    @Autowired
    private AcademicoRepository academicoRepository;

    public Academico save(Academico academico) {
        return academicoRepository.save(academico);
    }

    public Optional<Academico> findByUserId(Long userId) {
        return academicoRepository.findByUserId(userId);
    }

    public List<Academico> getAllAcademicos(){
        return (List<Academico>) academicoRepository.findAll();
    }

    public void delete(Long id) {
        academicoRepository.deleteById(id);
    }
}
