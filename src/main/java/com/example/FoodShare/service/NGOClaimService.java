package com.example.FoodShare.service;

import com.example.FoodShare.entity.*;
import com.example.FoodShare.exception.BusinessRuleException;
import com.example.FoodShare.exception.ResourceNotFoundException;
import com.example.FoodShare.repository.FoodListingRepository;
import com.example.FoodShare.repository.NGOClaimRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NGOClaimService {

    private final NGOClaimRepository claimRepository;
    private final FoodListingRepository foodListingRepository;

    public NGOClaimService(
            NGOClaimRepository claimRepository,
            FoodListingRepository foodListingRepository) {

        this.claimRepository = claimRepository;
        this.foodListingRepository = foodListingRepository;
    }

    public NGOClaim claimFood(
            Long foodListingId,
            NGOClaim claim) {

        FoodListing listing = foodListingRepository
                .findById(foodListingId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Food listing not found"));

        if (listing.getSafeToEatUntil()
                .isBefore(LocalDateTime.now())) {

            listing.setStatus(ListingStatus.EXPIRED);
            foodListingRepository.save(listing);

            throw new BusinessRuleException(
                    "Food listing has expired and cannot be claimed");
        }

        if (listing.getStatus() != ListingStatus.AVAILABLE) {

            throw new BusinessRuleException(
                    "Food listing is already claimed or unavailable");
        }

        if (claimRepository
                .findByFoodListingId(foodListingId)
                .isPresent()) {

            throw new BusinessRuleException(
                    "Only one NGO can claim this food listing");
        }

        claim.setFoodListing(listing);
        claim.setClaimedAt(LocalDateTime.now());

        listing.setStatus(ListingStatus.CLAIMED);

        foodListingRepository.save(listing);

        return claimRepository.save(claim);
    }

    public List<NGOClaim> getAllClaims() {
        return claimRepository.findAll();
    }

    public NGOClaim getClaimById(Long id) {

        return claimRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Claim not found"));
    }
}