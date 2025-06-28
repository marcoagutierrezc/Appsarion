package com.Backend.EPI.persistence.crud;

import com.Backend.EPI.persistence.entity.Certificate;
import com.Backend.EPI.persistence.entity.Evaluation;
import com.Backend.EPI.persistence.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Long> {
    @Query("SELECT c FROM Certificate c WHERE c.user = :user AND c.evaluation = :evaluation")
    Certificate findByUserAndEvaluation(@Param("user") User user, @Param("evaluation") Evaluation evaluation);

    List<Certificate> findByUserId(Long userId);
    @Override
    Optional<Certificate> findById(Long aLong);
}
