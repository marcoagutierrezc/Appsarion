package com.Backend.EPI.service;

import com.Backend.EPI.domain.dto.EvaluationDTO;
import com.Backend.EPI.domain.dto.UserAnswerDTO;
import com.Backend.EPI.domain.dto.EvaluationAnswerResultDTO;
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
import java.util.stream.Collectors;


import java.sql.Timestamp;
import java.time.Instant;
import java.util.ArrayList;

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

    /**
     * Evalúa las respuestas del usuario con nota en escala 0–5 con decimales.
     * Guarda en BD el entero redondeado (compatibilidad con columna INT),
     * y retorna en el DTO el decimal (scoreDecimal) y métricas de acierto.
     */
    public EvaluationDTO evaluate(Long userId, List<UserAnswerDTO> userAnswers) {
        // Crear la evaluación
        Evaluation evaluation = new Evaluation();
        evaluation.setUserId(userId);
        evaluation.setScore(0); // entero en la entidad
        evaluation.setStatus(Evaluation.EvaluationStatus.PENDING);
        evaluation.setCreatedAt(Timestamp.from(Instant.now()));
        evaluation.setUpdatedAt(Timestamp.from(Instant.now()));

        evaluation = evaluationRepository.save(evaluation);

        // Eliminar respuestas duplicadas por pregunta (última respuesta por pregunta prevalece)
        Map<Long, UserAnswerDTO> uniqueAnswers = new LinkedHashMap<>();
        for (UserAnswerDTO dto : userAnswers) {
            uniqueAnswers.put(dto.getQuestionId(), dto);
        }

        // Cargar preguntas/respuestas necesarias
        List<Long> questionIds = new ArrayList<>(uniqueAnswers.keySet());
        List<Long> answerIds = uniqueAnswers.values().stream()
                .map(UserAnswerDTO::getAnswerId)
                .collect(Collectors.toList());

        List<Question> questions = questionRepository.findAllByIdsWithAnswersAndCategory(questionIds);
        Map<Long, Question> questionMap = questions.stream()
                .collect(Collectors.toMap(Question::getId, q -> q));

        List<Answer> selectedAnswers = answerRepository.findAllByIds(answerIds);
        Map<Long, Answer> selectedAnswerMap = selectedAnswers.stream()
                .collect(Collectors.toMap(Answer::getId, a -> a));

        List<Answer> correctAnswers = answerRepository.findCorrectAnswersByQuestionIds(questionIds);
        Map<Long, Answer> correctAnswerMap = correctAnswers.stream()
                .collect(Collectors.toMap(answer -> answer.getQuestion().getId(), a -> a));

        int correctAnswersCount = 0;
        List<EvaluationAnswerResultDTO> results = new ArrayList<>();
        List<UserAnswer> userAnswersToSave = new ArrayList<>();

        for (UserAnswerDTO userAnswerDTO : uniqueAnswers.values()) {
            Long questionId = userAnswerDTO.getQuestionId();
            Long answerId = userAnswerDTO.getAnswerId();

            Question question = questionMap.get(questionId);
            if (question == null) {
                throw new RuntimeException("Pregunta no encontrada con ID: " + questionId);
            }

            Answer selectedAnswer = selectedAnswerMap.get(answerId);
            if (selectedAnswer == null) {
                throw new RuntimeException("Respuesta no encontrada con ID: " + answerId);
            }

            Answer correctAnswer = correctAnswerMap.get(questionId);
            if (correctAnswer == null) {
                throw new RuntimeException("No existe respuesta correcta configurada para la pregunta: " + questionId);
            }

            boolean isCorrect = selectedAnswer.getId().equals(correctAnswer.getId());

            // Acumular respuesta del usuario
            UserAnswer userAnswer = new UserAnswer();
            userAnswer.setEvaluation(evaluation);
            userAnswer.setQuestion(question);
            userAnswer.setAnswer(selectedAnswer);
            userAnswersToSave.add(userAnswer);

            if (isCorrect) {
                correctAnswersCount++;
            }

            EvaluationAnswerResultDTO result = new EvaluationAnswerResultDTO();
            result.setQuestionId(questionId);
            result.setSelectedAnswerId(answerId);
            result.setCorrectAnswerId(correctAnswer.getId());
            result.setCorrectAnswerText(correctAnswer.getAnswerText());
            result.setCorrect(isCorrect);
            results.add(result);
        }

        // Guardar respuestas del usuario en batch
        userAnswerRepository.saveAll(userAnswersToSave);

        int totalQuestions = uniqueAnswers.size();
        // Calcular nota decimal (0–5) con 1 decimal
        double scoreDecimal = totalQuestions > 0
                ? Math.round(((correctAnswersCount * 5.0) / totalQuestions) * 10.0) / 10.0
                : 0.0;
        // Guardar entero redondeado en la entidad
        int scoreInt = (int) Math.round(scoreDecimal);

        boolean passed = scoreDecimal >= 3.5; // criterio de aprobación

        evaluation.setScore(scoreInt);
        evaluation.setStatus(passed ? Evaluation.EvaluationStatus.COMPLETED : Evaluation.EvaluationStatus.FAILED);
        evaluation.setUpdatedAt(Timestamp.from(Instant.now()));
        evaluationRepository.save(evaluation);

        // Armar DTO de respuesta
        EvaluationDTO evaluationDTO = new EvaluationDTO();
        evaluationDTO.setId(evaluation.getId());
        evaluationDTO.setUserId(userId);
        evaluationDTO.setScore(scoreDecimal);
        // Si el DTO soporta scoreDecimal/counters, setearlos (de lo contrario, ignora si no existen)
        try {
            evaluationDTO.getClass().getMethod("setScoreDecimal", Double.class).invoke(evaluationDTO, scoreDecimal);
        } catch (Exception ignored) {}
        try {
            evaluationDTO.getClass().getMethod("setCorrectAnswers", Integer.class).invoke(evaluationDTO, correctAnswersCount);
            evaluationDTO.getClass().getMethod("setTotalQuestions", Integer.class).invoke(evaluationDTO, totalQuestions);
        } catch (Exception ignored) {}
        evaluationDTO.setStatus(passed ? "COMPLETED" : "FAILED");
        evaluationDTO.setCreatedAt(evaluation.getCreatedAt().toString());
        evaluationDTO.setUpdatedAt(evaluation.getUpdatedAt().toString());
        evaluationDTO.setResults(results);

        return evaluationDTO;
    }
}
