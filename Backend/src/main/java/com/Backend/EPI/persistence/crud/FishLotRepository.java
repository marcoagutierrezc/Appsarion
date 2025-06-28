package com.Backend.EPI.persistence.crud;

import com.Backend.EPI.persistence.entity.FishLot;
import org.springframework.data.repository.CrudRepository;
import java.util.List;

public interface FishLotRepository extends CrudRepository<FishLot, Long> {
    List<FishLot> findByPiscicultorId(Long piscicultorId);
    List<FishLot> findByComercializadorId(Long comercializadorId);
    List<FishLot> findByEvaluadorId(Long evaluadorId);
    List<FishLot> findByAcademicoId(Long academicoId);
}
