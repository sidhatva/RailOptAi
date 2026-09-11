package com.railopt.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Map;

/**
 * Dashboard summary aggregated from all modules.
 * Powers the 5 KPI metric cards on the main dashboard.
 */
@Data
@Builder
public class DashboardSummaryResponse {

    // Asset health
    private Double assetAvailabilityPercent;
    private Long totalAssets;
    private Long criticalAssets;
    private Long totalTrackKmMonitored;

    // Task metrics
    private Long totalTasks;
    private Long criticalTasks;
    private Long urgentTasks;
    private Long pendingTasks;
    private Long inProgressTasks;

    // Block metrics
    private Long totalBlockPlans;
    private Long approvedBlockPlans;
    private Long proposedBlockPlans;

    // Train metrics
    private Long totalTrains;
    private Long delayedTrains;
    private Long conflictsResolved;
    private Long unplannedDetentions;

    // Maintenance workload
    private Double totalWorkloadHoursPerWeek;
    private Map<String, Double> workloadByDepartment; // dept code -> hours/week %
    private Double machineUtilizationPercent;

    // System info
    private String generatedAt;
}
