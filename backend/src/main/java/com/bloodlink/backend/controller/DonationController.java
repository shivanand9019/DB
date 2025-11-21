package com.bloodlink.backend.controller;


import com.bloodlink.backend.dtos.DonationBookingRequest;
import com.bloodlink.backend.dtos.DonationResponse;
import com.bloodlink.backend.model.Donation;
import com.bloodlink.backend.model.RequestStatus;
import com.bloodlink.backend.service.DonationService;

import com.bloodlink.backend.dtos.DonationResponse;
import com.bloodlink.backend.model.Donation;
import com.bloodlink.backend.model.DonationRequest;
import com.bloodlink.backend.model.DonationRequestDTO;
import com.bloodlink.backend.repositories.*;
import com.bloodlink.backend.service.DonationRequestService;
import com.bloodlink.backend.service.DonationService;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


import static org.springframework.http.ResponseEntity.ok;


@RestController
@RequestMapping("/api/donations")
@CrossOrigin(origins = "http://localhost:5173")
public class DonationController {
    private final DonationService donationService;
@Autowired
    public DonationController(DonationService donationService) {
        this.donationService = donationService;
    }

    //  Book donation (Donor → Hospital)
    @PostMapping("/book")
    public ResponseEntity<DonationResponse> bookDonation(@RequestBody DonationBookingRequest req) {
        System.out.println("FRONTEND DATE = " + req.getDonationDate());
        System.out.println("FRONTEND TIME = " + req.getDonationTime());

        return ResponseEntity.ok(donationService.bookDonation(req));
    }

    // ✅ Get donations made by a donor (Donor Dashboard)
    @GetMapping("/donor/{donorId}")
    public ResponseEntity<List<Donation>> getDonationsByDonor(@PathVariable Long donorId) {
        return ResponseEntity.ok(donationService.getDonationByDonor(donorId));
    }

    // ✅ Hospital Dashboard → Donation Requests
    @GetMapping("/byHospital/{hospitalId}")
    public ResponseEntity<List<DonationResponse>> getDonationsByHospital(
            @PathVariable Long hospitalId) {
        return ResponseEntity.ok(donationService.getDonationsByHospital(hospitalId));
    }

    // ✅ Hospital Donation History (same as above)
    @GetMapping("/history/{hospitalId}")
    public ResponseEntity<List<DonationResponse>> getDonationHistory(@PathVariable Long hospitalId) {
        return ResponseEntity.ok(donationService.getDonationsByHospital(hospitalId));
    }

    // ✅ Update donation status (PENDING → APPROVED → COMPLETED)
    @PutMapping("/{donationId}/status")
    public ResponseEntity<String> updateDonationStatus(
            @PathVariable Long donationId,
            @RequestParam RequestStatus status
    ) {
        donationService.updateDonationStatus(donationId, status);
        return ResponseEntity.ok("Donation status updated to " + status);
    }
}



//package com.bloodlink.backend.controller;
//import com.bloodlink.backend.dtos.DonationBookingRequest;
//import com.bloodlink.backend.dtos.DonationResponse;
//import com.bloodlink.backend.model.Donation;
//import com.bloodlink.backend.model.DonationRequest;
//import com.bloodlink.backend.model.DonationRequestDTO;
//import com.bloodlink.backend.model.RequestStatus;
//import com.bloodlink.backend.repositories.DonationRepo;
//import com.bloodlink.backend.service.DonationRequestService;
//import com.bloodlink.backend.service.DonationService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//import static org.springframework.http.ResponseEntity.ok;
//
//@RestController
//@RequestMapping("/api/donations")
//@CrossOrigin(origins = "http://localhost:5173")
//public class DonationController {
//    @Autowired
//    private DonationService donationService;
//    private DonationRequestService requestService;
//
//
//    @PostMapping("/create")
//    ResponseEntity<DonationRequestDTO> createRequest(@RequestBody DonationRequestDTO dto) {
//        return ResponseEntity.ok(requestService.createRequest(dto));
//    }
//    @PostMapping("/{donorId}/{hospitalId}")
//    public ResponseEntity<Donation> createDonation(
//            @PathVariable Long donorId,
//            @PathVariable Long hospitalId,
//            @RequestBody Donation donation) {
//return ok(donationService.createDonation(donorId, hospitalId, donation));
//
//    }
//    @GetMapping("/donors/{donorId}")
//    public ResponseEntity<List<Donation>> getDonations(@PathVariable Long donorId) {
//        return ResponseEntity.ok( donationService.getDonationByDonor(donorId));
//    }
//    @PutMapping("/updateStatus/{id}")
//    public ResponseEntity<String> updateDonationStatus(
//            @PathVariable Long id,
//            @RequestParam RequestStatus status
//    ){
//        donationService.updateDonationStatus(id,status);
//        return ResponseEntity.ok("Donation status updated");
//    }
//
//    @GetMapping("/byHospital/{hospitalId}")
//    public ResponseEntity<List<DonationResponse>> getDonationsByHospital
//            (@PathVariable Long hospitalId) {
//        return ResponseEntity.ok(donationService.getDonationsByHospital(hospitalId));
//    }
//    @GetMapping("/history/{hospitalId}")
//    public ResponseEntity<List<DonationResponse>> getDonationHistory(@PathVariable
//                                                                     Long hospitalId){
//        return ResponseEntity.ok(donationService.getDonationsByHospital(hospitalId));
//    }
//
//    @PostMapping("/book")
//    public ResponseEntity<DonationResponse> bookDonation(@RequestBody DonationBookingRequest req) {
//        System.out.println("DATE = " + req.getDonationDate());
//        System.out.println("TIME = " + req.getDonationTime());
//        return ResponseEntity.ok(donationService.bookDonation(req));
//    }
//
//
//}
//

//    @Autowired
//    private DonationService donationService;
//    private DonationRequestService requestService;
//
//
//    @PostMapping("/create")
//    ResponseEntity<DonationRequestDTO> createRequest(@RequestBody DonationRequestDTO dto) {
//        return ResponseEntity.ok(requestService.createRequest(dto));
//    }
//    @PostMapping("/{donorId}/{hospitalId}")
//    public ResponseEntity<Donation> createDonation(
//            @PathVariable Long donorId,
//            @PathVariable Long hospitalId,
//            @RequestBody Donation donation) {
//return ok(donationService.createDonation(donorId, hospitalId, donation));
//
//    }
//    @GetMapping("/donors/{donorId}")
//    public ResponseEntity<List<Donation>> getDonations(@PathVariable Long donorId) {
//        return ResponseEntity.ok( donationService.getDonationByDonor(donorId));
//    }
//    @PutMapping("/updateStatus/{id}")
//    public ResponseEntity<String> updateDonationStatus(
//            @PathVariable Long id,
//            @RequestParam String status
//    ){
//        donationService.updateDonationStatus(id,status);
//        return ResponseEntity.ok("Donation status updated");
//    }
//
//    @GetMapping("/byHospital/{hospitalId}")
//    public ResponseEntity<List<DonationResponse>> getDonationsByHospital
//            (@PathVariable Long hospitalId) {
//        return ResponseEntity.ok(donationService.getDonationsByHospital(hospitalId));
//    }
//    @GetMapping("/history/{hospitalId}")
//    public ResponseEntity<List<DonationResponse>> getDonationHistory(@PathVariable
//                                                                     Long hospitalId){
//        return ResponseEntity.ok(donationService.getDonationsByHospital(hospitalId));
//    }
//
//    @PostMapping("/book")
//    public ResponseEntity<Donation> bookDonation(@RequestBody DonationRequest req) {
//        return ResponseEntity.ok(donationService.bookDonation(req));
//    }
//
//}
