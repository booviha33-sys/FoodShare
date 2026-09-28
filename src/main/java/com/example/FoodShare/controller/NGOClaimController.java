package com.example.FoodShare.controller;

import com.example.FoodShare.entity.NGOClaim;
import com.example.FoodShare.service.NGOClaimService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/claims")
public class NGOClaimController {

    private final NGOClaimService claimService;

    public NGOClaimController(
            NGOClaimService claimService) {

        this.claimService = claimService;
    }

    @PostMapping("/food/{foodListingId}")
    public NGOClaim claimFood(
            @PathVariable Long foodListingId,
            @Valid @RequestBody NGOClaim claim) {

        return claimService.claimFood(
                foodListingId,
                claim);
    }

    @GetMapping
    public List<NGOClaim> getAllClaims() {
        return claimService.getAllClaims();
    }

    @GetMapping("/{id}")
    public NGOClaim getClaimById(
            @PathVariable Long id) {

        return claimService.getClaimById(id);
    }
}