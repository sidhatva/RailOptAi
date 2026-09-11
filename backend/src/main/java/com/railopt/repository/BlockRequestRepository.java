package com.railopt.repository;

import com.railopt.entity.BlockRequest;
import com.railopt.entity.BlockRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BlockRequestRepository extends JpaRepository<BlockRequest, Long> {

    List<BlockRequest> findByCorridor_Id(Long corridorId);

    List<BlockRequest> findByDepartment_Code(String departmentCode);

    List<BlockRequest> findByStatus(BlockRequestStatus status);

    boolean existsByBlockId(String blockId);

    long countByStatus(BlockRequestStatus status);
}
