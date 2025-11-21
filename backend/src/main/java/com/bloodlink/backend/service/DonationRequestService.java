package com.bloodlink.backend.service;

import com.bloodlink.backend.model.DonationRequestDTO;

import java.util.List;

public interface DonationRequestService {

    DonationRequestDTO createRequest(DonationRequestDTO dto);
    List<DonationRequestDTO> findByHospital(Long hospitalId);

    List <DonationRequestDTO> findByDonor(Long  donorId);

    DonationRequestDTO updateStatus(Long requestId, String status);
}
