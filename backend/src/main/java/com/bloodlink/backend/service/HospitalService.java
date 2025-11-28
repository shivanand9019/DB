package com.bloodlink.backend.service;

import com.bloodlink.backend.dtos.HospitalRegistrationRequest;
import com.bloodlink.backend.dtos.HospitalResponse;
import com.bloodlink.backend.model.Donor;
import com.bloodlink.backend.model.Hospital;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface HospitalService {
    HospitalResponse registerHospital(HospitalRegistrationRequest request);

    Hospital updateHospital(Long hospitalId, Hospital updatedHospital);

    Hospital getHospitalByUserId(Long userId);

    List<HospitalResponse> getAllHospitals();
    Hospital uploadProfilePic(Long hospitakId, MultipartFile file) throws IOException;
    //Hospital loginHospital(String email, String password);
}
