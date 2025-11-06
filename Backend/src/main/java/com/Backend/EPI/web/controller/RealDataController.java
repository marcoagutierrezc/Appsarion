package com.Backend.EPI.web.controller;

import com.Backend.EPI.domain.dto.RealDataDTO;
import com.Backend.EPI.persistence.entity.*;
import com.Backend.EPI.service.RealDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.sql.Time;
import java.util.List;

@RestController
@RequestMapping("/real_data")
public class RealDataController {

    @Autowired
    private RealDataService realDataService;

    @PostMapping
    public ResponseEntity<RealData> save(@Validated @RequestBody RealDataDTO realDataDTO) {
        RealData realData = new RealData();
        FishLot fishLot = new FishLot();
        fishLot.setId(realDataDTO.getFishLotId());
        realData.setFishLot(fishLot);

        Piscicultor piscicultor = new Piscicultor();
        piscicultor.setId(realDataDTO.getPiscicultorId());
        realData.setPiscicultor(piscicultor);

        if (realDataDTO.getEvaluadorId() != null) {
            Evaluador evaluador = new Evaluador();
            evaluador.setId(realDataDTO.getEvaluadorId());
            realData.setEvaluador(evaluador);
        }

        if (realDataDTO.getComercializadorId() != null) {
            Comercializador comercializador = new Comercializador();
            comercializador.setId(realDataDTO.getComercializadorId());
            realData.setComercializador(comercializador);
        }

        realData.setUbication(realDataDTO.getUbication());
        realData.setDate(Date.valueOf(realDataDTO.getDate()));
        realData.setHour(Time.valueOf(realDataDTO.getHour()));
        realData.setTemperature(realDataDTO.getTemperature());
        realData.setSmell(realDataDTO.getSmell());
        realData.setFur(realDataDTO.getFur());
        realData.setMeat(realDataDTO.getMeat());
        realData.setEyes(realDataDTO.getEyes());
        realData.setTexture(realDataDTO.getTexture());
        realData.setColor(realDataDTO.getColor());
        realData.setGills(realDataDTO.getGills());
        realData.setSpecies(realDataDTO.getSpecies());
        realData.setAverageWeight(realDataDTO.getAverageWeight());
        realData.setQuantity(realDataDTO.getQuantity());
        realData.setObservations(realDataDTO.getObservations());

        return new ResponseEntity<>(realDataService.save(realData), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RealData> getRealData(@PathVariable Long id) {
        return realDataService.getRealData(id)
                .map(realData -> new ResponseEntity<>(realData, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/piscicultor/{piscicultorId}")
    public ResponseEntity<List<RealData>> getByPiscicultorId(@PathVariable Long piscicultorId) {
        return new ResponseEntity<>(realDataService.getByPiscicultorId(piscicultorId), HttpStatus.OK);
    }

    @GetMapping("/evaluador/{evaluadorId}")
    public ResponseEntity<List<RealData>> getByEvaluadorId(@PathVariable Long evaluadorId) {
        return new ResponseEntity<>(realDataService.getByEvaluadorId(evaluadorId), HttpStatus.OK);
    }

    @GetMapping("/comercializador/{comercializadorId}")
    public ResponseEntity<List<RealData>> getByComercializadorId(@PathVariable Long comercializadorId) {
        return new ResponseEntity<>(realDataService.getByComercializadorId(comercializadorId), HttpStatus.OK);
    }

    @GetMapping("/fish_lot/{fishLotId}")
    public ResponseEntity<List<RealData>> getByFishLotId(@PathVariable Long fishLotId) {
        return new ResponseEntity<>(realDataService.getByFishLotId(fishLotId), HttpStatus.OK);
    }
}
