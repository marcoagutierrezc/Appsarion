package com.Backend.EPI.web.controller;

import com.Backend.EPI.persistence.entity.UserToVerify;
import com.Backend.EPI.service.UserToVerifyService;
import com.Backend.EPI.service.BackblazeService;
import com.Backend.EPI.domain.dto.RoleDataDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/users-to-verify")
public class UserToVerifyController {

    private static final Logger logger = LoggerFactory.getLogger(UserToVerifyController.class);

    @Autowired
    private UserToVerifyService userToVerifyService;

    @Autowired
    private BackblazeService backblazeService;

    @PostMapping(consumes = {"multipart/form-data"})
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
            @RequestParam(value = "supportingDocument", required = false) MultipartFile supportingDocument) {
        try {
            UserToVerify savedUser = userToVerifyService.save(
                name, documentType, documentNumber, phoneNumber,
                email, password, justification, role,
                supportingDocument, estado
            );

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Usuario registrado exitosamente. Pendiente de validación.");
            response.put("user", savedUser);
            response.put("hasDocument", savedUser.getSupportingDocument() != null);

            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error al procesar el registro: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Obtiene todos los usuarios pendientes de verificación con información detallada
     */
    @GetMapping("/pending")
    public ResponseEntity<?> getAllPendingUsers() {
        try {
            List<UserToVerify> pendingUsers = userToVerifyService.getAllPendingUsers();

            // Transformar a un formato más amigable con información del documento
            List<Map<String, Object>> usersWithDocInfo = pendingUsers.stream()
                .map(user -> {
                    Map<String, Object> userInfo = new HashMap<>();
                    userInfo.put("id", user.getId());
                    userInfo.put("name", user.getName());
                    userInfo.put("documentType", user.getDocumentType());
                    userInfo.put("documentNumber", user.getDocumentNumber());
                    userInfo.put("phoneNumber", user.getPhoneNumber());
                    userInfo.put("email", user.getEmail());
                    userInfo.put("justification", user.getJustification());
                    userInfo.put("role", user.getRole());
                    userInfo.put("estado", user.getEstado());
                    userInfo.put("supportingDocument", user.getSupportingDocument());
                    userInfo.put("hasDocument", user.getSupportingDocument() != null && !user.getSupportingDocument().isEmpty());
                    userInfo.put("documentLocation", user.getSupportingDocument() != null && user.getSupportingDocument().startsWith("http") ? "Backblaze" : "Local");

                    return userInfo;
                })
                .collect(Collectors.toList());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("total", usersWithDocInfo.size());
            response.put("users", usersWithDocInfo);

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error al obtener usuarios pendientes: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Obtiene un usuario pendiente específico con toda su información
     */
    @GetMapping("/pending/{id}")
    public ResponseEntity<?> getPendingUserById(@PathVariable Long id) {
        try {
            UserToVerify user = userToVerifyService.getAllPendingUsers().stream()
                .filter(u -> u.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("id", user.getId());
            userInfo.put("name", user.getName());
            userInfo.put("documentType", user.getDocumentType());
            userInfo.put("documentNumber", user.getDocumentNumber());
            userInfo.put("phoneNumber", user.getPhoneNumber());
            userInfo.put("email", user.getEmail());
            userInfo.put("justification", user.getJustification());
            userInfo.put("role", user.getRole());
            userInfo.put("estado", user.getEstado());
            userInfo.put("supportingDocument", user.getSupportingDocument());
            userInfo.put("hasDocument", user.getSupportingDocument() != null && !user.getSupportingDocument().isEmpty());
            userInfo.put("documentLocation", user.getSupportingDocument() != null && user.getSupportingDocument().startsWith("http") ? "Backblaze" : "Local");

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("user", userInfo);

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error al obtener usuario: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Aprueba un usuario pendiente de verificación
     * POST /users-to-verify/{id}/approve
     */
    @PostMapping("/{id}/approve")
    public ResponseEntity<?> approveUser(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, Object> roleData) {
        try {
            RoleDataDTO roleDataDTO = new RoleDataDTO();

            // Procesar el DTO de datos de rol si es proporcionado
            if (roleData != null) {
                roleDataDTO = parseRoleData(roleData);
            }

            userToVerifyService.approveUser(id, roleDataDTO);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Usuario aprobado exitosamente. Correo de confirmación enviado.");

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error al aprobar usuario: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Rechaza un usuario pendiente de verificación
     * POST /users-to-verify/{id}/reject
     */
    @PostMapping("/{id}/reject")
    public ResponseEntity<?> rejectUser(
            @PathVariable Long id,
            @RequestBody Map<String, String> requestBody) {
        try {
            String rejectionReason = requestBody.getOrDefault("rejectionReason", "Documentación incompleta o no válida.");

            userToVerifyService.rejectUser(id, rejectionReason);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Usuario rechazado exitosamente. Correo de notificación enviado.");

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error al rechazar usuario: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Método auxiliar para parsear datos de rol desde un Map
     * Por ahora retorna un RoleDataDTO vacío, ya que los datos específicos
     * se completan en el servicio según el rol del usuario
     */
    private RoleDataDTO parseRoleData(Map<String, Object> roleData) {
        // Retornar DTO vacío - el servicio manejará los datos específicos del rol
        return new RoleDataDTO();
    }

}
