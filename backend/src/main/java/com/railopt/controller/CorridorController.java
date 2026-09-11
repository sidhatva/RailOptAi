package com.railopt.controller;

import com.railopt.dto.CorridorResponse;
import com.railopt.service.CorridorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/corridors")
@RequiredArgsConstructor
public class CorridorController {

    private final CorridorService corridorService;

    @GetMapping
    public ResponseEntity<List<CorridorResponse>> getAllCorridors() {
        return ResponseEntity.ok(corridorService.getAllCorridors());
    }

    /**
     * GET /api/corridors/{id} (e.g. /api/corridors/1)
     * or GET /api/corridors/{code} (e.g. /api/corridors/NDLS-CNB)
     */
    @GetMapping("/{identifier}")
    public ResponseEntity<CorridorResponse> getCorridorByIdOrCode(@PathVariable String identifier) {
        try {
            Long id = Long.parseLong(identifier);
            return ResponseEntity.ok(corridorService.getCorridorById(id));
        } catch (NumberFormatException e) {
            return ResponseEntity.ok(corridorService.getCorridorByCode(identifier));
        }
    }

    @GetMapping("/code/{corridorId}")
    public ResponseEntity<CorridorResponse> getCorridorByCode(@PathVariable String corridorId) {
        return ResponseEntity.ok(corridorService.getCorridorByCode(corridorId));
    }
}
