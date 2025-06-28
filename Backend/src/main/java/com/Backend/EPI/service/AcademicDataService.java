package com.Backend.EPI.service;

import com.Backend.EPI.persistence.crud.AcademicDataRepository;
import com.Backend.EPI.persistence.entity.AcademicData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AcademicDataService {
    @Autowired
    private AcademicDataRepository academicDataRepository;

    public AcademicData save(AcademicData academicData) {
        return academicDataRepository.save(academicData);
    }
}
