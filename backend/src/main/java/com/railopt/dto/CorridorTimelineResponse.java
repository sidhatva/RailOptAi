package com.railopt.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

/**
 * Corridor timeline data for the dashboard CorridorTimeline component.
 * Contains active trains and maintenance blocks for graphical rendering.
 */
@Data
@Builder
public class CorridorTimelineResponse {

    private Long corridorId;
    private String corridorCode;
    private String corridorName;

    /** Train entries for timeline rendering */
    private List<TrainEntry> trains;

    /** Maintenance block windows */
    private List<BlockEntry> blocks;

    @Data
    @Builder
    public static class TrainEntry {
        private String trainNumber;
        private String trainName;
        private String trainType;
        private String category;
        private String status;
        private Integer delayMinutes;
        private String trackLine;
        private Integer priority;
        private Boolean kavachFitted;
        private String departureTime;
        private String arrivalTime;
    }

    @Data
    @Builder
    public static class BlockEntry {
        private String planId;
        private String windowStart;
        private String windowEnd;
        private Double durationHours;
        private String trackLine;
        private String departments;
        private String status;
        private Double optimizationScore;
    }
}
