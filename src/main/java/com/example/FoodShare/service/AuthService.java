package com.example.FoodShare.service;

import com.example.FoodShare.dto.LoginRequest;
import com.example.FoodShare.dto.RegisterRequest;
import com.example.FoodShare.entity.AppUser;
import com.example.FoodShare.entity.UserRole;
import com.example.FoodShare.repository.AppUserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    private final AppUserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    public AuthService(AppUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Map<String, Object> register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        UserRole role;

        try {
            role = UserRole.valueOf(request.getRole().toUpperCase());
        } catch (Exception e) {
            throw new RuntimeException("Role must be DONOR or NGO");
        }

        AppUser user = new AppUser();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );
        user.setRole(role);

        userRepository.save(user);

        Map<String, Object> response = new HashMap<>();

        response.put("message", "Registration successful");
        response.put("name", user.getName());
        response.put("email", user.getEmail());
        response.put("role", user.getRole());

        return response;
    }

    public Map<String, Object> login(LoginRequest request) {

        AppUser user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new RuntimeException("Invalid email or password");
        }

        Map<String, Object> response = new HashMap<>();

        response.put("message", "Login successful");
        response.put("name", user.getName());
        response.put("email", user.getEmail());
        response.put("role", user.getRole());

        return response;
    }
}