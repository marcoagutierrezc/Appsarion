package com.Backend.EPI.persistence.crud;


import com.Backend.EPI.persistence.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    /**
     * Carga todas las preguntas con sus respuestas y categorías en una sola consulta
     * Evita el problema N+1 usando JOIN FETCH
     */
    @Query("SELECT DISTINCT q FROM Question q " +
           "LEFT JOIN FETCH q.answers " +
           "LEFT JOIN FETCH q.category")
    List<Question> findAllWithAnswersAndCategory();

    /**
     * Encuentra una pregunta con sus respuestas y categoría por ID
     */
    @Query("SELECT q FROM Question q " +
           "LEFT JOIN FETCH q.answers " +
           "LEFT JOIN FETCH q.category " +
           "WHERE q.id = :id")
    Optional<Question> findByIdWithAnswersAndCategory(Long id);

    /**
     * Obtiene IDs de todas las preguntas para selección aleatoria más rápida
     */
    @Query("SELECT q.id FROM Question q")
    List<Long> findAllQuestionIds();

    /**
     * Carga múltiples preguntas por IDs con sus respuestas y categorías
     */
    @Query("SELECT DISTINCT q FROM Question q " +
           "LEFT JOIN FETCH q.answers " +
           "LEFT JOIN FETCH q.category " +
           "WHERE q.id IN :ids")
    List<Question> findAllByIdsWithAnswersAndCategory(List<Long> ids);
}
