package com.Backend.EPI.persistence.crud;

import com.Backend.EPI.persistence.entity.Report;
import org.springframework.data.repository.CrudRepository;

public interface ReportRepository extends CrudRepository<Report, Long> {
}

