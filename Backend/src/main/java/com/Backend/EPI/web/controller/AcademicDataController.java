package com.Backend.EPI.web.controller;

import com.Backend.EPI.domain.dto.AcademicDataDTO;
import com.Backend.EPI.persistence.entity.AcademicData;
import com.Backend.EPI.service.AcademicDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/academic_data")
public class AcademicDataController {

    @Autowired
    private AcademicDataService academicDataService;

    @PostMapping
    public ResponseEntity<AcademicData> save(@Validated @RequestBody AcademicDataDTO academicDataDTO) {
        AcademicData academicData = new AcademicData();
        academicData.setAcademicId(academicDataDTO.getAcademicId());
        academicData.setUbication(academicDataDTO.getUbication());
        academicData.setDate(academicDataDTO.getDate());
        academicData.setHour(academicDataDTO.getHour());
        academicData.setTemperature(academicDataDTO.getTemperature());
        academicData.setSmell(academicDataDTO.getSmell());
        academicData.setFur(academicDataDTO.getFur());
        academicData.setMeat(academicDataDTO.getMeat());
        academicData.setEyes(academicDataDTO.getEyes());
        academicData.setTexture(academicDataDTO.getTexture());
        academicData.setColor(academicDataDTO.getColor());
        academicData.setGills(academicDataDTO.getGills());

        return new ResponseEntity<>(academicDataService.save(academicData), HttpStatus.CREATED);
    }
}
