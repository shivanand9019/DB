package com.bloodlink.backend.controller;

import com.bloodlink.backend.dtos.DonorRegistrationRequest;
import com.bloodlink.backend.dtos.DonorResponse;
import com.bloodlink.backend.model.Donor;

import com.bloodlink.backend.repositories.DonorRepo;

import com.bloodlink.backend.service.DonorService;
import jdk.jfr.Frequency;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List;

@RestController
@RequestMapping("/api/donors")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class DonorController {
    private final DonorService donorService;

    private final DonorRepo donorRepo;


    @PostMapping("/register")
    public ResponseEntity<DonorResponse> registerDonor(@RequestBody DonorRegistrationRequest request){
        DonorResponse response = donorService.registerDonor(request);
        return ResponseEntity.ok(response);

    }

    @GetMapping("/profile/{userId}")
    public ResponseEntity<Donor> getDonorProfile(@PathVariable("userId") Long userId){
        Donor donor = donorService.getDonorByUserId(userId);
        if (donor.getProfilePic() != null) {
            donor.setProfilePic(Base64.getEncoder().encode(donor.getProfilePic()));
        }
        return ResponseEntity.ok(donor);
    }
    @PutMapping("/update/{donorId}")
    public ResponseEntity<Donor> updateDonor(@PathVariable Long donorId,@RequestBody Donor updatedDonor){
        Donor donor = donorService.updateDonor(donorId,updatedDonor);

        return ResponseEntity.ok(donor);
    }
    @GetMapping("/available")



    public ResponseEntity<List<DonorResponse>> getAvailableDonors(
            @RequestParam(required = false) String bloodGroup,@RequestParam(required = false) String city){
        List<DonorResponse> donors = donorService.getAvailableDonors(bloodGroup,city);
        return ResponseEntity.ok(donors);
    }

    @GetMapping("/all")
    public List<Donor> getAvailableDonors() {
        return donorRepo.findByAvailableTrue();
    }
        @PatchMapping("/{donorId}/toggle-availability")

    @PutMapping("/{donorId}/toggle-availability")
    public ResponseEntity<Donor> toggleDonorAvailability(@PathVariable Long id) {
        Donor updatedDonor = donorService.toggleAvailability(id);
        return ResponseEntity.ok(updatedDonor);
    }


    @PutMapping("/{id}/toggle-availability")
    public ResponseEntity<Donor> toggleAvailability(@PathVariable Long id) {
        Donor donor = donorService.toggleAvailability(id);
        return ResponseEntity.ok(donor);
    }

    // Upload photo
    @PostMapping("/upload-photo/{donorId}")
    public ResponseEntity<Donor> uploadPhoto(
            @PathVariable Long donorId,
            @RequestParam("file") MultipartFile file) throws IOException {
        Donor donor = donorService.uploadProfilePic(donorId, file);
        return ResponseEntity.ok(donor);
    }

    // Return Base64 image
    @GetMapping("/{donorId}/photo")
    public ResponseEntity<String> getPhoto(@PathVariable Long donorId) {
        Donor donor = donorService.getDonorByDonorId(donorId);
        if (donor.getProfilePic() != null) {
            String base64Image = Base64.getEncoder().encodeToString(donor.getProfilePic());
            return ResponseEntity.ok("data:image/jpeg;base64," + base64Image);
        } else {
            return ResponseEntity.ok(null);
        }
    }



}
    
