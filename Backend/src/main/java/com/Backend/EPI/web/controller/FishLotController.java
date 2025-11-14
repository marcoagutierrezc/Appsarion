package com.Backend.EPI.web.controller;

import com.Backend.EPI.domain.dto.FishLotDTO;
import com.Backend.EPI.persistence.entity.FishLot;
import com.Backend.EPI.service.FishLotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/fish_lot")
public class FishLotController {

    @Autowired
    private FishLotService fishLotService;

    // Endpoint para crear lote de pescado para Piscicultor
    @PostMapping("/piscicultor/{piscicultorId}")
    public ResponseEntity<FishLot> saveForPiscicultor(@Validated @RequestBody FishLotDTO fishLotDTO, @PathVariable Long piscicultorId) {
        FishLot fishLot = new FishLot();
        fishLot.setLotName(fishLotDTO.getLotName());
        fishLot.setCoordinates(fishLotDTO.getCoordinates());
        fishLot.setDepartment(fishLotDTO.getDepartment());
        fishLot.setMunicipality(fishLotDTO.getMunicipality());
        fishLot.setNeighborhood(fishLotDTO.getNeighborhood());
        fishLot.setVereda(fishLotDTO.getVereda());

        return new ResponseEntity<>(fishLotService.saveForPiscicultor(fishLot, piscicultorId), HttpStatus.CREATED);
    }

    // Endpoint para crear lote de pescado para Comercializador
    @PostMapping("/comercializador/{comercializadorId}")
    public ResponseEntity<FishLot> saveForComercializador(@Validated @RequestBody FishLotDTO fishLotDTO, @PathVariable Long comercializadorId) {
        FishLot fishLot = new FishLot();
        fishLot.setLotName(fishLotDTO.getLotName());
        fishLot.setCoordinates(fishLotDTO.getCoordinates());
        fishLot.setDepartment(fishLotDTO.getDepartment());
        fishLot.setMunicipality(fishLotDTO.getMunicipality());
        fishLot.setNeighborhood(fishLotDTO.getNeighborhood());
        fishLot.setVereda(fishLotDTO.getVereda());

        return new ResponseEntity<>(fishLotService.saveForComercializador(fishLot, comercializadorId), HttpStatus.CREATED);
    }

    @PostMapping("/evaluador/{evaluadorId}")
    public ResponseEntity<FishLot> saveForEvaluador(@Validated @RequestBody FishLotDTO fishLotDTO, @PathVariable Long evaluadorId) {
        FishLot fishLot = new FishLot();
        fishLot.setLotName(fishLotDTO.getLotName());
        fishLot.setCoordinates(fishLotDTO.getCoordinates());
        fishLot.setDepartment(fishLotDTO.getDepartment());
        fishLot.setMunicipality(fishLotDTO.getMunicipality());
        fishLot.setNeighborhood(fishLotDTO.getNeighborhood());
        fishLot.setVereda(fishLotDTO.getVereda());

        return new ResponseEntity<>(fishLotService.saveForEvaluador(fishLot, evaluadorId), HttpStatus.CREATED);
    }

    @PostMapping("/academico/{academicoId}")
    public ResponseEntity<FishLot> saveForAcademico(@Validated @RequestBody FishLotDTO fishLotDTO, @PathVariable Long academicoId) {
        FishLot fishLot = new FishLot();
        fishLot.setLotName(fishLotDTO.getLotName());
        fishLot.setCoordinates(fishLotDTO.getCoordinates());
        fishLot.setDepartment(fishLotDTO.getDepartment());
        fishLot.setMunicipality(fishLotDTO.getMunicipality());
        fishLot.setNeighborhood(fishLotDTO.getNeighborhood());
        fishLot.setVereda(fishLotDTO.getVereda());

        return new ResponseEntity<>(fishLotService.saveForEvaluador(fishLot, academicoId), HttpStatus.CREATED);
    }

    // Endpoint para obtener lotes por piscicultorId
    @GetMapping("/piscicultor/{piscicultorId}")
    public ResponseEntity<List<FishLot>> getFishLotsByPiscicultorId(@PathVariable Long piscicultorId) {
        List<FishLot> fishLots = fishLotService.getFishLotsByPiscicultorId(piscicultorId);
        return new ResponseEntity<>(fishLots, HttpStatus.OK);
    }

    // Endpoint para obtener lotes por comercializadorId
    @GetMapping("/comercializador/{comercializadorId}")
    public ResponseEntity<List<FishLot>> getFishLotsByComercializadorId(@PathVariable Long comercializadorId) {
        List<FishLot> fishLots = fishLotService.getFishLotsByComercializadorId(comercializadorId);
        return new ResponseEntity<>(fishLots, HttpStatus.OK);
    }

    // Endpoint para obtener lotes por evaluadorId
    @GetMapping("/evaluador/{evaluadorId}")
    public ResponseEntity<List<FishLot>> getFishLotsByEvaluadorId(@PathVariable Long evaluadorId) {
        List<FishLot> fishLots = fishLotService.getFishLotsByEvaluadorId(evaluadorId);
        return new ResponseEntity<>(fishLots, HttpStatus.OK);
    }

    // Endpoint para obtener lotes por academicoId
    @GetMapping("/academico/{academicoId}")
    public ResponseEntity<List<FishLot>> getFishLotsByAcademicoId(@PathVariable Long academicoId) {
        List<FishLot> fishLots = fishLotService.getFishLotsByAcademicoId(academicoId);
        return new ResponseEntity<>(fishLots, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FishLot> getFishLot(@PathVariable Long id) {
        return fishLotService.getFishLot(id)
                .map(fishLot -> new ResponseEntity<>(fishLot, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping
    public ResponseEntity<List<FishLot>> getAllFishLots() {
        return new ResponseEntity<>(fishLotService.getAllFishLots(), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFishLot(@PathVariable Long id) {
        fishLotService.deleteFishLot(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FishLot> updateFishLot(@PathVariable Long id, @RequestBody com.Backend.EPI.domain.dto.FishLotDTO fishLotDTO) {
        try {
            FishLot updated = fishLotService.updateFishLot(id, fishLotDTO);
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
