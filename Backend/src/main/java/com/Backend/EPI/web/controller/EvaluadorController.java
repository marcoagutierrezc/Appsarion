package com.Backend.EPI.web.controller;

import com.Backend.EPI.persistence.entity.Evaluador;
import com.Backend.EPI.service.EvaluadorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/evaluadores")
public class EvaluadorController {
    @Autowired
    private EvaluadorService evaluadorService;

    @PostMapping
    public ResponseEntity<Evaluador> save(@RequestBody Evaluador evaluador) {
        return new ResponseEntity<>(evaluadorService.save(evaluador), HttpStatus.CREATED);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Evaluador> getByUserId(@PathVariable Long userId) {
        return evaluadorService.findByUserId(userId)
                .map(evaluador -> new ResponseEntity<>(evaluador, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping
    public ResponseEntity<List<Evaluador>> getAllEvaluadores(){
        return new ResponseEntity<>(evaluadorService.getAllEvaluadores(), HttpStatus.OK);
    }


}

