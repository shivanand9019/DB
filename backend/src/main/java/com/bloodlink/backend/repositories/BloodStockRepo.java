package com.bloodlink.backend.repositories;


import com.bloodlink.backend.model.BloodStock;
import com.bloodlink.backend.model.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BloodStockRepo extends JpaRepository<BloodStock, Long> {

    List<BloodStock> findByHospital(Hospital hospital);
    BloodStock findByHospitalAndBloodGroup(Hospital hospital, String bloodGroup);

}
