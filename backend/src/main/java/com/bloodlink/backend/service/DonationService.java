package com.bloodlink.backend.service;


import com.bloodlink.backend.dtos.DonationBookingRequest;

import com.bloodlink.backend.dtos.DonationResponse;
import com.bloodlink.backend.dtos.DonorResponse;
import com.bloodlink.backend.model.Donation;
import com.bloodlink.backend.model.DonationRequest;

import com.bloodlink.backend.model.RequestStatus;


import java.util.List;


public interface DonationService {
    // Returns all donations made by a particular donor

    List<Donation> getDonationByDonor(Long donorId);

    Donation createDonation(Long donorId, Long hospitalId, Donation donation);

    void updateDonationStatus(Long donationId, RequestStatus status);

    DonationResponse bookDonation(DonationBookingRequest req);

    void updateDonationStatus(Long donationId,String status);
    List<DonationResponse> getDonationsByHospital(Long hospitalId);

    Donation bookDonation(DonationRequest req);
}
