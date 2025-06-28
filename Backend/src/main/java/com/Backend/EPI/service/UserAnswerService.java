package com.Backend.EPI.service;

import com.Backend.EPI.persistence.entity.UserAnswer;
import com.Backend.EPI.persistence.crud.UserAnswerRepository;
import com.Backend.EPI.domain.dto.UserAnswerDTO;
import com.Backend.EPI.persistence.entity.Evaluation;
import com.Backend.EPI.persistence.entity.Question;
import com.Backend.EPI.persistence.entity.Answer;
import com.Backend.EPI.persistence.crud.EvaluationRepository;
import com.Backend.EPI.persistence.crud.QuestionRepository;
import com.Backend.EPI.persistence.crud.AnswerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserAnswerService {

    @Autowired
    private UserAnswerRepository userAnswerRepository;

    @Autowired
    private EvaluationRepository evaluationRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private AnswerRepository answerRepository;

    // Método para guardar la respuesta del usuario
    public UserAnswerDTO saveUserAnswer(UserAnswerDTO userAnswerDTO) {
        // Buscar las entidades asociadas
        Evaluation evaluation = evaluationRepository.findById(userAnswerDTO.getEvaluationId())
                .orElseThrow(() -> new RuntimeException("Evaluation not found"));
        Question question = questionRepository.findById(userAnswerDTO.getQuestionId())
                .orElseThrow(() -> new RuntimeException("Question not found"));
        Answer answer = answerRepository.findById(userAnswerDTO.getAnswerId())
                .orElseThrow(() -> new RuntimeException("Answer not found"));

        // Crear y guardar la entidad UserAnswer
        UserAnswer userAnswer = new UserAnswer();
        userAnswer.setEvaluation(evaluation);
        userAnswer.setQuestion(question);
        userAnswer.setAnswer(answer);

        userAnswerRepository.save(userAnswer);

        // Mapear a DTO para la respuesta
        userAnswerDTO.setId(userAnswer.getId());
        return userAnswerDTO;
    }
}

