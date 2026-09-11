package com.railopt.repository;

import com.railopt.entity.Train;
import com.railopt.entity.TrainStatus;
import com.railopt.entity.TrainType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrainRepository extends JpaRepository<Train, Long> {

    List<Train> findByCorridor_Id(Long corridorId);

    List<Train> findByCorridor_CorridorId(String corridorId);

    List<Train> findByStatus(TrainStatus status);

    List<Train> findByTrainType(TrainType trainType);

    List<Train> findByCorridor_IdAndTrainType(Long corridorId, TrainType trainType);
}
