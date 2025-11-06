package com.Backend.EPI.persistence.repository;

import com.Backend.EPI.persistence.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Encuentra un usuario por su email
     */
    Optional<User> findByEmail(String email);
}

