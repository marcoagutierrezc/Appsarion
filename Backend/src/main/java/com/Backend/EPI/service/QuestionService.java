package com.Backend.EPI.service;

import com.Backend.EPI.domain.dto.AnswerDTO;
import com.Backend.EPI.domain.dto.QuestionDTO;
import com.Backend.EPI.persistence.crud.UserAnswersRepository;
import com.Backend.EPI.persistence.entity.Question;
import com.Backend.EPI.persistence.entity.Answer;
import com.Backend.EPI.persistence.entity.Category;
import com.Backend.EPI.persistence.crud.QuestionRepository;
import com.Backend.EPI.persistence.crud.AnswerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.sql.Timestamp;
import java.util.*;

import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;


@Service
public class QuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private AnswerRepository answerRepository;

    @Autowired
    private UserAnswersRepository userAnswersRepository;


    @Transactional
    public Question createQuestion(Question question) {
        // Guardar la pregunta primero sin respuestas
        Question savedQuestion = questionRepository.save(question);

        // Asociar la pregunta guardada a cada respuesta
        if (question.getAnswers() != null) {
            for (Answer answer : question.getAnswers()) {
                answer.setQuestion(savedQuestion);
            }
            // Guardar todas las respuestas
            answerRepository.saveAll(question.getAnswers());
        }

        return savedQuestion;
    }

    @Transactional
    public boolean addAnswersToQuestion(Long questionId, List<Answer> answers) {
        // Buscar la pregunta por ID
        Question question = questionRepository.findById(questionId).orElse(null);

        if (question == null) {
            return false; // Si no existe la pregunta, retornar false
        }

        // Asignar la pregunta a cada respuesta
        for (Answer answer : answers) {
            answer.setQuestion(question);
        }

        // Guardar las respuestas en la base de datos
        answerRepository.saveAll(answers);
        return true;
    }


    public List<QuestionDTO> getAllQuestions() {
        List<Question> questions = questionRepository.findAll();

        return questions.stream().map(question -> {
            QuestionDTO dto = new QuestionDTO();
            dto.setId(question.getId());
            dto.setQuestionText(question.getQuestionText());
            if (question.getCategory() != null) {
                dto.setCategoryName(question.getCategory().getCategoryName());
            } else {
                dto.setCategoryName("Sin categoría"); // Asigna un valor predeterminado
            }
            dto.setCategoryName(question.getCategory().getCategoryName());
            dto.setAnswers(question.getAnswers().stream().map(answer -> {
                AnswerDTO answerDTO = new AnswerDTO(answer.getId(), answer.getAnswerText(), answer.getIsCorrect());
                answerDTO.setId(answer.getId());
                answerDTO.setAnswerText(answer.getAnswerText());
                answerDTO.setIsCorrect(answer.getIsCorrect());
                return answerDTO;
            }).collect(Collectors.toList()));
            return dto;
        }).collect(Collectors.toList());
    }


    public QuestionDTO getQuestionById(Long id) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Question not found with id " + id));

        // Convierte la entidad a DTO
        QuestionDTO dto = new QuestionDTO();
        dto.setId(question.getId());
        dto.setQuestionText(question.getQuestionText());

        if (question.getCategory() != null) {
            dto.setCategoryName(question.getCategory().getCategoryName());
        }

        if (question.getAnswers() != null) {
            List<AnswerDTO> answerDTOs = question.getAnswers().stream()
                    .map(answer -> new AnswerDTO(answer.getId(), answer.getAnswerText(), answer.getIsCorrect()))
                    .collect(Collectors.toList());
            dto.setAnswers(answerDTOs);
        }


        return dto;
    }


    @Transactional
    public void deleteQuestion(Long id) {
        questionRepository.deleteById(id);
    }


    @Transactional
    public List<Question> getRandomQuestions(int numberOfQuestions) {
        List<Question> allQuestions = questionRepository.findAll();
        if (allQuestions.size() <= numberOfQuestions) {
            return allQuestions; // Si hay menos preguntas que las solicitadas, devuelve todas
        }

        // Seleccionar preguntas aleatorias
        Random random = new Random();
        return random.ints(0, allQuestions.size())
                .distinct()
                .limit(numberOfQuestions)
                .mapToObj(allQuestions::get)
                .collect(Collectors.toList());
    }

    @Transactional
    public Question updateQuestion(Long id, Question updatedQuestion) {
        // Buscar la pregunta existente
        Question existingQuestion = questionRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Question not found with id " + id));

        // Actualizar el texto de la pregunta
        existingQuestion.setQuestionText(updatedQuestion.getQuestionText());

        // Actualizar la categoría si se proporciona
        if (updatedQuestion.getCategory() != null) {
            existingQuestion.setCategory(updatedQuestion.getCategory());
        }

        // Obtener respuestas actuales
        List<Answer> existingAnswers = existingQuestion.getAnswers();
        Map<Long, Answer> existingAnswerMap = existingAnswers.stream()
                .collect(Collectors.toMap(Answer::getId, a -> a));

        List<Answer> updatedAnswers = new ArrayList<>();

        for (Answer updatedAnswer : updatedQuestion.getAnswers()) {
            if (updatedAnswer.getId() != null && existingAnswerMap.containsKey(updatedAnswer.getId())) {
                // Si la respuesta ya existe, la actualizamos
                Answer existingAnswer = existingAnswerMap.get(updatedAnswer.getId());
                existingAnswer.setAnswerText(updatedAnswer.getAnswerText());
                existingAnswer.setIsCorrect(updatedAnswer.getIsCorrect());
                updatedAnswers.add(existingAnswer);
            } else {
                // Nueva respuesta, la agregamos a la lista
                updatedAnswer.setQuestion(existingQuestion);
                updatedAnswers.add(updatedAnswer);
            }
        }

        // **ELIMINAMOS SOLO LAS RESPUESTAS QUE NO ESTÁN EN `user_answers`**
        List<Answer> answersToRemove = existingAnswers.stream()
                .filter(answer -> !updatedAnswers.contains(answer) && canDeleteAnswer(answer.getId()))
                .collect(Collectors.toList());

        if (!answersToRemove.isEmpty()) {
            answerRepository.deleteAll(answersToRemove);
        }

        // **Actualizamos la lista de respuestas sin reemplazarla**
        existingQuestion.getAnswers().clear();
        existingQuestion.getAnswers().addAll(updatedAnswers);

        // Guardar cambios
        return questionRepository.save(existingQuestion);
    }


    /**
     * Verifica si una respuesta se puede eliminar sin romper claves foráneas.
     */
    private boolean canDeleteAnswer(Long answerId) {
        return userAnswersRepository.countByAnswerId(answerId) == 0;
    }

}



