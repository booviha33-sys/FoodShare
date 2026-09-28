package com.example.FoodShare.controller;

import com.example.FoodShare.service.StatisticsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/statistics")
public class StatisticsController {

    private final StatisticsService statisticsService;

    public StatisticsController(
            StatisticsService statisticsService) {

        this.statisticsService = statisticsService;
    }

    @GetMapping("/monthly")
    public Map<String, Object> getMonthlyStatistics(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month) {

        LocalDate now = LocalDate.now();

        if (year == null) {
            year = now.getYear();
        }

        if (month == null) {
            month = now.getMonthValue();
        }

        return statisticsService.getMonthlyStatistics(
                year,
                month);
    }
}