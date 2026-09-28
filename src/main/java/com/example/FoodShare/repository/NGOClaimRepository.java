package com.example.FoodShare.repository;

import com.example.FoodShare.entity.NGOClaim;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface NGOClaimRepository extends JpaRepository<NGOClaim, Long> {

    Optional<NGOClaim> findByFoodListingId(Long foodListingId);

    List<NGOClaim> findByClaimedAtBetween(
            LocalDateTime start,
            LocalDateTime end);
}