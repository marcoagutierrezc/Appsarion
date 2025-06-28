package com.Backend.EPI.service;

import com.Backend.EPI.domain.dto.*;
import com.Backend.EPI.persistence.crud.UserToVerifyCrudRepository;
import com.Backend.EPI.persistence.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class UserToVerifyService {

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

        // Guardar el archivo en el servidor y establecer la ruta
        try{
            if (!supportingDocument.isEmpty()) {
                String filePath = saveFile(supportingDocument);
                userToVerify.setSupportingDocument(filePath);
            }
        } catch (IOException e) {
            throw new RuntimeException("Error al guardar el archivo", e);
        }

        return userToVerifyCrudRepository.save(userToVerify);
    }

    // Método para guardar el archivo en el sistema de archivos
    @Value("${file.upload-dir}")
    private String uploadDir;

    public String saveFile(MultipartFile file) throws IOException {
        String filePath = uploadDir + "/" + file.getOriginalFilename();
        File destinationFile = new File(filePath);
        File directory = destinationFile.getParentFile();

        if (!directory.exists()) {
            directory.mkdirs();
        }

        file.transferTo(destinationFile);
        return filePath;
    }

    // Método para obtener todos los usuarios pendientes de verificación
    public List<UserToVerify> getAllPendingUsers() {
        return (List<UserToVerify>) userToVerifyCrudRepository.findAll();
    }
}
