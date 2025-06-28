package com.Backend.EPI.web.controller;

import com.Backend.EPI.persistence.entity.Academico;
import com.Backend.EPI.service.AcademicoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/academicos")
public class AcademicoController {
    @Autowired
    private AcademicoService academicoService;

    @PostMapping
    public ResponseEntity<Academico> save(@RequestBody Academico academico) {
        return new ResponseEntity<>(academicoService.save(academico), HttpStatus.CREATED);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Academico> getByUserId(@PathVariable Long userId) {
        return academicoService.findByUserId(userId)
                .map(academico -> new ResponseEntity<>(academico, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }



    @GetMapping
    public ResponseEntity<List<Academico>> getAllAcademico() {
        return new ResponseEntity<>(academicoService.getAllAcademicos(), HttpStatus.OK);
    }
}


