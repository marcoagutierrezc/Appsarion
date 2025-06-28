package com.Backend.EPI.service;

import com.Backend.EPI.domain.dto.CertificateDTO;
import com.Backend.EPI.persistence.entity.Certificate;
import com.Backend.EPI.persistence.entity.Evaluation;
import com.Backend.EPI.persistence.entity.User;
import com.Backend.EPI.persistence.crud.CertificateRepository;
import com.Backend.EPI.persistence.crud.EvaluationRepository;
import com.Backend.EPI.persistence.crud.UserCrudRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

@Service
public class CertificateService {

    private final CertificateRepository certificateRepository;
    private final EvaluationRepository evaluationRepository;
    private final UserCrudRepository userRepository;

    @Autowired
    public CertificateService(CertificateRepository certificateRepository,
                              EvaluationRepository evaluationRepository,
                              UserCrudRepository userRepository) {
        this.certificateRepository = certificateRepository;
        this.evaluationRepository = evaluationRepository;
        this.userRepository = userRepository;
    }

    public CertificateDTO generateCertificate(Long userId, Long evaluationId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Evaluation evaluation = evaluationRepository.findById(evaluationId)
                .orElseThrow(() -> new RuntimeException("Evaluación no encontrada"));

        Certificate existingCertificate = certificateRepository.findByUserAndEvaluation(user, evaluation);
        if (existingCertificate != null) {
            return new CertificateDTO(
                    existingCertificate.getId(),
                    existingCertificate.getCertificateCode(),
                    existingCertificate.getIssuedAt(),
                    existingCertificate.getUser().getId(),
                    existingCertificate.getEvaluation().getId()
            );
        }

        Certificate certificate = new Certificate();
        certificate.setUser(user);
        certificate.setEvaluation(evaluation);
        certificate.setCertificateCode(UUID.randomUUID().toString());
        certificate.setIssuedAt(new Timestamp(System.currentTimeMillis()));

        certificate = certificateRepository.save(certificate);

        return new CertificateDTO(
                certificate.getId(),
                certificate.getCertificateCode(),
                certificate.getIssuedAt(),
                certificate.getUser().getId(),
                certificate.getEvaluation().getId()
        );
    }

    public List<Certificate> getCertificatesByUserId(Long userId) {
        return certificateRepository.findByUserId(userId);
    }

    public Certificate getCertificateById(Long certificateId) {
        return certificateRepository.findById(certificateId).orElse(null);
    }
}
