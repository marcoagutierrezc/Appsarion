package com.Backend.EPI.service;

import com.Backend.EPI.domain.dto.EvaluationDTO;
import com.Backend.EPI.domain.dto.UserAnswerDTO;
import com.Backend.EPI.persistence.crud.AnswerRepository;
import com.Backend.EPI.persistence.crud.EvaluationRepository;
import com.Backend.EPI.persistence.crud.QuestionRepository;
import com.Backend.EPI.persistence.crud.UserAnswerRepository;
import com.Backend.EPI.persistence.entity.Answer;
import com.Backend.EPI.persistence.entity.Evaluation;
import com.Backend.EPI.persistence.entity.Question;
import com.Backend.EPI.persistence.entity.UserAnswer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;
import java.util.LinkedHashMap;
import java.util.Optional;


import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;

@Service
public class EvaluationService {

    @Autowired
    private EvaluationRepository evaluationRepository;

    @Autowired
    private UserAnswerRepository userAnswerRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private AnswerRepository answerRepository;

    public EvaluationDTO evaluate(Long userId, List<UserAnswerDTO> userAnswers) {
        System.out.println("Evaluating userId: " + userId + ", answers: " + userAnswers);

        // Crear la evaluación
        Evaluation evaluation = new Evaluation();
        evaluation.setUserId(userId);
        evaluation.setScore(0);
        evaluation.setStatus(Evaluation.EvaluationStatus.PENDING);
        evaluation.setCreatedAt(Timestamp.from(Instant.now()));
        evaluation.setUpdatedAt(Timestamp.from(Instant.now()));

        evaluation = evaluationRepository.save(evaluation);

        int correctAnswers = 0;
        double score = 0.0;

        Map<Long, UserAnswerDTO> uniqueAnswers = new LinkedHashMap<>();
        for (UserAnswerDTO dto : userAnswers) {
            uniqueAnswers.putIfAbsent(dto.getQuestionId(), dto); // solo se guarda la primera aparición
        }

        // Evaluar las respuestas del usuario
        for (UserAnswerDTO userAnswerDTO : uniqueAnswers.values()) {
            Question question = questionRepository.findById(userAnswerDTO.getQuestionId())
                    .orElseThrow(() -> new RuntimeException("Pregunta no encontrada con ID: " + userAnswerDTO.getQuestionId()));

            Answer answer = answerRepository.findById(userAnswerDTO.getAnswerId())
                    .orElseThrow(() -> new RuntimeException("Respuesta no encontrada con ID: " + userAnswerDTO.getAnswerId()));

            boolean isCorrect = answer.getIsCorrect();

            // Guardar la respuesta del usuario
            UserAnswer userAnswer = new UserAnswer();
            userAnswer.setEvaluation(evaluation);
            userAnswer.setQuestion(question);
            userAnswer.setAnswer(answer);
            userAnswerRepository.save(userAnswer);

            // Incrementar el puntaje si la respuesta es correcta
            if (isCorrect) {
                correctAnswers++;
                score += 0.33; // Cada respuesta correcta vale 0.33
            }
        }

        // Determinar si pasó o no
        boolean passed = correctAnswers >= 10; // Debe acertar al menos 10 respuestas

        // Actualizar la evaluación con el puntaje final y estado
        evaluation.setScore((int) Math.round(score));
        evaluation.setStatus(passed ? Evaluation.EvaluationStatus.COMPLETED : Evaluation.EvaluationStatus.FAILED);
        evaluation.setUpdatedAt(Timestamp.from(Instant.now()));
        evaluationRepository.save(evaluation);

        // Retornar el resultado como DTO
        EvaluationDTO evaluationDTO = new EvaluationDTO();
        evaluationDTO.setId(evaluation.getId());
        evaluationDTO.setUserId(userId);
        evaluationDTO.setScore((int) Math.round(score));
        evaluationDTO.setStatus(passed ? "COMPLETED" : "FAILED");
        evaluationDTO.setCreatedAt(evaluation.getCreatedAt().toString());
        evaluationDTO.setUpdatedAt(evaluation.getUpdatedAt().toString());

        return evaluationDTO;
    }
}
