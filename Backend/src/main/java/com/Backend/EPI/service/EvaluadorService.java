package com.Backend.EPI.service;

import com.Backend.EPI.persistence.crud.EvaluadorRepository;
import com.Backend.EPI.persistence.entity.Evaluador;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EvaluadorService {
    @Autowired
    private EvaluadorRepository evaluadorRepository;

    public Evaluador save(Evaluador evaluador) {
        return evaluadorRepository.save(evaluador);
    }

    public Optional<Evaluador> findByUserId(Long userId) {
        return evaluadorRepository.findByUserId(userId);
    }

    public List<Evaluador> getAllEvaluadores() {
        return (List<Evaluador>) evaluadorRepository.findAll();
    }

    public void delete(Long id) {
        evaluadorRepository.deleteById(id);
    }
}
