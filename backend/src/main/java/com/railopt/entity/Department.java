package com.railopt.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Represents an Indian Railway maintenance department (e.g., P-Way, TRD, S&T).
 *
 * Future: This entity will be linked to Asset and MaintenanceBlock
 * when those modules are implemented.
 */
@Entity
@Table(name = "departments", uniqueConstraints = {
        @UniqueConstraint(name = "uk_department_code", columnNames = "code")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 100)
    @Column(nullable = false)
    private String name;

    /** Short department code, e.g. "PWAY", "TRD", "ST" */
    @NotBlank
    @Size(max = 20)
    @Column(nullable = false, unique = true)
    private String code;

    @Size(max = 500)
    @Column(length = 500)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private DepartmentStatus status = DepartmentStatus.ACTIVE;

    /**
     * Maintenance tasks belonging to this department.
     * Cascade is intentionally NOT set to ALL — tasks should be managed independently.
     */
    @OneToMany(mappedBy = "department", fetch = FetchType.LAZY)
    @Builder.Default
    private List<MaintenanceTask> maintenanceTasks = new ArrayList<>();
}
