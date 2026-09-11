package com.railopt.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Represents a train operating on a corridor.
 * Schedule times are stored as strings (HH:mm) for flexibility.
 */
@Entity
@Table(name = "trains")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Train {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** e.g. "22436", "12302", "FR-BOXN-4012" */
    @Column(nullable = false, length = 30)
    private String trainNumber;

    @Column(nullable = false, length = 200)
    private String trainName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private TrainType trainType = TrainType.EXPRESS;

    /** Category label e.g. "Rajdhani", "Vande Bharat", "BOXN Freight" */
    @Column(length = 100)
    private String category;

    /** Source station code */
    @Column(nullable = false, length = 20)
    private String source;

    /** Destination station code */
    @Column(nullable = false, length = 20)
    private String destination;

    /** The corridor this train primarily operates on */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "corridor_id", nullable = false)
    private Corridor corridor;

    /** Default track line: UP_MAIN or DN_MAIN */
    @Column(length = 20)
    private String trackLine;

    /** Scheduling priority: 1 = highest (Rajdhani), 5 = lowest (freight) */
    @Builder.Default
    private Integer priority = 3;

    /** Max permissible speed in km/h */
    private Integer maxSpeed;

    /** Number of coaches/wagons */
    private Integer rakeLength;

    /** HH:mm departure from source */
    @Column(length = 10)
    private String departureTime;

    /** HH:mm arrival at destination or key intermediate station */
    @Column(length = 10)
    private String arrivalTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private TrainStatus status = TrainStatus.ON_TIME;

    /** Current delay in minutes (0 = on time) */
    @Builder.Default
    private Integer delayMinutes = 0;

    @Builder.Default
    private Boolean kavachFitted = false;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
