package com.bloodlink.backend.controller;

import com.bloodlink.backend.dtos.HospitalRegistrationRequest;
import com.bloodlink.backend.dtos.HospitalResponse;
import com.bloodlink.backend.model.Donor;
import com.bloodlink.backend.model.Hospital;
import com.bloodlink.backend.repositories.HospitalRepo;
import com.bloodlink.backend.service.HospitalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/hospitals")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class HospitalController {
    private final HospitalService hospitalService;
    private final HospitalRepo hospitalRepo;

    @PostMapping("/register")
    public ResponseEntity<HospitalResponse> registerHospital(@RequestBody HospitalRegistrationRequest request) {
        HospitalResponse hospitalResponse = hospitalService.registerHospital(request);
        return ResponseEntity.ok(hospitalResponse);
    }

    @GetMapping("/profile/{userId}")
    public ResponseEntity<?> getHospitalProfile(@PathVariable("userId") Long userId) {
        try {
            Hospital hospital = hospitalService.getHospitalByUserId(userId);
            return ResponseEntity.ok(hospital);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @PutMapping("/update/{hospitalId}")
    public ResponseEntity<Hospital> updateHospital(@PathVariable Long hospitalId, @RequestBody Hospital updatedHospital) {
        Hospital hospital = hospitalService.updateHospital(hospitalId, updatedHospital);

        return ResponseEntity.ok(hospital);
    }


    @GetMapping("/all")
    ResponseEntity<List<HospitalResponse>> getAllHospitals() {
        return ResponseEntity.ok(hospitalService.getAllHospitals());
    }
    @PostMapping("/upload-photo/{hospitalId}")
    public ResponseEntity<Hospital> uploadPhoto(
            @PathVariable Long hospitalId,
            @RequestParam("file") MultipartFile file) throws IOException {
        Hospital hospital = hospitalService.uploadProfilePic(hospitalId, file);
        return ResponseEntity.ok(hospital);
    }


}

