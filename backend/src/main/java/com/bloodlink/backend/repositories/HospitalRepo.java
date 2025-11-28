package com.bloodlink.backend.repositories;

import com.bloodlink.backend.model.BloodStock;
import com.bloodlink.backend.model.Donor;
import com.bloodlink.backend.model.Hospital;
import com.bloodlink.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface HospitalRepo extends JpaRepository<Hospital,Long>{
    Optional<Hospital> findByUserUserID(Long userId);
    Optional<Hospital> findByEmail(String email);

    Optional<Hospital> findByHospitalId(Long hospitalId);
}
