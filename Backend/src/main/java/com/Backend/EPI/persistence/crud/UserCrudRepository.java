package com.Backend.EPI.persistence.crud;

import com.Backend.EPI.persistence.entity.Certificate;
import com.Backend.EPI.persistence.entity.User;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface UserCrudRepository extends CrudRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    // Buscar usuarios cuyo ID no esté en la lista de IDs de administradores
    List<User> findByIdNotIn(List<Long> ids);

    // Buscar usuarios cuyo ID esté en la lista de IDs de administradores
    List<User> findByIdIn(List<Long> ids);

    List<User> findByEstado(String estado);

}
