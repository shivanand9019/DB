package com.bloodlink.backend.service;

import com.bloodlink.backend.dtos.DonorRegistrationRequest;
import com.bloodlink.backend.dtos.DonorResponse;
import com.bloodlink.backend.model.Donor;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface DonorService {
    DonorResponse registerDonor(DonorRegistrationRequest request);
    Donor getDonorByUserId(Long userId);
    Donor updateDonor(Long donorId, Donor updatedDonor);
    Donor toggleAvailability(Long donorId);
    List<DonorResponse> getAvailableDonors(String bloodGroup, String city);
    Donor uploadProfilePic(Long donorId, MultipartFile file) throws IOException;

    Donor getDonorByDonorId(Long donorId);
}
