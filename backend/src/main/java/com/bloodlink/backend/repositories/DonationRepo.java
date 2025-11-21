package com.bloodlink.backend.repositories;

import com.bloodlink.backend.dtos.DonationResponse;
import com.bloodlink.backend.model.Donation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface DonationRepo extends JpaRepository<Donation, Long> {


    List<Donation> findByDonorDonorId(Long donorId);


    List<Donation> findByHospitalHospitalId(Long hospitalId);
}

