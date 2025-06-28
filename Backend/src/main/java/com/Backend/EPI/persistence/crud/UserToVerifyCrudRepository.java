package com.Backend.EPI.persistence.crud;

import com.Backend.EPI.persistence.entity.UserToVerify;
import org.springframework.data.repository.CrudRepository;
import java.util.Optional;

public interface UserToVerifyCrudRepository extends CrudRepository<UserToVerify, Long> {
    Optional<UserToVerify> findByEmail(String email);
    boolean existsByEmail(String email);
}
