package com.railopt.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Represents an Indian Railway operational corridor (e.g., Delhi - Kanpur HDN-1).
 * Contains embedded track lines and station lists for timeline rendering.
 */
@Entity
@Table(name = "corridors", uniqueConstraints = {
        @UniqueConstraint(name = "uk_corridor_code", columnNames = "corridor_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Corridor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Human-readable code e.g. "NDLS-CNB", "HDN-1" */
    @Column(name = "corridor_id", nullable = false, unique = true, length = 30)
    private String corridorId;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(nullable = false, length = 20)
    private String fromStation;

    @Column(nullable = false, length = 20)
    private String toStation;

    /** Total route length in kilometres */
    private Integer lengthKm;

    /** Capacity utilization % (can exceed 100 = over-saturated) */
    private Integer capacityUtilization;

    private Integer dailyTrains;

    @Column(length = 100)
    private String zone;

    @Column(length = 100)
    private String division;

    @Column(length = 200)
    private String signaling;

    @Column(length = 200)
    private String traction;

    private Integer speedLimit;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private CorridorStatus status = CorridorStatus.OPERATIONAL;

    /** Track lines (UP Main, DN Main, 3rd Line, etc.) */
    @OneToMany(mappedBy = "corridor", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<CorridorTrack> tracks = new ArrayList<>();

    /** Station sequence along the corridor */
    @OneToMany(mappedBy = "corridor", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("km ASC")
    @Builder.Default
    private List<CorridorStation> stations = new ArrayList<>();

    /** Trains operating on this corridor */
    @OneToMany(mappedBy = "corridor", fetch = FetchType.LAZY)
    @Builder.Default
    private List<Train> trains = new ArrayList<>();

    /** Railway assets on this corridor */
    @OneToMany(mappedBy = "corridor", fetch = FetchType.LAZY)
    @Builder.Default
    private List<RailwayAsset> assets = new ArrayList<>();
}
