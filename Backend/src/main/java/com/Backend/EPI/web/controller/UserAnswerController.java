package com.Backend.EPI.web.controller;


import com.Backend.EPI.service.UserAnswerService;
import com.Backend.EPI.domain.dto.UserAnswerDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user-answers")
public class UserAnswerController {

    @Autowired
    private UserAnswerService userAnswerService;

    @PostMapping
    public UserAnswerDTO createUserAnswer(@RequestBody UserAnswerDTO userAnswerDTO) {
        return userAnswerService.saveUserAnswer(userAnswerDTO);
    }
}
