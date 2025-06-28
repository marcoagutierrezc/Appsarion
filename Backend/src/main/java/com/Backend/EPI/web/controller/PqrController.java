package com.Backend.EPI.web.controller;

import com.Backend.EPI.persistence.entity.FormData;
import com.Backend.EPI.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/pqr")
public class PqrController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/enviar")
    public ResponseEntity<String> enviarPqr(@RequestBody FormData formData) {
        emailService.sendPqrEmail(formData);
        return new ResponseEntity<>("Solicitud de PQR enviada exitosamente", HttpStatus.OK);
    }
}