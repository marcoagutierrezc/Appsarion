package com.Backend.EPI.web.controller;

import com.Backend.EPI.domain.dto.EvaluationDTO;
import com.Backend.EPI.domain.dto.UserAnswerDTO;
import com.Backend.EPI.service.EvaluationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/evaluations")
public class EvaluationController {

    @Autowired
    private EvaluationService evaluationService;

    @PostMapping("/evaluate")
    public ResponseEntity<EvaluationDTO> evaluate(@RequestBody EvaluationDTO evaluationRequestDTO) {
        return ResponseEntity.ok(
                evaluationService.evaluate(evaluationRequestDTO.getUserId(), evaluationRequestDTO.getUserAnswers())
        );
    }
}
