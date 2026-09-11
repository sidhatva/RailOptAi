package com.railopt.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * A station along a corridor, with chainage (km) and loop/speed data
 * used for train path analysis and timeline rendering.
 */
@Entity
@Table(name = "corridor_stations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CorridorStation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "corridor_id", nullable = false)
    private Corridor corridor;

    /** e.g. "NDLS", "GZB", "ALJN", "TDL", "CNB" */
    @Column(nullable = false, length = 10)
    private String stationCode;

    @Column(nullable = false, length = 100)
    private String stationName;

    /** Distance from corridor start in km */
    private Integer km;

    private Boolean hasLoops;

    /** Maximum permitted speed through station in km/h */
    private Integer maxSpeed;
}
