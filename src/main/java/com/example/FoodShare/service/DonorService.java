package com.example.FoodShare.service;

import com.example.FoodShare.entity.Donor;
import com.example.FoodShare.exception.ResourceNotFoundException;
import com.example.FoodShare.repository.DonorRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DonorService {

    private final DonorRepository donorRepository;

    public DonorService(DonorRepository donorRepository) {
        this.donorRepository = donorRepository;
    }

    public Donor createDonor(Donor donor) {
        return donorRepository.save(donor);
    }

    public List<Donor> getAllDonors() {
        return donorRepository.findAll();
    }

    public Donor getDonorById(Long id) {
        return donorRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Donor not found"));
    }
}