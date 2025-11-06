package com.Backend.EPI.service;

import com.Backend.EPI.persistence.crud.PiscicultorRepository;
import com.Backend.EPI.persistence.entity.Piscicultor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PiscicultorService {
    @Autowired
    private PiscicultorRepository piscicultorRepository;

    public Piscicultor save(Piscicultor piscicultor) {
        return piscicultorRepository.save(piscicultor);
    }

    public Optional<Piscicultor> findByUserId(Long userId) {
        return piscicultorRepository.findByUserId(userId);
    }

    public List<Piscicultor> getAllPiscicultores() {
        return piscicultorRepository.findAll();
    }
    
    public void delete(Long id) {
        piscicultorRepository.deleteById(id);
    }
}
