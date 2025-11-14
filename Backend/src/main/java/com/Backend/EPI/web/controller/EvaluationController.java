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

    @GetMapping("/{id}")
    public ResponseEntity<EvaluationDTO> getEvaluation(@PathVariable Long id) {
        try {
            EvaluationDTO dto = evaluationService.getEvaluationById(id);
            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<EvaluationDTO> updateEvaluation(@PathVariable Long id, @RequestBody EvaluationDTO dto) {
        try {
            EvaluationDTO updated = evaluationService.updateEvaluation(id, dto);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvaluation(@PathVariable Long id) {
        try {
            evaluationService.deleteEvaluation(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
