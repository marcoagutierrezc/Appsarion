

/*import com.Backend.EPI.domain.dto.LoginRequestDTO;
import com.Backend.EPI.domain.dto.LoginResponseDTO;
import com.Backend.EPI.persistence.entity.User;
import com.Backend.EPI.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO loginRequest) {
        Optional<User> userOptional = userService.authenticate(loginRequest.getEmail(), loginRequest.getPassword());

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            LoginResponseDTO response = new LoginResponseDTO("Login successful", user.getId(), user.getName(), user.getRole());
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        //traer el id del role
        LoginResponseDTO response = new LoginResponseDTO("Invalid email or password", null, null, null);
        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }
}
/*package com.Backend.EPI.web.controller;

//import com.Backend.EPI.config.JwtUtils;
import com.Backend.EPI.domain.dto.LoginRequestDTO;
import com.Backend.EPI.domain.dto.LoginResponseDTO;
import com.Backend.EPI.persistence.entity.User;
import com.Backend.EPI.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

 //   @Autowired
   /// private JwtUtils jwtUtils;

    // Endpoint para login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequest) {
        Optional<User> userOptional = userService.authenticate(loginRequest.getEmail(), loginRequest.getPassword());

        if (!userOptional.isPresent()) {
            return new ResponseEntity<>("Credenciales inválidas", HttpStatus.UNAUTHORIZED);
        }

        User user = userOptional.get();
    }
}
        // Generar token JWT
     //   String token = jwtUtils.generateToken(user);

        // Crear respuesta de login
  /*      LoginResponseDTO response = new LoginResponseDTO("Login exitoso", user.getId(), user.getName(), user.getRole());
        return ResponseEntity.ok()
                .header("Authorization", "Bearer " + token)
                .body(response);
    }

    // Endpoint para verificar si un usuario está autenticado (opcional)
    @GetMapping("/validate")
    public ResponseEntity<String> validateToken(@RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.replace("Bearer ", "");

        if (jwtUtils.validateToken(token)) {
            return ResponseEntity.ok("Token válido");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token inválido");
        }
    }*/
package com.Backend.EPI.web.controller;

import com.Backend.EPI.domain.dto.*;
import com.Backend.EPI.persistence.entity.*;
import com.Backend.EPI.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;
    @Autowired
    private PiscicultorService piscicultorService;

    @Autowired
    private EvaluadorService evaluadorService;

    @Autowired
    private ComercializadorService comercializadorService;

    @Autowired
    private AcademicoService academicoService;


    // Endpoint para login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequest) {
        Optional<User> userOptional = userService.authenticate(loginRequest.getEmail(), loginRequest.getPassword());

        if (!userOptional.isPresent()) {
            return new ResponseEntity<>("Credenciales inválidas", HttpStatus.UNAUTHORIZED);
        }

        User user = userOptional.get();

        // Crear un objeto RoleDataDTO con los datos específicos del rol
        RoleDataDTO roleData = fetchRoleDataForUser(user);

        // Crear el objeto de respuesta con los datos del usuario y su rol
        LoginResponseDTO response = new LoginResponseDTO(
                "Login exitoso",
                user.getId(),
                user.getName(),
                user.getRole(),
                roleData
        );

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    private RoleDataDTO fetchRoleDataForUser(User user) {
        RoleDataDTO roleData = new RoleDataDTO();

        switch (user.getRole()) {
            case "Piscicultor":
                System.out.println("Case Piscicultor");
                Optional<Piscicultor> optionalPiscicultor = piscicultorService.findByUserId(user.getId());
                if (optionalPiscicultor.isPresent()) {
                    Piscicultor piscicultor = optionalPiscicultor.get();
                    PiscicultorDTO piscicultorDTO = new PiscicultorDTO();
                    piscicultorDTO.setNameProperty(piscicultor.getNameProperty());
                    piscicultorDTO.setDepartment(piscicultor.getDepartment());
                    piscicultorDTO.setMunicipality(piscicultor.getMunicipality());
                    piscicultorDTO.setNeighborhood(piscicultor.getNeighborhood());
                    roleData.setPiscicultor(piscicultorDTO);
                }
                break;

            case "Evaluador":
                Optional<Evaluador> optionalEvaluador = evaluadorService.findByUserId(user.getId());
                if (optionalEvaluador.isPresent()) {
                    Evaluador evaluador = optionalEvaluador.get();
                    EvaluadorDTO evaluadorDTO = new EvaluadorDTO();
                    evaluadorDTO.setCompany(evaluador.getCompany());
                    evaluadorDTO.setEmployment(evaluador.getEmployment());
                    roleData.setEvaluador(evaluadorDTO);
                }
                break;

            case "Comercializador":
                Optional<Comercializador> optionalComercializador = comercializadorService.findByUserId(user.getId());
                if (optionalComercializador.isPresent()) {
                    Comercializador comercializador = optionalComercializador.get();
                    ComercializadorDTO comercializadorDTO = new ComercializadorDTO();
                    comercializadorDTO.setNameProperty(comercializador.getNameProperty());
                    comercializadorDTO.setDepartment(comercializador.getDepartment());
                    comercializadorDTO.setMunicipality(comercializador.getMunicipality());
                    comercializadorDTO.setNeighborhood(comercializador.getNeighborhood());
                    roleData.setComercializador(comercializadorDTO);
                }
                break;

            case "Academico":
                Optional<Academico> optionalAcademico = academicoService.findByUserId(user.getId());
                if (optionalAcademico.isPresent()) {
                    Academico academico = optionalAcademico.get();
                    AcademicoDTO academicoDTO = new AcademicoDTO();
                    academicoDTO.setInstitution(academico.getInstitution());
                    academicoDTO.setCareer(academico.getCareer());
                    academicoDTO.setCourse(academico.getCourse());
                    roleData.setAcademico(academicoDTO);
                }
                break;
            case "Admin":
                System.out.println("Case Admin");
                break;
            default:
                // Si no se reconoce el rol, no se asignan datos específicos
                break;
        }

        return roleData;
    }


}


