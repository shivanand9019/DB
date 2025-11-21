package com.bloodlink.backend.controller;

import com.bloodlink.backend.model.Donation;
import com.bloodlink.backend.repositories.DonationRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/donations/stats")
@CrossOrigin(origins = "http://localhost:5173")
public class DonationStatsController {

    @Autowired
    private DonationRepo donationRepo;

    @GetMapping("/donors/{donorId}")
    public Map<String, Object> getDonationStats(@PathVariable Long donorId) {

        List<Donation> donations = donationRepo.findByDonorDonorId(donorId);

        long totalDonations = donations.size();

        // Blood type count
        Map<String, Long> bloodTypeCount = donations.stream()
                .collect(Collectors.groupingBy(
                        d -> d.getDonor().getBloodGroup(),
                        Collectors.counting()
                ));

        // Monthly count — using donationDate
        Map<String, Long> monthlyCount = donations.stream()
                .collect(Collectors.groupingBy(
                        d -> d.getDonationDate().getMonth().toString(),
                        Collectors.counting()
                ));

        // Recent 5 donations
        List<Map<String, Object>> recent = donations.stream()
                .sorted(
                        Comparator.comparing(Donation::getDonationDate)
                                .thenComparing(Donation::getDonationTime)
                                .reversed()
                )
                .limit(5)
                .map(d -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("date", d.getDonationDate());
                    map.put("time", d.getDonationTime());
                    map.put("location", d.getHospital().getHospitalAddress());
                    map.put("quantity", d.getBloodQuantity());
                    return map;
                })
                .toList();

        return Map.of(
                "totalDonations", totalDonations,
                "bloodTypeData", bloodTypeCount,
                "monthlyData", monthlyCount,
                "recentDonations", recent
        );
    }
}
