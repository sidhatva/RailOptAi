package com.railopt.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * An AI-generated maintenance block plan.
 * Stores the optimization result including affected trains,
 * reasoning, and approval details as JSON text.
 */
@Entity
@Table(name = "ai_block_plans")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiBlockPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Unique plan ID e.g. "BLK-AI-2026-9041" */
    @Column(nullable = false, unique = true, length = 50)
    private String planId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "corridor_id", nullable = false)
    private Corridor corridor;

    /** Track line e.g. "UP_MAIN" */
    @Column(length = 20)
    private String trackLine;

    private LocalDate scheduledDate;

    /** Block window start HH:mm */
    @Column(length = 10)
    private String windowStart;

    /** Block window end HH:mm */
    @Column(length = 10)
    private String windowEnd;

    /** Duration in hours (decimal) */
    private Double durationHours;

    /** Optimization score 0-100 */
    private Double optimizationScore;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private BlockPlanStatus status = BlockPlanStatus.PROPOSED;

    /** JSON text: list of AI reasoning objects */
    @Column(columnDefinition = "TEXT")
    private String reasoningJson;

    /** JSON text: list of affected train objects with delay info */
    @Column(columnDefinition = "TEXT")
    private String affectedTrainsJson;

    /** JSON text: list of assigned tasks */
    @Column(columnDefinition = "TEXT")
    private String assignedTasksJson;

    /** Departments involved e.g. "PWAY,TRD,ST" */
    @Column(length = 100)
    private String departments;

    @Column(length = 100)
    private String approvedBy;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime generatedAt;
}
