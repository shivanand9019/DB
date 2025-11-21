package com.bloodlink.backend.service;

import com.bloodlink.backend.dtos.HospitalRegistrationRequest;
import com.bloodlink.backend.dtos.HospitalResponse;
import com.bloodlink.backend.model.Hospital;

import java.util.List;

public interface HospitalService {
    HospitalResponse registerHospital(HospitalRegistrationRequest request);

    Hospital updateHospital(Long hospitalId, Hospital updatedHospital);

    Hospital getHospitalByUserId(Long userId);

    List<HospitalResponse> getAllHospitals();
    //Hospital loginHospital(String email, String password);
}
