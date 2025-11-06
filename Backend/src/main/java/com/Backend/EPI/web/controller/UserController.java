package com.Backend.EPI.web.controller;

import com.Backend.EPI.domain.dto.RoleDataDTO;
import com.Backend.EPI.domain.dto.UserDTO;
import com.Backend.EPI.persistence.entity.User;
import com.Backend.EPI.service.UserService;
import com.Backend.EPI.service.UserToVerifyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserToVerifyService userToVerifyService;

    @Autowired
    private UserService userService;


    @PostMapping("/validate/{id}")
    public ResponseEntity<?> validateAndSaveUser(@PathVariable Long id) {
        try {
            // Crear RoleDataDTO con valores null
            RoleDataDTO roleDataDTO = new RoleDataDTO();
            roleDataDTO.setPiscicultor(null);
            roleDataDTO.setEvaluador(null);
            roleDataDTO.setComercializador(null);
            roleDataDTO.setAcademico(null);

            // Validar y guardar el usuario con los datos del rol en null
            return new ResponseEntity<>(userToVerifyService.validateAndSaveUser(id, roleDataDTO), HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/update-role-data/{id}")
    public ResponseEntity<?> updateRoleData(@PathVariable Long id, @RequestBody RoleDataDTO roleDataDTO) {
        try {
            userService.updateRoleData(id, roleDataDTO);
            return new ResponseEntity<>("Datos del rol actualizados correctamente", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }


    // Endpoint para obtener todos los usuarios excepto los administradores
    @GetMapping("/non-admins")
    public ResponseEntity<List<User>> getAllNonAdminUsers() {
        List<User> users = userService.getAllNonAdminUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    // Endpoint para obtener solo los administradores
    @GetMapping("/admins")
    public ResponseEntity<List<User>> getAllAdminUsers() {
        List<User> admins = userService.getAllAdminUsers();
        return new ResponseEntity<>(admins, HttpStatus.OK);
    }

    // Endpoint para obtener usuarios filtrados por estado
    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<User>> getUsersByEstado(@PathVariable String estado) {
        return new ResponseEntity<>(userService.getAllUsersByEstado(estado), HttpStatus.OK);
    }




    // Endpoint para actualizar el estado de un usuario

    /*@PutMapping("/{id}/estado")
    public ResponseEntity<User> updateEstado(@PathVariable Long id, @RequestBody String nuevoEstado) {
        return new ResponseEntity<>(userService.updateEstado(id, nuevoEstado), HttpStatus.OK);
    }
    */

    @PutMapping("/{id}/estado")
    public ResponseEntity<User> updateEstado(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String nuevoEstado = body.get("estado"); // Extraemos solo el valor del campo 'estado'

        if (nuevoEstado == null || (!nuevoEstado.equalsIgnoreCase("activo") && !nuevoEstado.equalsIgnoreCase("inactivo"))) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        User user = userService.updateEstado(id, nuevoEstado); // Pasamos solo el estado
        return new ResponseEntity<>(user, HttpStatus.OK);
    }


    @GetMapping("/incomplete-role-data")
    public ResponseEntity<List<User>> getUsersWithIncompleteRoleData() {
        List<User> users = userService.getUsersWithIncompleteRoleData();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @GetMapping("/incomplete-data/{id}")
    public ResponseEntity<?> getUserWithIncompleteRoleDataById(@PathVariable Long id) {
        Optional<User> userOptional = userService.getUserWithIncompleteRoleDataById(id);

        if (userOptional.isPresent()) {
            return new ResponseEntity<>(userOptional.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>("No se encontraron usuarios con datos incompletos para el ID proporcionado.", HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/role-id/{id}")
    public ResponseEntity<?> getRoleIdByUserId(@PathVariable Long id) {
        Optional<Long> roleId = userService.getRoleIdByUserId(id);
        if (roleId.isPresent()) {
            return new ResponseEntity<>(Collections.singletonMap("roleId", roleId.get()), HttpStatus.OK);
        } else {
            return new ResponseEntity<>("El ID del rol no se encontró para el usuario proporcionado.", HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        try {
            Optional<User> userOptional = userService.getUser(id);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                // Retornar usuario con datos de su rol específico
                return new ResponseEntity<>(userService.getUserWithRoleData(id), HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Usuario no encontrado", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Error al obtener usuario: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Cambiar el rol de un usuario
     * PUT /users/{id}/role
     * Body: { "newRole": "Piscicultor" }
     */
    @PutMapping("/{id}/role")
    public ResponseEntity<?> changeUserRole(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        try {
            String newRole = body.get("newRole");
            if (newRole == null || newRole.trim().isEmpty()) {
                return new ResponseEntity<>("El nuevo rol no puede estar vacío", HttpStatus.BAD_REQUEST);
            }

            User updatedUser = userService.changeUserRole(id, newRole);
            return new ResponseEntity<>(updatedUser, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("Error: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al cambiar el rol: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Eliminar un usuario
     * DELETE /users/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return new ResponseEntity<>("Usuario eliminado exitosamente", HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("Error: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al eliminar usuario: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
