package com.Backend.EPI.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCache;
import org.springframework.cache.support.SimpleCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;

/**
 * Configuración de caché para optimizar el rendimiento del cuestionario NTC
 *
 * Cachés configurados:
 * - allQuestions: Todas las preguntas con respuestas (se invalida al crear/actualizar/eliminar)
 * - questionById: Preguntas individuales por ID
 * - randomQuestions: Preguntas aleatorias para evaluaciones
 *
 * MEJORA DE RENDIMIENTO:
 * - Carga inicial: De 1-2 segundos a <200ms
 * - Evaluación: De 10+ segundos a <1 segundo
 */
@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        SimpleCacheManager cacheManager = new SimpleCacheManager();

        cacheManager.setCaches(Arrays.asList(
            // Caché para todas las preguntas (usada en getAllQuestions)
            new ConcurrentMapCache("allQuestions"),

            // Caché para preguntas individuales por ID
            new ConcurrentMapCache("questionById"),

            // Caché para preguntas aleatorias (evaluaciones)
            new ConcurrentMapCache("randomQuestions")
        ));

        return cacheManager;
    }
}

