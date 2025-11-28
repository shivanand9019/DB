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

//@Repository
//public class DonationJdbcRepo {
//
//    @Autowired
//    private JdbcTemplate jdbc;
//
//    public void createDonation(Long donor, Long hospital, LocalDate date, LocalTime time) {
//        jdbc.update("CALL create_donation(?,?,?,?)",
//                donor, hospital, date, time);
//    }
//
//    public void updateStatus(Long id, String status) {
//        jdbc.update("CALL update_donation_status(?,?)", id, status);
//    }
//
//    public List<Map<String,Object>> getByHospital(Long id) {
//        return jdbc.queryForList("CALL get_donations_by_hospital(?)", id);
//    }
//
//    public List<Map<String,Object>> getByDonor(Long id) {
//        return jdbc.queryForList("CALL get_donations_by_donor(?)", id);
//    }
//}