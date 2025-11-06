package com.Backend.EPI.config;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseMigrationRunner implements ApplicationRunner {

    private final JdbcTemplate jdbcTemplate;

    public DatabaseMigrationRunner(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(ApplicationArguments args) {
        // Asegura que evaluations.status soporte 'FAILED' además de 'PENDING' y 'COMPLETED'
        // Idempotente: si ya está con esos valores, el ALTER no cambia nada.
        try {
            jdbcTemplate.execute("ALTER TABLE evaluations MODIFY COLUMN status ENUM('PENDING','COMPLETED','FAILED') DEFAULT 'PENDING'");
        } catch (Exception ignored) {
            // Ignorar si falla por falta de permisos u otros motivos; la app seguirá, pero se registrará el error en logs si el driver lo hace.
        }
    }
}

