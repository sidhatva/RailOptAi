package com.railopt.controller;

import com.railopt.dto.TrainResponse;
import com.railopt.service.TrainService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trains")
@RequiredArgsConstructor
public class TrainController {

    private final TrainService trainService;

    /**
     * GET /api/trains
     * GET /api/trains?corridorId=1
     * GET /api/trains?corridorCode=NDLS-CNB
     */
    @GetMapping
    public ResponseEntity<List<TrainResponse>> getTrains(
            @RequestParam(required = false) Long corridorId,
            @RequestParam(required = false) String corridorCode) {

        if (corridorId != null) {
            return ResponseEntity.ok(trainService.getTrainsByCorridor(corridorId));
        }
        if (corridorCode != null) {
            return ResponseEntity.ok(trainService.getTrainsByCorridorCode(corridorCode));
        }
        return ResponseEntity.ok(trainService.getAllTrains());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TrainResponse> getTrainById(@PathVariable Long id) {
        return ResponseEntity.ok(trainService.getTrainById(id));
    }
}
