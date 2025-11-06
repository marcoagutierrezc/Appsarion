package com.Backend.EPI.service;

import com.Backend.EPI.domain.dto.RoleDataDTO;
import com.Backend.EPI.domain.dto.UserDTO;
import com.Backend.EPI.persistence.crud.AdminRepository;
import com.Backend.EPI.persistence.crud.UserCrudRepository;
import com.Backend.EPI.persistence.entity.User;
import com.Backend.EPI.persistence.entity.Piscicultor;
import com.Backend.EPI.persistence.entity.Evaluador;
import com.Backend.EPI.persistence.entity.Comercializador;
import com.Backend.EPI.persistence.entity.Academico;
import com.Backend.EPI.persistence.crud.FishLotRepository;
import com.Backend.EPI.persistence.entity.FishLot;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import com.Backend.EPI.persistence.entity.Admin;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserCrudRepository userCrudRepository;

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
    private FishLotRepository fishLotRepository;

    @Autowired
    private AdminRepository adminRepository;


    @Transactional
    public User save(UserDTO userDTO) {
        User user = new User();
        user.setName(userDTO.getName());
        user.setDocumentType(userDTO.getDocumentType());
        user.setDocumentNumber(userDTO.getDocumentNumber());
        user.setPhoneNumber(userDTO.getPhoneNumber());
        user.setEmail(userDTO.getEmail());
    String encodedPassword = passwordEncoder.encode(userDTO.getPassword());
    // Guardar contraseña codificada (si viene ya codificada desde users_to_verify también funciona)
    user.setPassword(userDTO.getPassword() != null && userDTO.getPassword().startsWith("$2a$")
        ? userDTO.getPassword()
        : encodedPassword);
        user.setJustification(userDTO.getJustification());
    // Persistir el documento de soporte (ruta local o URL si ya fue subida)
    user.setSupportingDocument(userDTO.getSupportingDocument());
        user.setRole(userDTO.getRole());
        user.setEstado(userDTO.getEstado() != null ? userDTO.getEstado() : "activo");

        User savedUser = userCrudRepository.save(user);

        switch (userDTO.getRole()) {
            case "Piscicultor":
                if (userDTO.getRoleData() != null && userDTO.getRoleData().getPiscicultor() != null) {
                    Piscicultor piscicultor = new Piscicultor();
                    piscicultor.setUser(savedUser);
                    piscicultor.setNameProperty(userDTO.getRoleData().getPiscicultor().getNameProperty());
                    piscicultor.setDepartment(userDTO.getRoleData().getPiscicultor().getDepartment());
                    piscicultor.setMunicipality(userDTO.getRoleData().getPiscicultor().getMunicipality());
                    piscicultor.setNeighborhood(userDTO.getRoleData().getPiscicultor().getNeighborhood());
                    piscicultorService.save(piscicultor);
                }
                break;
            case "Evaluador":
                if (userDTO.getRoleData() != null && userDTO.getRoleData().getEvaluador() != null) {
                    Evaluador evaluador = new Evaluador();
                    evaluador.setUser(savedUser);
                    evaluador.setCompany(userDTO.getRoleData().getEvaluador().getCompany());
                    evaluador.setEmployment(userDTO.getRoleData().getEvaluador().getEmployment());
                    evaluadorService.save(evaluador);
                }
                break;
            case "Comercializador":
                if (userDTO.getRoleData() != null && userDTO.getRoleData().getComercializador() != null) {
                    Comercializador comercializador = new Comercializador();
                    comercializador.setUser(savedUser);
                    comercializador.setNameProperty(userDTO.getRoleData().getComercializador().getNameProperty());
                    comercializador.setDepartment(userDTO.getRoleData().getComercializador().getDepartment());
                    comercializador.setMunicipality(userDTO.getRoleData().getComercializador().getMunicipality());
                    comercializador.setNeighborhood(userDTO.getRoleData().getComercializador().getNeighborhood());
                    comercializadorService.save(comercializador);
                }
                break;
            case "Academico":
                if (userDTO.getRoleData() != null && userDTO.getRoleData().getAcademico() != null) {
                    Academico academico = new Academico();
                    academico.setUser(savedUser);
                    academico.setInstitution(userDTO.getRoleData().getAcademico().getInstitution());
                    academico.setCareer(userDTO.getRoleData().getAcademico().getCareer());
                    academico.setCourse(userDTO.getRoleData().getAcademico().getCourse());
                    academicoService.save(academico);
                }
                break;
            case "Admin":
                Admin admin = new Admin();
                admin.setUserId(savedUser.getId());
                adminRepository.save(admin);
                break;
            default:
                throw new IllegalArgumentException("Invalid role: " + userDTO.getRole());
        }

        return savedUser;
    }

    public Optional<User> getUser(Long id) {
        return userCrudRepository.findById(id);
    }

    public Optional<User> authenticate(String email, String password) {
        // Busca al usuario por email
        Optional<User> userOptional = userCrudRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            // Compara la contraseña cifrada con la contraseña proporcionada
            if (passwordEncoder.matches(password, user.getPassword())) {
                return userOptional; // Si coincide, retorna el usuario
            }
        }
        return Optional.empty(); // Si no coincide o no existe el usuario, retorna vacío
    }



    /*
    public List<FishLot> getFishLotsByUserId(Long userId) {
        Optional<User> userOptional = userCrudRepository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();

            if ("Piscicultor".equals(user.getRole())) {
                Optional<Piscicultor> piscicultor = piscicultorService.findByUserId(userId);
                return piscicultor.isPresent() ? fishLotRepository.findByPiscicultorId(piscicultor.get().getId()) : Collections.emptyList();
            } else if ("Comercializador".equals(user.getRole())) {
                Optional<Comercializador> comercializador = comercializadorService.findByUserId(userId);
                return comercializador.isPresent() ? fishLotRepository.findByComercializadorId(comercializador.get().getId()) : Collections.emptyList();
            }
        }
        return Collections.emptyList();
    }
*/
    // Método para obtener todos los usuarios excepto los administradores
    public List<User> getAllNonAdminUsers() {
        List<Long> adminIds = adminRepository.findAll().stream()
                .map(Admin::getUserId)
                .collect(Collectors.toList());
        return userCrudRepository.findByIdNotIn(adminIds);
    }

    // Método para obtener solo los administradores
    public List<User> getAllAdminUsers() {
        List<Long> adminIds = adminRepository.findAll().stream()
                .map(Admin::getUserId)
                .collect(Collectors.toList());
        return userCrudRepository.findByIdIn(adminIds);
    }

    @Transactional
    public void updateRoleData(Long userId, RoleDataDTO roleDataDTO) {
        Optional<User> userOptional = userCrudRepository.findById(userId);

        if (!userOptional.isPresent()) {
            throw new IllegalArgumentException("Usuario no encontrado");
        }

        User user = userOptional.get();

        switch (user.getRole()) {
            case "Piscicultor":
                if (roleDataDTO.getPiscicultor() != null) {
                    Piscicultor piscicultor = piscicultorService.findByUserId(user.getId())
                            .orElseThrow(() -> new IllegalArgumentException("Datos del piscicultor no encontrados"));
                    piscicultor.setNameProperty(roleDataDTO.getPiscicultor().getNameProperty());
                    piscicultor.setDepartment(roleDataDTO.getPiscicultor().getDepartment());
                    piscicultor.setMunicipality(roleDataDTO.getPiscicultor().getMunicipality());
                    piscicultor.setNeighborhood(roleDataDTO.getPiscicultor().getNeighborhood());
                    piscicultorService.save(piscicultor);
                }
                break;

            case "Evaluador":
                if (roleDataDTO.getEvaluador() != null) {
                    Evaluador evaluador = evaluadorService.findByUserId(user.getId())
                            .orElseThrow(() -> new IllegalArgumentException("Datos del evaluador no encontrados"));
                    evaluador.setCompany(roleDataDTO.getEvaluador().getCompany());
                    evaluador.setEmployment(roleDataDTO.getEvaluador().getEmployment());
                    evaluadorService.save(evaluador);
                }
                break;

            case "Comercializador":
                if (roleDataDTO.getComercializador() != null) {
                    Comercializador comercializador = comercializadorService.findByUserId(user.getId())
                            .orElseThrow(() -> new IllegalArgumentException("Datos del comercializador no encontrados"));
                    comercializador.setNameProperty(roleDataDTO.getComercializador().getNameProperty());
                    comercializador.setDepartment(roleDataDTO.getComercializador().getDepartment());
                    comercializador.setMunicipality(roleDataDTO.getComercializador().getMunicipality());
                    comercializador.setNeighborhood(roleDataDTO.getComercializador().getNeighborhood());
                    comercializadorService.save(comercializador);
                }
                break;

            case "Academico":
                if (roleDataDTO.getAcademico() != null) {
                    Academico academico = academicoService.findByUserId(user.getId())
                            .orElseThrow(() -> new IllegalArgumentException("Datos del académico no encontrados"));
                    academico.setInstitution(roleDataDTO.getAcademico().getInstitution());
                    academico.setCareer(roleDataDTO.getAcademico().getCareer());
                    academico.setCourse(roleDataDTO.getAcademico().getCourse());
                    academicoService.save(academico);
                }
                break;
            case "Admin":
                if (!adminRepository.existsByUserId(userId)) {
                    Admin admin = new Admin();
                    admin.setUserId(userId);
                    adminRepository.save(admin);
                }
                break;
            default:
                throw new IllegalArgumentException("Rol no soportado: " + user.getRole());
        }
    }

    public List<User> getAllUsersByEstado(String estado) {
        return userCrudRepository.findByEstado(estado);
    }

    /*public User updateEstado(Long userId, String nuevoEstado) {
        Optional<User> userOptional = userCrudRepository.findById(userId);

        if (!userOptional.isPresent()) {
            throw new IllegalArgumentException("Usuario no encontrado");
        }

        User user = userOptional.get();
        user.setEstado(nuevoEstado);
        return userCrudRepository.save(user);
    }
    */
    public User updateEstado(Long userId, String nuevoEstado) {
        Optional<User> userOptional = userCrudRepository.findById(userId);

        if (!userOptional.isPresent()) {
            throw new IllegalArgumentException("Usuario no encontrado");
        }

        User user = userOptional.get();
        user.setEstado(nuevoEstado.trim()); // Asignamos el estado limpio
        return userCrudRepository.save(user);
    }

    public List<User> getUsersWithIncompleteRoleData() {
        // Convertimos el Iterable en Stream para poder trabajar con filtros
        return StreamSupport.stream(userCrudRepository.findAll().spliterator(), false)
                .filter(user -> {
                    switch (user.getRole()) {
                        case "Piscicultor":
                            return piscicultorService.findByUserId(user.getId())
                                    .map(piscicultor ->
                                            piscicultor.getNameProperty() == null &&
                                                    piscicultor.getDepartment() == null &&
                                                    piscicultor.getMunicipality() == null &&
                                                    piscicultor.getNeighborhood() == null
                                    ).orElse(true);

                        case "Evaluador":
                            return evaluadorService.findByUserId(user.getId())
                                    .map(evaluador ->
                                            evaluador.getCompany() == null &&
                                                    evaluador.getEmployment() == null
                                    ).orElse(true);

                        case "Comercializador":
                            return comercializadorService.findByUserId(user.getId())
                                    .map(comercializador ->
                                            comercializador.getNameProperty() == null &&
                                                    comercializador.getDepartment() == null &&
                                                    comercializador.getMunicipality() == null &&
                                                    comercializador.getNeighborhood() == null
                                    ).orElse(true);

                        case "Academico":
                            return academicoService.findByUserId(user.getId())
                                    .map(academico ->
                                            academico.getInstitution() == null &&
                                                    academico.getCareer() == null &&
                                                    academico.getCourse() == null
                                    ).orElse(true);
                        case "Admin":
                            return !adminRepository.existsByUserId(user.getId());
                        default:
                            return false;
                    }
                }).collect(Collectors.toList());
    }

    public Optional<User> getUserWithIncompleteRoleDataById(Long userId) {
        // Buscar el usuario por id
        Optional<User> userOptional = userCrudRepository.findById(userId);

        if (!userOptional.isPresent()) {
            return Optional.empty(); // Si el usuario no existe, retornar vacío
        }

        User user = userOptional.get();

        // Verificar los datos incompletos según el rol del usuario
        switch (user.getRole()) {
            case "Piscicultor":
                return piscicultorService.findByUserId(user.getId())
                        .filter(piscicultor ->
                                piscicultor.getNameProperty() == null &&
                                        piscicultor.getDepartment() == null &&
                                        piscicultor.getMunicipality() == null &&
                                        piscicultor.getNeighborhood() == null
                        ).map(p -> user); // Retornar el usuario si tiene datos incompletos

            case "Evaluador":
                return evaluadorService.findByUserId(user.getId())
                        .filter(evaluador ->
                                evaluador.getCompany() == null &&
                                        evaluador.getEmployment() == null
                        ).map(e -> user);

            case "Comercializador":
                return comercializadorService.findByUserId(user.getId())
                        .filter(comercializador ->
                                comercializador.getNameProperty() == null &&
                                        comercializador.getDepartment() == null &&
                                        comercializador.getMunicipality() == null &&
                                        comercializador.getNeighborhood() == null
                        ).map(c -> user);

            case "Academico":
                return academicoService.findByUserId(user.getId())
                        .filter(academico ->
                                academico.getInstitution() == null &&
                                        academico.getCareer() == null &&
                                        academico.getCourse() == null
                        ).map(a -> user);
            case "Admin":
                return adminRepository.existsByUserId(userId) ? Optional.empty() : Optional.of(user);
            default:
                return Optional.empty(); // Si el rol no coincide, retornar vacío
        }
    }


    public Optional<Long> getRoleIdByUserId(Long userId) {
        // Buscar el usuario por ID
        Optional<User> userOptional = userCrudRepository.findById(userId);

        if (!userOptional.isPresent()) {
            return Optional.empty(); // Si no existe el usuario, retornar vacío
        }

        User user = userOptional.get();

        // Determinar el ID del rol según el tipo de rol del usuario
        switch (user.getRole()) {
            case "Piscicultor":
                return piscicultorService.findByUserId(user.getId())
                        .map(Piscicultor::getId);

            case "Evaluador":
                return evaluadorService.findByUserId(user.getId())
                        .map(Evaluador::getId);

            case "Comercializador":
                return comercializadorService.findByUserId(user.getId())
                        .map(Comercializador::getId);

            case "Academico":
                return academicoService.findByUserId(user.getId())
                        .map(Academico::getId);
            case "Admin":
                return adminRepository.findByUserId(userId).map(Admin::getId);
            default:
                return Optional.empty(); // Si no coincide ningún rol, retornar vacío
        }
    }

    /**
     * Obtiene un usuario con todos sus datos incluyendo datos de su rol específico
     */
    public Map<String, Object> getUserWithRoleData(Long userId) {
        Optional<User> userOptional = userCrudRepository.findById(userId);

        if (!userOptional.isPresent()) {
            throw new IllegalArgumentException("Usuario no encontrado");
        }

        User user = userOptional.get();
        Map<String, Object> userMap = new java.util.HashMap<>();

        // Agregar datos básicos del usuario
        userMap.put("id", user.getId());
        userMap.put("name", user.getName());
        userMap.put("email", user.getEmail());
        userMap.put("documentType", user.getDocumentType());
        userMap.put("documentNumber", user.getDocumentNumber());
        userMap.put("phoneNumber", user.getPhoneNumber());
        userMap.put("justification", user.getJustification());
        userMap.put("supportingDocument", user.getSupportingDocument());
        userMap.put("role", user.getRole());
        userMap.put("estado", user.getEstado());

        // Agregar datos específicos del rol
        switch (user.getRole()) {
            case "Piscicultor":
                Optional<Piscicultor> piscicultor = piscicultorService.findByUserId(userId);
                piscicultor.ifPresent(p -> {
                    userMap.put("roleData", java.util.Collections.singletonMap("piscicultor", p));
                });
                break;
            case "Evaluador":
                Optional<Evaluador> evaluador = evaluadorService.findByUserId(userId);
                evaluador.ifPresent(e -> {
                    userMap.put("roleData", java.util.Collections.singletonMap("evaluador", e));
                });
                break;
            case "Comercializador":
                Optional<Comercializador> comercializador = comercializadorService.findByUserId(userId);
                comercializador.ifPresent(c -> {
                    userMap.put("roleData", java.util.Collections.singletonMap("comercializador", c));
                });
                break;
            case "Academico":
                Optional<Academico> academico = academicoService.findByUserId(userId);
                academico.ifPresent(a -> {
                    userMap.put("roleData", java.util.Collections.singletonMap("academico", a));
                });
                break;
            case "Admin":
                userMap.put("roleData", java.util.Collections.singletonMap("admin", "Administrador"));
                break;
        }

        return userMap;
    }

    /**
     * Cambia el rol de un usuario
     * Elimina los datos de rol anterior y crea datos del nuevo rol
     */
    @Transactional
    public User changeUserRole(Long userId, String newRole) {
        Optional<User> userOptional = userCrudRepository.findById(userId);

        if (!userOptional.isPresent()) {
            throw new IllegalArgumentException("Usuario no encontrado");
        }

        User user = userOptional.get();
        String oldRole = user.getRole();

        // Validar que el nuevo rol sea válido
        if (!isValidRole(newRole)) {
            throw new IllegalArgumentException("Rol no válido: " + newRole);
        }

        // No permitir cambiar si es el mismo rol
        if (oldRole.equals(newRole)) {
            return user;
        }

        // Eliminar datos del rol anterior
        deleteRoleData(userId, oldRole);

        // Actualizar el rol en la tabla users
        user.setRole(newRole);
        User updatedUser = userCrudRepository.save(user);

        // Crear datos vacíos para el nuevo rol (el usuario debe completarlos después)
        createEmptyRoleData(updatedUser, newRole);

        return updatedUser;
    }

    /**
     * Elimina un usuario y todos sus datos asociados
     */
    @Transactional
    public void deleteUser(Long userId) {
        Optional<User> userOptional = userCrudRepository.findById(userId);

        if (!userOptional.isPresent()) {
            throw new IllegalArgumentException("Usuario no encontrado");
        }

        User user = userOptional.get();

        // Eliminar datos del rol
        deleteRoleData(userId, user.getRole());

        // Eliminar el usuario
        userCrudRepository.deleteById(userId);
    }

    /**
     * Elimina los datos asociados al rol de un usuario
     */
    private void deleteRoleData(Long userId, String role) {
        switch (role) {
            case "Piscicultor":
                Optional<Piscicultor> piscicultor = piscicultorService.findByUserId(userId);
                piscicultor.ifPresent(p -> piscicultorService.delete(p.getId()));
                break;
            case "Evaluador":
                Optional<Evaluador> evaluador = evaluadorService.findByUserId(userId);
                evaluador.ifPresent(e -> evaluadorService.delete(e.getId()));
                break;
            case "Comercializador":
                Optional<Comercializador> comercializador = comercializadorService.findByUserId(userId);
                comercializador.ifPresent(c -> comercializadorService.delete(c.getId()));
                break;
            case "Academico":
                Optional<Academico> academico = academicoService.findByUserId(userId);
                academico.ifPresent(a -> academicoService.delete(a.getId()));
                break;
            case "Admin":
                adminRepository.deleteByUserId(userId);
                break;
        }
    }

    /**
     * Crea datos vacíos para un nuevo rol
     */
    private void createEmptyRoleData(User user, String role) {
        switch (role) {
            case "Piscicultor":
                Piscicultor piscicultor = new Piscicultor();
                piscicultor.setUser(user);
                piscicultorService.save(piscicultor);
                break;
            case "Evaluador":
                Evaluador evaluador = new Evaluador();
                evaluador.setUser(user);
                evaluadorService.save(evaluador);
                break;
            case "Comercializador":
                Comercializador comercializador = new Comercializador();
                comercializador.setUser(user);
                comercializadorService.save(comercializador);
                break;
            case "Academico":
                Academico academico = new Academico();
                academico.setUser(user);
                academicoService.save(academico);
                break;
            case "Admin":
                Admin admin = new Admin();
                admin.setUserId(user.getId());
                adminRepository.save(admin);
                break;
        }
    }

    /**
     * Valida si un rol es válido
     */
    private boolean isValidRole(String role) {
        return role.equals("Piscicultor") ||
               role.equals("Evaluador") ||
               role.equals("Comercializador") ||
               role.equals("Academico") ||
               role.equals("Admin");
    }
}
