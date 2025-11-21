package com.bloodlink.backend.service;

import com.bloodlink.backend.dtos.BloodRequestDTO;


import java.util.List;


public interface BloodRequestService {
BloodRequestDTO createBloodRequest( BloodRequestDTO bloodRequest);

List<BloodRequestDTO> getRequestsByHospital(Long hospitalId);
BloodRequestDTO updateStatus(Long requestId, String status);

    List<BloodRequestDTO> getRequestsByDonor(Long donorId);
}
