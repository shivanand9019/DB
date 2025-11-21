package com.bloodlink.backend.controller;

import com.bloodlink.backend.dtos.BloodRequestDTO;
import com.bloodlink.backend.service.BloodRequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = "http://localhost:5173")
public class BloodRequestController {
    private final BloodRequestService service;


    public BloodRequestController(BloodRequestService service, BloodRequestService bloodRequestService) {
        this.service = service;
    }

    @PostMapping("/create")
    public ResponseEntity<BloodRequestDTO> createBloodRequest(
//            @PathVariable Long hospitalId,
            @RequestBody BloodRequestDTO request
    ){
        BloodRequestDTO saved =service.createBloodRequest(request);

        return ResponseEntity.ok(saved);
    }

    @GetMapping("/hospital/{hospitalId}")
    public  ResponseEntity<List<BloodRequestDTO>>getRequestsByHospital(@PathVariable Long hospitalId){
        return ResponseEntity.ok(service.getRequestsByHospital(hospitalId));
    }

    @PutMapping("/{requestId}/status/{status}")
    public ResponseEntity<BloodRequestDTO> updateStatus(
            @PathVariable Long requestId,
            @PathVariable String status
    ){
        return ResponseEntity.ok(service.updateStatus(requestId, status));
    }
    @GetMapping("/donor/{donorId}")
    public ResponseEntity<List<BloodRequestDTO>>getRequestsByDonor(@PathVariable Long donorId){
        return ResponseEntity.ok(service.getRequestsByDonor(donorId));
    }
}

