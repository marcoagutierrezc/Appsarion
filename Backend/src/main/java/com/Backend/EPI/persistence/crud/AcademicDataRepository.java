package com.Backend.EPI.persistence.crud;

import com.Backend.EPI.persistence.entity.AcademicData;
import org.springframework.data.repository.CrudRepository;

public interface AcademicDataRepository extends CrudRepository<AcademicData, Long> {
}
