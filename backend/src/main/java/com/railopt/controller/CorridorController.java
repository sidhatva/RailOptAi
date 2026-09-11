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

    @GetMapping("/{id}")
    public ResponseEntity<CorridorResponse> getCorridorById(@PathVariable Long id) {
        return ResponseEntity.ok(corridorService.getCorridorById(id));
    }

    @GetMapping("/code/{corridorId}")
    public ResponseEntity<CorridorResponse> getCorridorByCode(@PathVariable String corridorId) {
        return ResponseEntity.ok(corridorService.getCorridorByCode(corridorId));
    }
}
