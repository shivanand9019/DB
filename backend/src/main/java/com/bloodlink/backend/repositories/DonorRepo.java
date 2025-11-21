package com.bloodlink.backend.repositories;

import com.bloodlink.backend.model.Donor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface DonorRepo extends JpaRepository<Donor,Long> {

    Optional<Donor> findByUserUserID(Long userId);
    List<Donor> findByAvailableTrue();
    List<Donor> findByCityAndAvailableTrue(String city);
    List<Donor> findByBloodGroupAndAvailableTrue(String bloodGroup);
    List<Donor> findByBloodGroupAndCityAndAvailableTrue(String bloodGroup, String city);



    Optional<Donor> findByDonorId(Long donorId);
    Optional<Donor> getDonorByDonorId(Long donorId);


}


