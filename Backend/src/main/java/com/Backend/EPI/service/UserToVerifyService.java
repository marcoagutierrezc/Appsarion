package com.Backend.EPI.service;

import com.Backend.EPI.domain.dto.*;
import com.Backend.EPI.persistence.crud.UserToVerifyCrudRepository;
import com.Backend.EPI.persistence.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;

@Service
public class UserToVerifyService {

    private static final Logger logger = LoggerFactory.getLogger(UserToVerifyService.class);

    @Autowired
    private UserToVerifyCrudRepository userToVerifyCrudRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private PiscicultorService piscicultorService;

    @Autowired
    private EvaluadorService evaluadorService;

    @Autowired
    private ComercializadorService comercializadorService;

    @Autowired
    private AcademicoService academicoService;

    @Autowired
    private BackblazeService backblazeService;

    @Autowired
    private GoogleEmailService emailService;

    @Transactional
    public User validateAndSaveUser(Long userToVerifyId, RoleDataDTO roleDataDTO) {
        Optional<UserToVerify> userToVerifyOptional = userToVerifyCrudRepository.findById(userToVerifyId);

        if (!userToVerifyOptional.isPresent()) {
            throw new IllegalArgumentException("User to verify not found");
        }

        UserToVerify userToVerify = userToVerifyOptional.get();

        // Convertimos UserToVerify a UserDTO
        UserDTO userDTO = convertToUserDTO(userToVerify, roleDataDTO);
        User savedUser = userService.save(userDTO);

        // Crear registros en las tablas relacionadas con valores nulos según el rol
        switch (userToVerify.getRole()) {
            case "Piscicultor":
                Piscicultor piscicultor = new Piscicultor();
                piscicultor.setUser(savedUser);
                piscicultor.setNameProperty(null);
                piscicultor.setDepartment(null);
                piscicultor.setMunicipality(null);
                piscicultor.setNeighborhood(null);
                piscicultorService.save(piscicultor);
                break;

            case "Evaluador":
                Evaluador evaluador = new Evaluador();
                evaluador.setUser(savedUser);
                evaluador.setCompany(null);
                evaluador.setEmployment(null);
                evaluadorService.save(evaluador);
                break;

            case "Comercializador":
                Comercializador comercializador = new Comercializador();
                comercializador.setUser(savedUser);
                comercializador.setNameProperty(null);
                comercializador.setDepartment(null);
                comercializador.setMunicipality(null);
                comercializador.setNeighborhood(null);
                comercializadorService.save(comercializador);
                break;

            case "Academico":
                Academico academico = new Academico();
                academico.setUser(savedUser);
                academico.setInstitution(null);
                academico.setCareer(null);
                academico.setCourse(null);
                academicoService.save(academico);
                break;

            default:
                throw new IllegalArgumentException("Invalid role: " + userToVerify.getRole());
        }

        // Eliminar el usuario de la tabla de usuarios por verificar
        userToVerifyCrudRepository.delete(userToVerify);

        return savedUser;
    }


    private UserDTO convertToUserDTO(UserToVerify userToVerify, RoleDataDTO roleDataDTO) {
        UserDTO userDTO = new UserDTO();
        userDTO.setName(userToVerify.getName());
        userDTO.setDocumentType(userToVerify.getDocumentType());
        userDTO.setDocumentNumber(userToVerify.getDocumentNumber());
        userDTO.setPhoneNumber(userToVerify.getPhoneNumber());
        userDTO.setEmail(userToVerify.getEmail());
        userDTO.setPassword(userToVerify.getPassword());
        userDTO.setJustification(userToVerify.getJustification());
        userDTO.setSupportingDocument(userToVerify.getSupportingDocument());
        userDTO.setRole(userToVerify.getRole());
        userDTO.setRoleData(roleDataDTO);

        return userDTO;
    }

    @Transactional
    public UserToVerify save(String name, String documentType, Long documentNumber, Long phoneNumber, String email, String password, String justification, String role, MultipartFile supportingDocument, String estado) {
        if (userToVerifyCrudRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already exists");
        }

        UserToVerify userToVerify = new UserToVerify();
        userToVerify.setName(name);
        userToVerify.setDocumentType(documentType);
        userToVerify.setDocumentNumber(documentNumber);
        userToVerify.setPhoneNumber(phoneNumber);
        userToVerify.setEmail(email);
        userToVerify.setPassword(passwordEncoder.encode(password));
        userToVerify.setJustification(justification);
        userToVerify.setRole(role.trim());
        userToVerify.setEstado(estado != null ? estado : "activo");

        // Primero guardamos el usuario para obtener su ID
        UserToVerify savedUserToVerify = userToVerifyCrudRepository.save(userToVerify);

        // Subir el archivo a Backblaze si se proporciona
        try {
            if (supportingDocument != null && !supportingDocument.isEmpty()) {
                // Subir a Backblaze y obtener la URL
                String backblazeUrl = backblazeService.uploadSupportDocument(savedUserToVerify.getId(), supportingDocument);
                savedUserToVerify.setSupportingDocument(backblazeUrl);

                // Actualizar el registro con la URL de Backblaze
                return userToVerifyCrudRepository.save(savedUserToVerify);
            } else {
                savedUserToVerify.setSupportingDocument(null); // No hay documento por ahora
            }
        } catch (Exception e) {
            // Si falla la subida a Backblaze, eliminar el usuario creado
            userToVerifyCrudRepository.delete(savedUserToVerify);
            throw new RuntimeException("Error al subir el documento a Backblaze: " + e.getMessage(), e);
        }

        return savedUserToVerify;
    }


    // Método para obtener todos los usuarios pendientes de verificación
    public List<UserToVerify> getAllPendingUsers() {
        return (List<UserToVerify>) userToVerifyCrudRepository.findAll();
    }

    /**
     * Aprueba un usuario pendiente de verificación
     * Mueve el usuario a la tabla de usuarios y envía correo de aprobación
     */
    @Transactional
    public void approveUser(Long userToVerifyId, RoleDataDTO roleDataDTO) {
        Optional<UserToVerify> userToVerifyOptional = userToVerifyCrudRepository.findById(userToVerifyId);

        if (!userToVerifyOptional.isPresent()) {
            throw new IllegalArgumentException("Usuario pendiente de verificación no encontrado");
        }

        UserToVerify userToVerify = userToVerifyOptional.get();

        try {
            // Crear el usuario en la tabla usuarios
            User savedUser = validateAndSaveUser(userToVerifyId, roleDataDTO);

            // Enviar email de aprobación
            emailService.sendApprovalEmail(userToVerify.getEmail(), userToVerify.getName());

            logger.info("Usuario aprobado exitosamente: {}", userToVerify.getEmail());
        } catch (Exception e) {
            logger.error("Error al aprobar usuario: {}", e.getMessage(), e);
            throw new RuntimeException("Error al aprobar usuario: " + e.getMessage(), e);
        }
    }

    /**
     * Rechaza un usuario pendiente de verificación
     * Elimina el usuario de la tabla pendientes y envía correo de rechazo
     */
    @Transactional
    public void rejectUser(Long userToVerifyId, String rejectionReason) {
        Optional<UserToVerify> userToVerifyOptional = userToVerifyCrudRepository.findById(userToVerifyId);

        if (!userToVerifyOptional.isPresent()) {
            throw new IllegalArgumentException("Usuario pendiente de verificación no encontrado");
        }

        UserToVerify userToVerify = userToVerifyOptional.get();
        String email = userToVerify.getEmail();
        String name = userToVerify.getName();

        try {
            // Eliminar el usuario de la tabla de pendientes
            userToVerifyCrudRepository.delete(userToVerify);

            // Enviar email de rechazo
            emailService.sendRejectionEmail(email, name, rejectionReason);

            logger.info("Usuario rechazado exitosamente: {}", email);
        } catch (Exception e) {
            logger.error("Error al rechazar usuario: {}", e.getMessage(), e);
            throw new RuntimeException("Error al rechazar usuario: " + e.getMessage(), e);
        }
    }
}
