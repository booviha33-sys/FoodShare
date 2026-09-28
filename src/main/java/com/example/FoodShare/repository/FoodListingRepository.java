package com.example.FoodShare.repository;

import com.example.FoodShare.entity.FoodListing;
import com.example.FoodShare.entity.ListingStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface FoodListingRepository extends JpaRepository<FoodListing, Long> {

    List<FoodListing> findByStatus(ListingStatus status);

    List<FoodListing> findByStatusAndSafeToEatUntilBefore(
            ListingStatus status,
            LocalDateTime time);
}