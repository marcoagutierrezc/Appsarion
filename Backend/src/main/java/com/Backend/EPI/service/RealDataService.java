package com.Backend.EPI.service;

import com.Backend.EPI.persistence.crud.RealDataRepository;
import com.Backend.EPI.persistence.entity.RealData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RealDataService {
    @Autowired
    private RealDataRepository realDataRepository;

    public RealData save(RealData realData) {
        return realDataRepository.save(realData);
    }

    public Optional<RealData> getRealData(Long id) {
        return realDataRepository.findById(id);
    }

    public List<RealData> getByPiscicultorId(Long piscicultorId) {
        return realDataRepository.findByPiscicultorId(piscicultorId);
    }

    public List<RealData> getByEvaluadorId(Long evaluadorId) {
        return realDataRepository.findByEvaluadorId(evaluadorId);
    }

    public List<RealData> getByComercializadorId(Long comercializadorId) {
        return realDataRepository.findByComercializadorId(comercializadorId);
    }

    public List<RealData> getByFishLotId(Long fishLotId) {
        return realDataRepository.findByFishLotId(fishLotId);
    }
}

