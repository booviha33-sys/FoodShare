package com.example.FoodShare.service;

import com.example.FoodShare.entity.*;
import com.example.FoodShare.exception.BusinessRuleException;
import com.example.FoodShare.exception.ResourceNotFoundException;
import com.example.FoodShare.repository.DonorRepository;
import com.example.FoodShare.repository.FoodListingRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FoodListingService {

    private final FoodListingRepository foodListingRepository;
    private final DonorRepository donorRepository;

    public FoodListingService(
            FoodListingRepository foodListingRepository,
            DonorRepository donorRepository) {

        this.foodListingRepository = foodListingRepository;
        this.donorRepository = donorRepository;
    }

    public FoodListing createListing(
            FoodListing listing,
            Long donorId) {

        Donor donor = donorRepository.findById(donorId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Donor not found"));

        if (listing.getSafeToEatUntil() == null) {
            throw new BusinessRuleException(
                    "Safe-to-eat-until time is required");
        }

        if (!listing.getSafeToEatUntil()
                .isAfter(LocalDateTime.now())) {

            throw new BusinessRuleException(
                    "Safe-to-eat-until time must be in the future");
        }

        listing.setDonor(donor);
        listing.setStatus(ListingStatus.AVAILABLE);

        return foodListingRepository.save(listing);
    }

    public List<FoodListing> getAvailableListings() {

        expireListings();

        return foodListingRepository
                .findByStatus(ListingStatus.AVAILABLE);
    }

    public FoodListing getListingById(Long id) {

        FoodListing listing = foodListingRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Food listing not found"));

        if (listing.getStatus() == ListingStatus.AVAILABLE &&
                listing.getSafeToEatUntil()
                        .isBefore(LocalDateTime.now())) {

            listing.setStatus(ListingStatus.EXPIRED);
            foodListingRepository.save(listing);
        }

        return listing;
    }

    @Scheduled(fixedRate = 60000)
    public void expireListings() {

        List<FoodListing> expiredListings =
                foodListingRepository
                        .findByStatusAndSafeToEatUntilBefore(
                                ListingStatus.AVAILABLE,
                                LocalDateTime.now());

        for (FoodListing listing : expiredListings) {
            listing.setStatus(ListingStatus.EXPIRED);
        }

        foodListingRepository.saveAll(expiredListings);
    }
}