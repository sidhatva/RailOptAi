package com.railopt.repository;

import com.railopt.entity.Corridor;
import com.railopt.entity.CorridorStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CorridorRepository extends JpaRepository<Corridor, Long> {

    Optional<Corridor> findByCorridorId(String corridorId);

    boolean existsByCorridorId(String corridorId);

    List<Corridor> findByStatus(CorridorStatus status);

    /** Eagerly fetch tracks and stations to avoid N+1 in list views */
    @Query("SELECT DISTINCT c FROM Corridor c LEFT JOIN FETCH c.tracks LEFT JOIN FETCH c.stations")
    List<Corridor> findAllWithDetails();

    @Query("SELECT DISTINCT c FROM Corridor c LEFT JOIN FETCH c.tracks LEFT JOIN FETCH c.stations WHERE c.id = :id")
    Optional<Corridor> findByIdWithDetails(Long id);
}
