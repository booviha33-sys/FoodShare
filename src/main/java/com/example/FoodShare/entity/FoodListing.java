package com.example.FoodShare.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

import java.time.LocalDateTime;

@Entity
public class FoodListing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Food type is required")
    private String foodType;

    @Positive(message = "Quantity must be greater than zero")
    private double quantity;
    private LocalDateTime updatedAt;
    private LocalDateTime safeToEatUntil;

    @Enumerated(EnumType.STRING)
    private ListingStatus status;

    @ManyToOne
    @JoinColumn(name = "donor_id")
    private Donor donor;

    public FoodListing() {
        this.status = ListingStatus.AVAILABLE;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFoodType() {
        return foodType;
    }

    public void setFoodType(String foodType) {
        this.foodType = foodType;
    }

    public double getQuantity() {
        return quantity;
    }

    public void setQuantity(double quantity) {
        this.quantity = quantity;
    }

    public LocalDateTime getSafeToEatUntil() {
        return safeToEatUntil;
    }

    public void setSafeToEatUntil(LocalDateTime safeToEatUntil) {
        this.safeToEatUntil = safeToEatUntil;
    }

    public ListingStatus getStatus() {
        return status;
    }

    public void setStatus(ListingStatus status) {
        this.status = status;
    }

    public Donor getDonor() {
        return donor;
    }

    public void setDonor(Donor donor) {
        this.donor = donor;
    }
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}