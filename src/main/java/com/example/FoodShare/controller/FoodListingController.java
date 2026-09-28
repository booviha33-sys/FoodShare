package com.example.FoodShare.controller;

import com.example.FoodShare.entity.FoodListing;
import com.example.FoodShare.service.FoodListingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/food-listings")
public class FoodListingController {

    private final FoodListingService foodListingService;

    public FoodListingController(
            FoodListingService foodListingService) {

        this.foodListingService = foodListingService;
    }

    @PostMapping("/donor/{donorId}")
    @ResponseStatus(HttpStatus.CREATED)
    public FoodListing createListing(
            @PathVariable Long donorId,
            @Valid @RequestBody FoodListing listing) {

        return foodListingService.createListing(
                listing,
                donorId);
    }

    @GetMapping
    public List<FoodListing> getAvailableListings() {
        return foodListingService.getAvailableListings();
    }

    @GetMapping("/{id}")
    public FoodListing getListingById(
            @PathVariable Long id) {

        return foodListingService.getListingById(id);
    }
}