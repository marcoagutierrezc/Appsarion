package com.Backend.EPI.web.controller;

import com.Backend.EPI.domain.dto.UserToVerifyDTO;
import com.Backend.EPI.persistence.entity.UserToVerify;
import com.Backend.EPI.service.UserToVerifyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/users-to-verify")
public class UserToVerifyController {

    @Autowired
    private UserToVerifyService userToVerifyService;

    @PostMapping
    public ResponseEntity<?> saveUserToVerify(
            @RequestParam("name") String name,
            @RequestParam("documentType") String documentType,
            @RequestParam("documentNumber") Long documentNumber,
            @RequestParam("phoneNumber") Long phoneNumber,
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            @RequestParam("justification") String justification,
            @RequestParam("role") String role,
            @RequestParam(value = "estado", required = false) String estado,
            @RequestParam("supportingDocument") MultipartFile supportingDocument) {
        try {
            // Llama al servicio para guardar el usuario
            return new ResponseEntity<>(userToVerifyService.save(name, documentType, documentNumber, phoneNumber, email, password, justification, role, supportingDocument, estado), HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Endpoint para obtener todos los usuarios pendientes de verificación
    @GetMapping("/pending")
    public ResponseEntity<List<UserToVerify>> getAllPendingUsers() {
        List<UserToVerify> pendingUsers = userToVerifyService.getAllPendingUsers();
        return new ResponseEntity<>(pendingUsers, HttpStatus.OK);
    }

}
