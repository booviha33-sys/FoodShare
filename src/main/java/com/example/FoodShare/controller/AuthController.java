package com.example.FoodShare.controller;

import com.example.FoodShare.dto.LoginRequest;
import com.example.FoodShare.dto.RegisterRequest;
import com.example.FoodShare.service.AuthService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public Map<String, Object> register(
            @RequestBody RegisterRequest request) {

        return authService.register(request);
    }

    @PostMapping("/login")
    public Map<String, Object> login(
            @RequestBody LoginRequest request) {

        return authService.login(request);
    }
}