package com.Backend.EPI.service;

import com.Backend.EPI.persistence.crud.FishLotRepository;
import com.Backend.EPI.persistence.entity.FishLot;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FishLotService {
    @Autowired
    private FishLotRepository fishLotRepository;

    public FishLot saveForPiscicultor(FishLot fishLot, Long piscicultorId) {
        fishLot.setPiscicultorId(piscicultorId);
        return fishLotRepository.save(fishLot);
    }

    public FishLot saveForComercializador(FishLot fishLot, Long comercializadorId) {
        fishLot.setComercializadorId(comercializadorId);
        return fishLotRepository.save(fishLot);
    }

    public FishLot saveForEvaluador(FishLot fishLot, Long evaluadorId) {
        fishLot.setEvaluadorId(evaluadorId);
        return fishLotRepository.save(fishLot);
    }

    public FishLot saveForAcademico(FishLot fishLot, Long academicoId) {
        fishLot.setAcademicoId(academicoId);
        return fishLotRepository.save(fishLot);
    }

    public List<FishLot> getFishLotsByPiscicultorId(Long piscicultorId) {
        return fishLotRepository.findByPiscicultorId(piscicultorId);
    }

    public List<FishLot> getFishLotsByComercializadorId(Long comercializadorId) {
        return fishLotRepository.findByComercializadorId(comercializadorId);
    }

    public List<FishLot> getFishLotsByEvaluadorId(Long evaluadorId) {
        return fishLotRepository.findByEvaluadorId(evaluadorId);
    }

    public List<FishLot> getFishLotsByAcademicoId(Long academicoId) {
        return fishLotRepository.findByAcademicoId(academicoId);
    }

    public Optional<FishLot> getFishLot(Long id) {
        return fishLotRepository.findById(id);
    }

    public List<FishLot> getAllFishLots() {
        return (List<FishLot>) fishLotRepository.findAll();
    }

    public void deleteFishLot(Long id) {
        fishLotRepository.deleteById(id);
    }

    public FishLot updateFishLot(Long id, com.Backend.EPI.domain.dto.FishLotDTO dto) {
        Optional<FishLot> opt = fishLotRepository.findById(id);
        if (opt.isEmpty()) {
            throw new RuntimeException("FishLot not found with id: " + id);
        }
        FishLot fishLot = opt.get();

        if (dto.getLotName() != null) fishLot.setLotName(dto.getLotName());
        if (dto.getCoordinates() != null) fishLot.setCoordinates(dto.getCoordinates());
        if (dto.getDepartment() != null) fishLot.setDepartment(dto.getDepartment());
        if (dto.getMunicipality() != null) fishLot.setMunicipality(dto.getMunicipality());
        if (dto.getNeighborhood() != null) fishLot.setNeighborhood(dto.getNeighborhood());
        if (dto.getVereda() != null) fishLot.setVereda(dto.getVereda());

        // Opcional: permitir reasignar relaciones
        if (dto.getPiscicultorId() != null) fishLot.setPiscicultorId(dto.getPiscicultorId());
        if (dto.getComercializadorId() != null) fishLot.setComercializadorId(dto.getComercializadorId());
        if (dto.getEvaluadorId() != null) fishLot.setEvaluadorId(dto.getEvaluadorId());
        if (dto.getAcademicoId() != null) fishLot.setAcademicoId(dto.getAcademicoId());

        return fishLotRepository.save(fishLot);
    }
}
