package com.railopt.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Represents a physical railway asset — track, bridge, signal, TSS, OHE, etc.
 * Linked to a Department (owner) and a Corridor (location).
 */
@Entity
@Table(name = "railway_assets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RailwayAsset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Human-readable unique ID e.g. "AST-TRK-01", "AST-TSS-05" */
    @Column(nullable = false, unique = true, length = 50)
    private String assetId;

    @Column(nullable = false, length = 200)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AssetType assetType;

    /** Department responsible for this asset */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    /** Corridor where this asset is located */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "corridor_id", nullable = false)
    private Corridor corridor;

    /** Track section or chainage e.g. "Aligarh - Sasni" */
    @Column(length = 200)
    private String section;

    /** Physical location description */
    @Column(length = 200)
    private String location;

    /** Health score 0-100 */
    @Builder.Default
    private Integer healthScore = 100;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private AssetStatus status = AssetStatus.GOOD;

    private LocalDate lastMaintenance;

    private LocalDate nextInspectionDue;

    /** Number of currently open defects */
    @Builder.Default
    private Integer defectsCount = 0;

    /** Active Temporary Speed Restriction if any */
    @Column(length = 200)
    private String activeTsr;

    /** GMT (Gross Million Tonnes) carried for track sections */
    private Double gmtCarried;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
