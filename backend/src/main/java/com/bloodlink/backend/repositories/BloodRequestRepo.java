package com.bloodlink.backend.repositories;

import com.bloodlink.backend.model.BloodRequest;
import com.bloodlink.backend.model.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BloodRequestRepo extends JpaRepository<BloodRequest, Long> {
    List<BloodRequest> findByHospital(Hospital hospital);
    List<BloodRequest> findByHospitalHospitalId(Long hospitalId);


    List<BloodRequest> findByDonorDonorId(Long donorId);
}
