package com.Backend.EPI.web.controller;

import com.Backend.EPI.persistence.entity.Piscicultor;
import com.Backend.EPI.service.PiscicultorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/piscicultores")
public class PiscicultorController {
    @Autowired
    private PiscicultorService piscicultorService;

    @PostMapping
    public ResponseEntity<Piscicultor> save(@RequestBody Piscicultor piscicultor) {
        return new ResponseEntity<>(piscicultorService.save(piscicultor), HttpStatus.CREATED);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Piscicultor> getByUserId(@PathVariable Long userId) {
        return piscicultorService.findByUserId(userId)
                .map(piscicultor -> new ResponseEntity<>(piscicultor, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping
    //@PreAuthorize("hasRole('Admin') or hasRole('Evaluador')")
    public ResponseEntity<List<Piscicultor>> getAllPiscicultores() {
        return new ResponseEntity<>(piscicultorService.getAllPiscicultores(), HttpStatus.OK);
    }
}

