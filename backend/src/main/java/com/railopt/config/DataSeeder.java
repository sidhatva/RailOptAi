package com.railopt.config;

import com.railopt.entity.*;
import com.railopt.repository.DepartmentRepository;
import com.railopt.repository.MaintenanceTaskRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * Database seeder — inserts realistic Indian Railway DEMO/MOCK data on startup.
 *
 * This runs only when the departments table is empty to avoid duplicate inserts
 * on subsequent restarts. Safe to use with spring.jpa.hibernate.ddl-auto=update.
 *
 * Data is marked as DEMO data — not for production use.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements ApplicationRunner {

    private final DepartmentRepository departmentRepository;
    private final MaintenanceTaskRepository taskRepository;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (departmentRepository.count() > 0) {
            log.info("[DataSeeder] Data already exists — skipping seed.");
            return;
        }

        log.info("[DataSeeder] Seeding DEMO/MOCK data for RailOpt AI...");

        // ─── Departments ─────────────────────────────────────────────────────
        Department pway = departmentRepository.save(Department.builder()
                .name("Permanent Way")
                .code("PWAY")
                .description("Responsible for track maintenance, inspection, and renewal on NCR division.")
                .status(DepartmentStatus.ACTIVE)
                .build());

        Department trd = departmentRepository.save(Department.builder()
                .name("Traction & Rolling Distribution")
                .code("TRD")
                .description("Manages overhead equipment (OHE), traction substations, and power supply.")
                .status(DepartmentStatus.ACTIVE)
                .build());

        Department st = departmentRepository.save(Department.builder()
                .name("Signal & Telecommunication")
                .code("ST")
                .description("Maintains signalling systems, interlocking, and telecom infrastructure.")
                .status(DepartmentStatus.ACTIVE)
                .build());

        Department mech = departmentRepository.save(Department.builder()
                .name("Mechanical")
                .code("MECH")
                .description("Oversees maintenance of rolling stock, cranes, and mechanical assets.")
                .status(DepartmentStatus.ACTIVE)
                .build());

        log.info("[DataSeeder] Inserted 4 departments.");

        // ─── Maintenance Tasks ────────────────────────────────────────────────
        List<MaintenanceTask> tasks = List.of(

            // PWAY Tasks
            MaintenanceTask.builder()
                .taskId("TASK-PWAY-001")
                .department(pway)
                .assetName("Track TDL-162")
                .location("Tundla Yard, km 162+400")
                .taskType("Track Geometry Correction")
                .description("[DEMO] Rectification of slew and versine defects detected during OMS run. " +
                        "Packing and lining required at 3 locations.")
                .severity(Severity.HIGH)
                .priority(Priority.HIGH)
                .durationMinutes(240)
                .dueDate(LocalDate.now().plusDays(5))
                .status(TaskStatus.PENDING)
                .build(),

            MaintenanceTask.builder()
                .taskId("TASK-PWAY-002")
                .department(pway)
                .assetName("Track CNB-105")
                .location("Kanpur Junction, km 105+200")
                .taskType("Rail Replacement")
                .description("[DEMO] 90R rail replacement due to hogged joint. " +
                        "Three rails (total 36m) to be replaced on UP main line.")
                .severity(Severity.CRITICAL)
                .priority(Priority.URGENT)
                .durationMinutes(300)
                .dueDate(LocalDate.now().plusDays(2))
                .status(TaskStatus.SCHEDULED)
                .build(),

            MaintenanceTask.builder()
                .taskId("TASK-PWAY-003")
                .department(pway)
                .assetName("Level Crossing LC-47")
                .location("Etawah, km 219+750")
                .taskType("Renewal of Crossing Panels")
                .description("[DEMO] Worn check rails and crossing panels at manned LC-47 require renewal. " +
                        "Traffic restriction (30 kmph) currently in force.")
                .severity(Severity.MEDIUM)
                .priority(Priority.MEDIUM)
                .durationMinutes(180)
                .dueDate(LocalDate.now().plusDays(10))
                .status(TaskStatus.PENDING)
                .build(),

            // TRD Tasks
            MaintenanceTask.builder()
                .taskId("TASK-TRD-001")
                .department(trd)
                .assetName("OHE ALJN-22")
                .location("Aligarh Junction, km 122+300")
                .taskType("OHE Contact Wire Replacement")
                .description("[DEMO] Contact wire wear beyond permissible limit (7mm residual). " +
                        "Replacement of 1500m section on UP line required.")
                .severity(Severity.HIGH)
                .priority(Priority.HIGH)
                .durationMinutes(360)
                .dueDate(LocalDate.now().plusDays(7))
                .status(TaskStatus.PENDING)
                .build(),

            MaintenanceTask.builder()
                .taskId("TASK-TRD-002")
                .department(trd)
                .assetName("Traction Substation TSS-4")
                .location("Firozabad, km 203+000")
                .taskType("Transformer Preventive Maintenance")
                .description("[DEMO] Annual preventive maintenance of 25kV traction transformer. " +
                        "Insulation testing, oil sampling, and bushing inspection.")
                .severity(Severity.MEDIUM)
                .priority(Priority.MEDIUM)
                .durationMinutes(480)
                .dueDate(LocalDate.now().plusDays(15))
                .status(TaskStatus.SCHEDULED)
                .build(),

            // S&T Tasks
            MaintenanceTask.builder()
                .taskId("TASK-ST-001")
                .department(st)
                .assetName("Signal ALJN-44")
                .location("Aligarh Junction, Platform 4")
                .taskType("Signal Lamp Replacement")
                .description("[DEMO] LED cluster replacement on home signal ALJN-44. " +
                        "Signal showing degraded luminosity during last inspection.")
                .severity(Severity.HIGH)
                .priority(Priority.HIGH)
                .durationMinutes(120)
                .dueDate(LocalDate.now().plusDays(3))
                .status(TaskStatus.IN_PROGRESS)
                .build(),

            MaintenanceTask.builder()
                .taskId("TASK-ST-002")
                .department(st)
                .assetName("Point Machine PM-17")
                .location("Mathura Junction, km 130+500, Road 17")
                .taskType("Point Machine Overhaul")
                .description("[DEMO] Periodic overhaul of clamp-lock point machine. " +
                        "Current stroke time 4.2s — threshold is 4.0s.")
                .severity(Severity.MEDIUM)
                .priority(Priority.MEDIUM)
                .durationMinutes(150)
                .dueDate(LocalDate.now().plusDays(8))
                .status(TaskStatus.PENDING)
                .build(),

            MaintenanceTask.builder()
                .taskId("TASK-ST-003")
                .department(st)
                .assetName("Axle Counter AC-CNB-12")
                .location("Kanpur Central, km 100+800")
                .taskType("Axle Counter Calibration")
                .description("[DEMO] Calibration and reset of axle counter section CNB-12 " +
                        "following intermittent failure reports from loco pilots.")
                .severity(Severity.CRITICAL)
                .priority(Priority.URGENT)
                .durationMinutes(90)
                .dueDate(LocalDate.now().plusDays(1))
                .status(TaskStatus.SCHEDULED)
                .build(),

            // Mechanical Tasks
            MaintenanceTask.builder()
                .taskId("TASK-MECH-001")
                .department(mech)
                .assetName("Breakdown Crane BCR-05")
                .location("Agra Cantonment, Loco Shed")
                .taskType("Crane Annual Inspection")
                .description("[DEMO] Annual load test and inspection of 140T breakdown crane as per RDSO guidelines. " +
                        "Last test: Sep 2023.")
                .severity(Severity.LOW)
                .priority(Priority.LOW)
                .durationMinutes(600)
                .dueDate(LocalDate.now().plusDays(30))
                .status(TaskStatus.PENDING)
                .build(),

            MaintenanceTask.builder()
                .taskId("TASK-MECH-002")
                .department(mech)
                .assetName("WAP-7 Loco #30411")
                .location("Kanpur Loco Shed, Pit No. 3")
                .taskType("Scheduled IOH")
                .description("[DEMO] Intermediate Overhaul (IOH) of WAP-7 locomotive #30411. " +
                        "Current mileage: 2,25,000 km. IOH due at 2,40,000 km.")
                .severity(Severity.MEDIUM)
                .priority(Priority.MEDIUM)
                .durationMinutes(1440)
                .dueDate(LocalDate.now().plusDays(20))
                .status(TaskStatus.DEFERRED)
                .build()
        );

        taskRepository.saveAll(tasks);
        log.info("[DataSeeder] Inserted {} maintenance tasks.", tasks.size());
        log.info("[DataSeeder] DEMO data seeding complete. Ready for testing.");
    }
}
