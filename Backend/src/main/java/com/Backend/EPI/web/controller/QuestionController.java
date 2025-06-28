package com.Backend.EPI.web.controller;

import com.Backend.EPI.domain.dto.AnswerDTO;
import com.Backend.EPI.domain.dto.QuestionDTO;
import com.Backend.EPI.persistence.entity.Answer;
import com.Backend.EPI.persistence.entity.Question;
import com.Backend.EPI.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/questions")
public class QuestionController {

     @Autowired
    private QuestionService questionService;

    @PostMapping
    public ResponseEntity<Question> createQuestion(@RequestBody Question question) {
        Question createdQuestion = questionService.createQuestion(question);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdQuestion);
    }

    @PostMapping("/{questionId}/answers")
    public ResponseEntity<Void> addAnswersToQuestion(
            @PathVariable Long questionId,
            @RequestBody List<Answer> answers) {
        boolean success = questionService.addAnswersToQuestion(questionId, answers);
        if (success) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<QuestionDTO>> getAllQuestions() {
        List<QuestionDTO> questions = questionService.getAllQuestions();
        return ResponseEntity.ok(questions);
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuestionDTO> getQuestionById(@PathVariable Long id) {
        QuestionDTO questionDTO = questionService.getQuestionById(id);
        return ResponseEntity.ok(questionDTO);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id) {
        questionService.deleteQuestion(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/random/{number}")
    public ResponseEntity<List<QuestionDTO>> getRandomQuestions(@PathVariable int number) {
        List<Question> randomQuestions = questionService.getRandomQuestions(number);

        List<QuestionDTO> questionDTOs = randomQuestions.stream()
                .map(question -> {
                    QuestionDTO dto = new QuestionDTO();
                    dto.setId(question.getId());
                    dto.setQuestionText(question.getQuestionText());
                    dto.setCategoryName(question.getCategory() != null ? question.getCategory().getCategoryName() : "Sin categoría");
                    dto.setAnswers(question.getAnswers().stream().map(answer ->
                            new AnswerDTO(
                                    answer.getId(),
                                    answer.getAnswerText(),
                                    false // Ocultar si es correcta
                            )
                    ).collect(Collectors.toList()));
                    return dto;
                }).collect(Collectors.toList());

        return ResponseEntity.ok(questionDTOs);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Question> updateQuestion(
            @PathVariable Long id,
            @RequestBody Question question) {
        Question updatedQuestion = questionService.updateQuestion(id, question);
        return ResponseEntity.ok(updatedQuestion);
    }




}

