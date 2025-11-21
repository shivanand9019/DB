package com.bloodlink.backend.impls;

import com.bloodlink.backend.dtos.DonorRegistrationRequest;
import com.bloodlink.backend.dtos.DonorResponse;
import com.bloodlink.backend.model.Donor;
import com.bloodlink.backend.model.User;
import com.bloodlink.backend.repositories.DonorRepo;
import com.bloodlink.backend.repositories.UserRepo;
import com.bloodlink.backend.service.DonorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DonorServiceImpl implements DonorService {
    private final DonorRepo donorRepo;
    private final UserRepo userRepo;

    @Override
    public DonorResponse registerDonor(DonorRegistrationRequest request) {
        //check if user exists
        User user = userRepo.findById(request.getUserId()).orElseThrow(()-> new RuntimeException("User not found with ID:"+request.getUserId()));
        //create donor object
        Donor donor = new Donor();
        donor.setFullName(request.getFullName());
        donor.setEmail(request.getEmail());
        donor.setBloodGroup(request.getBloodGroup());
        donor.setGender(request.getGender());
        donor.setPhoneNumber(request.getPhoneNumber());
        donor.setCity(request.getCity());
        donor.setAge(request.getAge());
        donor.setLastDonationDate(request.getLastDonationDate());
        donor.setUser(user);

        //save to db
        donorRepo.save(donor);
        //return the safe response
        return new DonorResponse(
                "Donor registered successfully",donor.getFullName(),donor.getBloodGroup(),donor.getCity()
        );
    }

    @Override
    public Donor getDonorByUserId(Long userId) {
        return donorRepo.findByUserUserID(userId).orElseThrow(() -> new RuntimeException("Donor not found with ID:"+userId));
    }

    @Override
    public Donor updateDonor(Long donorId, Donor updatedDonor) {
        Donor donor = donorRepo.findById(donorId).orElseThrow(() ->
                new RuntimeException("Donor not found with ID:"+donorId));
        donor.setPhoneNumber(updatedDonor.getPhoneNumber());
        donor.setCity(updatedDonor.getCity());
        return donorRepo.save(donor);

    }

    public Donor toggleAvailability(Long donorId) {
        Donor donor = donorRepo.findById(donorId)
                .orElseThrow(() -> new RuntimeException("Donor not found"));
        donor.setAvailable(!donor.isAvailable());
        return donorRepo.save(donor);
    }



    // 🔹 Upload donor profile picture
    @Override
    public Donor uploadProfilePic(Long donorId, MultipartFile file) throws IOException {
        Donor donor = donorRepo.findByDonorId(donorId)
                .orElseThrow(() -> new RuntimeException("Donor not found"));
        donor.setProfilePic(file.getBytes());
        return donorRepo.save(donor);
    }

@Override
    public Donor getDonorByDonorId(Long donorId) {
        return  donorRepo.getDonorByDonorId(donorId).orElseThrow(() -> new RuntimeException("Donor not found with ID:"+donorId));

    }

    @Override
    public List<DonorResponse> getAvailableDonors(String bloodGroup, String city) {
        return List.of();
    }
}
