package com.Backend.EPI.persistence.repository;

import com.Backend.EPI.persistence.entity.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    /**
     * Encuentra un token válido pasando el timestamp actual desde la app (evita issues de tz)
     */
    @Query("SELECT t FROM PasswordResetToken t WHERE t.token = :token AND t.isUsed = false AND t.expiresAt > :now")
    Optional<PasswordResetToken> findValidToken(@Param("token") String token, @Param("now") LocalDateTime now);

    /**
     * Encuentra un token por su valor sin importar estado
     */
    Optional<PasswordResetToken> findByToken(String token);

    /**
     * Último token no usado por email
     */
    @Query("SELECT t FROM PasswordResetToken t WHERE t.email = :email AND t.isUsed = false ORDER BY t.createdAt DESC")
    Optional<PasswordResetToken> findLatestValidTokenByEmail(@Param("email") String email);

    /**
     * Elimina tokens expirados
     */
    @Modifying
    @Query("DELETE FROM PasswordResetToken t WHERE t.expiresAt < :now")
    void deleteExpiredTokens(@Param("now") LocalDateTime now);
}
