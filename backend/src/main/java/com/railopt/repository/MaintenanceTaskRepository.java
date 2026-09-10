package com.railopt.repository;

import com.railopt.entity.MaintenanceTask;
import com.railopt.entity.Priority;
import com.railopt.entity.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaintenanceTaskRepository extends JpaRepository<MaintenanceTask, Long> {

    /** Check if a task with this taskId already exists (unique identifier) */
    boolean existsByTaskId(String taskId);

    /** Check for duplicate taskId excluding the current task (for update operations) */
    boolean existsByTaskIdAndIdNot(String taskId, Long id);

    /** Filter tasks by lifecycle status */
    List<MaintenanceTask> findByStatus(TaskStatus status);

    /** Filter tasks by scheduling priority */
    List<MaintenanceTask> findByPriority(Priority priority);

    /** All tasks belonging to a specific department */
    List<MaintenanceTask> findByDepartmentId(Long departmentId);

    /**
     * Fetch all tasks with their department in a single join.
     * Prevents N+1 when mapping department fields into the response DTO.
     */
    @Query("SELECT t FROM MaintenanceTask t JOIN FETCH t.department")
    List<MaintenanceTask> findAllWithDepartment();

    /**
     * Find tasks by status with department eagerly loaded.
     */
    @Query("SELECT t FROM MaintenanceTask t JOIN FETCH t.department WHERE t.status = :status")
    List<MaintenanceTask> findByStatusWithDepartment(@Param("status") TaskStatus status);

    /**
     * Find tasks by priority with department eagerly loaded.
     */
    @Query("SELECT t FROM MaintenanceTask t JOIN FETCH t.department WHERE t.priority = :priority")
    List<MaintenanceTask> findByPriorityWithDepartment(@Param("priority") Priority priority);

    /**
     * Find tasks by department ID with department eagerly loaded.
     */
    @Query("SELECT t FROM MaintenanceTask t JOIN FETCH t.department WHERE t.department.id = :departmentId")
    List<MaintenanceTask> findByDepartmentIdWithDepartment(@Param("departmentId") Long departmentId);
}
