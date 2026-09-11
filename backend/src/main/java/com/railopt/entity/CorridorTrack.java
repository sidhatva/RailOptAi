package com.railopt.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * A track line within a corridor, e.g. "UP Main", "DN Main", "3rd Line".
 */
@Entity
@Table(name = "corridor_tracks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CorridorTrack {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "corridor_id", nullable = false)
    private Corridor corridor;

    /** e.g. "UP_MAIN", "DN_MAIN", "3RD_LINE" */
    @Column(nullable = false, length = 30)
    private String trackCode;

    @Column(nullable = false, length = 100)
    private String trackName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private TrackDirection direction = TrackDirection.UP;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private CorridorStatus status = CorridorStatus.OPERATIONAL;
}
