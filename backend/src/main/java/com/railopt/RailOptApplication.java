package com.railopt;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * RailOpt AI — Spring Boot Backend Entry Point
 *
 * Future modules to be added incrementally:
 *   - Asset management
 *   - Corridor & Train scheduling
 *   - MaintenanceBlock planning
 *   - Conflict detection engine
 *   - Python AI / OR-Tools integration
 */
@SpringBootApplication
public class RailOptApplication {

    public static void main(String[] args) {
        SpringApplication.run(RailOptApplication.class, args);
    }
}
