package com.Backend.EPI.persistence.crud;

import com.Backend.EPI.persistence.entity.UserAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserAnswersRepository extends JpaRepository<UserAnswer, Long> {
    long countByAnswerId(Long answerId);
}
