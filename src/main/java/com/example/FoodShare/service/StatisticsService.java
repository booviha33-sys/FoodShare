package com.example.FoodShare.service;

import com.example.FoodShare.entity.NGOClaim;
import com.example.FoodShare.repository.NGOClaimRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class StatisticsService {

    private final NGOClaimRepository claimRepository;

    public StatisticsService(NGOClaimRepository claimRepository) {
        this.claimRepository = claimRepository;
    }

    public Map<String, Object> getMonthlyStatistics(
            int year,
            int month) {

        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.plusMonths(1);

        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = endDate.atStartOfDay();

        List<NGOClaim> claims =
                claimRepository.findByClaimedAtBetween(
                        start,
                        end);

        double totalFoodDiverted = claims.stream()
                .mapToDouble(claim ->
                        claim.getFoodListing().getQuantity())
                .sum();

        Map<String, Object> response = new HashMap<>();

        response.put("year", year);
        response.put("month", month);
        response.put("totalFoodDivertedKg",
                totalFoodDiverted);
        response.put("numberOfClaims", claims.size());

        return response;
    }
}