package com.railopt.service;

import com.railopt.dto.AiBlockPlanGenerateRequest;
import com.railopt.dto.AiBlockPlanResponse;
import com.railopt.entity.AiBlockPlan;
import com.railopt.entity.BlockPlanStatus;
import com.railopt.exception.ResourceNotFoundException;
import com.railopt.repository.AiBlockPlanRepository;
import com.railopt.service.ai.PriorityEngine;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class AiBlockPlanService {

    private final AiBlockPlanRepository blockPlanRepository;
    private final PriorityEngine priorityEngine;

    public List<AiBlockPlanResponse> getAllBlockPlans() {
        return blockPlanRepository.findAll().stream()
                .map(AiBlockPlanResponse::from).toList();
    }

    public List<AiBlockPlanResponse> getBlockPlansByStatus(String statusStr) {
        BlockPlanStatus status = BlockPlanStatus.valueOf(statusStr.toUpperCase());
        return blockPlanRepository.findByStatus(status).stream()
                .map(AiBlockPlanResponse::from).toList();
    }

    public AiBlockPlanResponse getBlockPlanById(Long id) {
        AiBlockPlan plan = blockPlanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Block plan not found with id: " + id));
        return AiBlockPlanResponse.from(plan);
    }

    @Transactional
    public AiBlockPlanResponse generateBlockPlan(AiBlockPlanGenerateRequest request) {
        return priorityEngine.optimizeBlockPlan(request);
    }

    @Transactional
    public AiBlockPlanResponse approveBlockPlan(Long id, String approvedBy) {
        AiBlockPlan plan = blockPlanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Block plan not found with id: " + id));
        plan.setStatus(BlockPlanStatus.APPROVED);
        plan.setApprovedBy(approvedBy);
        AiBlockPlan saved = blockPlanRepository.save(plan);
        log.info("Approved block plan id={} by {}", saved.getPlanId(), approvedBy);
        return AiBlockPlanResponse.from(saved);
    }
}
