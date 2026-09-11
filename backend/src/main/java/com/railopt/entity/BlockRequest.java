package com.railopt.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * A departmental request to take a maintenance block on a corridor.
 * Submitted by SSE/JE before being processed and converted to an AI Block Plan.
 */
@Entity
@Table(name = "block_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BlockRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Unique block request identifier e.g. "BLK-REQ-PWAY-001" */
    @Column(nullable = false, unique = true, length = 50)
    private String blockId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "corridor_id", nullable = false)
    private Corridor corridor;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    /** Track line requested e.g. "UP_MAIN" */
    @Column(length = 20)
    private String trackLine;

    /** Requested block start (HH:mm) */
    @Column(length = 10)
    private String requestedStart;

    /** Requested block end (HH:mm) */
    @Column(length = 10)
    private String requestedEnd;

    /** Requested duration in minutes */
    private Integer durationMinutes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Priority priority = Priority.MEDIUM;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private BlockRequestStatus status = BlockRequestStatus.PENDING;

    @Column(length = 1000)
    private String notes;

    /** Name/designation of the requesting officer */
    @Column(length = 100)
    private String requestedBy;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
