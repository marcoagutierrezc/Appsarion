package com.Backend.EPI.persistence.crud;


import com.Backend.EPI.persistence.entity.Answer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, Long> {

    List<Answer> findByQuestionId(Long questionId);

    /**
     * Encuentra la respuesta correcta de una pregunta específica
     * Más eficiente que filtrar todas las respuestas
     */
    @Query("SELECT a FROM Answer a WHERE a.question.id = :questionId AND a.isCorrect = true")
    Optional<Answer> findCorrectAnswerByQuestionId(Long questionId);

    /**
     * Carga todas las respuestas correctas de múltiples preguntas en una sola consulta
     * Muy útil para la evaluación
     */
    @Query("SELECT a FROM Answer a WHERE a.question.id IN :questionIds AND a.isCorrect = true")
    List<Answer> findCorrectAnswersByQuestionIds(List<Long> questionIds);

    /**
     * Carga respuestas por sus IDs (para validación rápida)
     */
    @Query("SELECT a FROM Answer a WHERE a.id IN :ids")
    List<Answer> findAllByIds(List<Long> ids);
}
