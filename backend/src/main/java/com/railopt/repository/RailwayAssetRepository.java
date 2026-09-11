package com.railopt.repository;

import com.railopt.entity.AssetStatus;
import com.railopt.entity.AssetType;
import com.railopt.entity.RailwayAsset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RailwayAssetRepository extends JpaRepository<RailwayAsset, Long> {

    Optional<RailwayAsset> findByAssetId(String assetId);

    List<RailwayAsset> findByDepartment_Code(String departmentCode);

    List<RailwayAsset> findByStatus(AssetStatus status);

    List<RailwayAsset> findByCorridor_Id(Long corridorId);

    List<RailwayAsset> findByAssetType(AssetType assetType);

    List<RailwayAsset> findByCorridor_IdAndStatus(Long corridorId, AssetStatus status);

    @Query("SELECT a FROM RailwayAsset a WHERE a.healthScore < :threshold")
    List<RailwayAsset> findByHealthScoreLessThan(int threshold);

    long countByStatus(AssetStatus status);
}
