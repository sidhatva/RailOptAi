package com.railopt.repository;

import com.railopt.entity.AiBlockPlan;
import com.railopt.entity.BlockPlanStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AiBlockPlanRepository extends JpaRepository<AiBlockPlan, Long> {

    List<AiBlockPlan> findByCorridor_Id(Long corridorId);

    List<AiBlockPlan> findByStatus(BlockPlanStatus status);

    List<AiBlockPlan> findByScheduledDate(LocalDate date);

    long countByStatus(BlockPlanStatus status);
}
