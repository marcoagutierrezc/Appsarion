package com.Backend.EPI.persistence.crud;

import com.Backend.EPI.persistence.entity.RealData;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface RealDataRepository extends CrudRepository<RealData, Long> {
    List<RealData> findByPiscicultorId(Long piscicultorId);
    List<RealData> findByEvaluadorId(Long evaluadorId);
    List<RealData> findByComercializadorId(Long comercializadorId);
    List<RealData> findByFishLotId(Long fishLotId);
}


