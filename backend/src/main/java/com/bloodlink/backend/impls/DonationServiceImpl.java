package com.bloodlink.backend.impls;

import com.bloodlink.backend.dtos.DonationBookingRequest;
import com.bloodlink.backend.dtos.DonationResponse;
import com.bloodlink.backend.model.*;
import com.bloodlink.backend.repositories.BloodStockRepo;
import com.bloodlink.backend.repositories.DonationRepo;
import com.bloodlink.backend.repositories.DonorRepo;
import com.bloodlink.backend.repositories.HospitalRepo;
import com.bloodlink.backend.service.DonationService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DonationServiceImpl implements DonationService {

    private final DonationRepo donationRepo;
    private final DonorRepo donorRepo;
    private final HospitalRepo hospitalRepo;
    private final BloodStockRepo stockRepo;

    public DonationServiceImpl(DonationRepo donationRepo, DonorRepo donorRepo, HospitalRepo hospitalRepo, BloodStockRepo stockRepo) {
        this.donationRepo = donationRepo;
        this.donorRepo = donorRepo;
        this.hospitalRepo = hospitalRepo;

        this.stockRepo = stockRepo;
    }

    @Override
    public List<Donation> getDonationByDonor(Long donorId) {
        return donationRepo.findByDonorDonorId(donorId);
    }

    @Override
    public Donation createDonation(Long donorId, Long hospitalId, Donation donation) {
    Donor donor = donorRepo.findById(donorId).orElseThrow(()-> new RuntimeException("donor not found"));

        Hospital hospital = hospitalRepo.findById(hospitalId).orElseThrow(()-> new RuntimeException("hospital not found"));
        donation.setDonor(donor);
        donation.setHospital(hospital);
        donation.setStatus(RequestStatus.COMPLETED);

        return donationRepo.save(donation);

    }

    @Override
    public void updateDonationStatus(Long donationId, RequestStatus status) {
        Donation donation = donationRepo.findById(donationId)
                .orElseThrow(() -> new RuntimeException("Donation not found"));

        donation.setStatus(status);
        donationRepo.save(donation);

        // If completed update blood stock
        if (status == RequestStatus.COMPLETED) {
            Hospital hospital = donation.getHospital();
            String bloodGroup = donation.getBloodGroup();
            Double units = donation.getBloodQuantity();

            BloodStock stock = stockRepo.findByHospitalAndBloodGroup(hospital, bloodGroup);

            if (stock == null) {
                stock = new BloodStock();
                stock.setHospital(hospital);
                stock.setBloodGroup(bloodGroup);
                stock.setUnitsAvailable(units);
            } else {
                stock.setUnitsAvailable(stock.getUnitsAvailable() + units);
            }

            stockRepo.save(stock);
        }
    }

//    @Service
//    public class DonationService {
//
//        @Autowired
//        DonationJdbcRepo repo;
//
//        public void bookDonation(DonationBookingRequest req) {
//            repo.createDonation(
//                    req.getDonorId(),
//                    req.getHospitalId(),
//                    req.getDonationDate(),
//                    req.getDonationTime()
//            );
//        }
//
//        public List<Map<String,Object>> getHospitalDonations(Long hospitalId) {
//            return repo.getByHospital(hospitalId);
//        }
//
//        public void updateStatus(Long donationId, String status) {
//            repo.updateStatus(donationId, status);
//        }
//    }
//

    public List<DonationResponse> getDonationsByHospital(Long hospitalId) {
        return donationRepo.findByHospitalHospitalId(hospitalId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public DonationResponse bookDonation(DonationBookingRequest req) {

        Donor donor = donorRepo.findById(req.getDonorId())
                .orElseThrow(() -> new RuntimeException("Donor not found"));

        Hospital hospital = hospitalRepo.findById(req.getHospitalId())
                .orElseThrow(() -> new RuntimeException("Hospital not found"));

        Donation donation = new Donation();
        donation.setDonor(donor);
        donation.setHospital(hospital);
        donation.setDonationDate(req.getDonationDate());
        donation.setDonationTime(req.getDonationTime());
        donation.setBloodGroup(donor.getBloodGroup());
        donation.setBloodQuantity(1.0);
        donation.setStatus(RequestStatus.PENDING);

        Donation saved = donationRepo.save(donation);

        return mapToResponse(saved);
    }


    private DonationResponse mapToResponse(Donation donation){
        DonationResponse response = new DonationResponse();
        response.setDonorName(donation.getDonor().getFullName());

        response.setDonationId(donation.getDonationId());
        response.setBloodQuantity(donation.getBloodQuantity());
        response.setBloodGroup(donation.getBloodGroup());
        response.setDonationDate(donation.getDonationDate());
        response.setDonationTime(donation.getDonationTime());
        response.setStatus(donation.getStatus());

        return response;
    }

    private Donation mapToEntity(DonationResponse response){
        Donation donation = new Donation();

        donation.setDonationId(response.getDonationId());
        donation.setBloodGroup(response.getBloodGroup());
        donation.setBloodQuantity(response.getBloodQuantity());
        donation.setDonationDate(response.getDonationDate());
        donation.setDonationTime(response.getDonationTime());
        donation.setStatus(response.getStatus());
        return donation;
    }
}
