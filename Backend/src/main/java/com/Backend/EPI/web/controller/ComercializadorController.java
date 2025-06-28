package com.Backend.EPI.web.controller;

import com.Backend.EPI.persistence.entity.Comercializador;
import com.Backend.EPI.service.ComercializadorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comercializadores")
public class ComercializadorController {
    @Autowired
    private ComercializadorService comercializadorService;

    @PostMapping
    public ResponseEntity<Comercializador> save(@RequestBody Comercializador comercializador) {
        return new ResponseEntity<>(comercializadorService.save(comercializador), HttpStatus.CREATED);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Comercializador> getByUserId(@PathVariable Long userId) {
        return comercializadorService.findByUserId(userId)
                .map(comercializador -> new ResponseEntity<>(comercializador, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping
    //@PreAuthorize("hasRole('Admin') or hasRole('EVALUADOR')")
    public ResponseEntity<List<Comercializador>> getAllComercializadores() {
        return new ResponseEntity<>(comercializadorService.getAllComercializadores(), HttpStatus.OK);
    }
}

