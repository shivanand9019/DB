package com.bloodlink.backend.impls;

import com.bloodlink.backend.dtos.HospitalRegistrationRequest;
import com.bloodlink.backend.dtos.HospitalResponse;
import com.bloodlink.backend.model.Donor;
import com.bloodlink.backend.model.Hospital;
import com.bloodlink.backend.model.User;
import com.bloodlink.backend.repositories.HospitalRepo;
import com.bloodlink.backend.repositories.UserRepo;
import com.bloodlink.backend.service.HospitalService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HospitalServiceImpl implements HospitalService {
    private final HospitalRepo hospitalRepo;
    private final UserRepo userRepo;

    @Override
    public HospitalResponse registerHospital(HospitalRegistrationRequest request) {
        User user = userRepo.findById(request.getUserId()).orElseThrow(()-> new RuntimeException("User not found with ID:"+request.getUserId()));
        Hospital hospital = new Hospital();
        hospital.setHospitalName(request.getHospitalName());
        hospital.setEmail(request.getEmail());
        hospital.setHospitalAddress(request.getHospitalAddress());

        hospital.setHospitalContactNumber(request.getHospitalContactNumber());
        hospital.setUser(user);

        hospitalRepo.save(hospital);
        return new HospitalResponse(
                "Hospital registered successfully.",hospital.getHospitalId(),hospital.getHospitalName(), hospital.getHospitalAddress()
        );
    }

    @Override
    public Hospital updateHospital(Long hospitalId, Hospital updatedHospital) {
        Hospital hospital = hospitalRepo.findById(hospitalId).orElseThrow(() ->
                new RuntimeException("Hospital not found with ID:"+ hospitalId));
        hospital.setHospitalContactNumber(updatedHospital.getHospitalContactNumber());
        hospital.setHospitalAddress(updatedHospital.getHospitalAddress());
        return hospitalRepo.save(hospital);
    }

    @Override
    public Hospital getHospitalByUserId(Long userId) {
        return hospitalRepo.findByUserUserID(userId).orElseThrow(() ->
                new RuntimeException("Hospital not found with ID:"+userId));
    }

    @Override
    public List<HospitalResponse> getAllHospitals() {
        return hospitalRepo.findAll()
                .stream()
                .map(h -> new HospitalResponse(null,h.getHospitalId(),h.getHospitalName(),h.getHospitalAddress()
                )).toList();
    }
    @Override
    public Hospital uploadProfilePic(Long hospitalId, MultipartFile file) throws IOException {
        Hospital hospital = hospitalRepo.findByHospitalId(hospitalId)
                .orElseThrow(() -> new RuntimeException("Hospital not found"));
        hospital.setProfilePic(file.getBytes());
        return hospitalRepo.save(hospital);
    }

}
