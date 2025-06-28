package com.Backend.EPI.service;

import com.Backend.EPI.persistence.entity.Answer;
import com.Backend.EPI.persistence.crud.AnswerRepository;
import com.Backend.EPI.domain.dto.AnswerDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;


@Service
public class AnswerService {

    @Autowired
    private AnswerRepository answerRepository;

    public Answer createAnswer(Answer answer) {
        return answerRepository.save(answer);
    }

    public List<Answer> getAnswersByQuestionId(Long questionId) {
        return answerRepository.findByQuestionId(questionId);
    }

    public void deleteAnswer(Long id) {
        answerRepository.deleteById(id);
    }
}

