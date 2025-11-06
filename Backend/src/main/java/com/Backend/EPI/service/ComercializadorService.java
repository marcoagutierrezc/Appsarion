package com.Backend.EPI.service;

import com.Backend.EPI.persistence.crud.ComercializadorRepository;
import com.Backend.EPI.persistence.entity.Comercializador;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ComercializadorService {
    @Autowired
    private ComercializadorRepository comercializadorRepository;

    public Comercializador save(Comercializador comercializador) {
        return comercializadorRepository.save(comercializador);
    }

    public Optional<Comercializador> findByUserId(Long userId) {
        return comercializadorRepository.findByUserId(userId);
    }

    public List<Comercializador> getAllComercializadores() {
        return comercializadorRepository.findAll();
    }

    public void delete(Long id) {
        comercializadorRepository.deleteById(id);
    }
}
