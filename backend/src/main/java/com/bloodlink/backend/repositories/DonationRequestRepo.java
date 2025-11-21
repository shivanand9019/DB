package com.bloodlink.backend.repositories;

import com.bloodlink.backend.model.DonationRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DonationRequestRepo extends JpaRepository<DonationRequest, Long> {
    List<DonationRequest> findByDonorDonorId(Long donorId);

    List <DonationRequest> findByHospitalHospitalId(Long hospitalId);


}
