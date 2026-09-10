package com.railopt.repository;

import com.railopt.entity.Department;
import com.railopt.entity.DepartmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {

    /** Check if a department with this code already exists (for uniqueness validation) */
    boolean existsByCode(String code);

    /** Check for duplicate code excluding the current department (for update operations) */
    boolean existsByCodeAndIdNot(String code, Long id);

    /** Find a department by its short code (e.g., "PWAY") */
    Optional<Department> findByCode(String code);

    /** Filter departments by operational status */
    List<Department> findByStatus(DepartmentStatus status);

    /**
     * Fetch departments with their task lists eagerly to avoid N+1 queries
     * when rendering taskCount in the response.
     */
    @Query("SELECT DISTINCT d FROM Department d LEFT JOIN FETCH d.maintenanceTasks")
    List<Department> findAllWithTasks();
}
