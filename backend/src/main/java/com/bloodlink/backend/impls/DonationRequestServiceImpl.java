package com.bloodlink.backend.impls;

import com.bloodlink.backend.model.DonationRequest;
import com.bloodlink.backend.model.DonationRequestDTO;
import com.bloodlink.backend.model.Donor;
import com.bloodlink.backend.model.Hospital;
import com.bloodlink.backend.repositories.DonationRequestRepo;
import com.bloodlink.backend.repositories.DonorRepo;
import com.bloodlink.backend.repositories.HospitalRepo;
import com.bloodlink.backend.service.DonationRequestService;

import java.util.List;

public class DonationRequestServiceImpl implements DonationRequestService {
    private final DonationRequestRepo requestRepo;
    private final DonorRepo donorRepo;
    private  final HospitalRepo hospitalRepo;

    public DonationRequestServiceImpl(DonationRequestRepo requestRepo, DonorRepo donorRepo, HospitalRepo hospitalRepo) {
        this.requestRepo = requestRepo;
        this.donorRepo = donorRepo;
        this.hospitalRepo = hospitalRepo;
    }

    @Override
    public DonationRequestDTO createRequest(DonationRequestDTO dto) {
        Donor donor = donorRepo.findById(dto.getDonorId()).orElseThrow(()-> new RuntimeException("Donor not found"));
        Hospital hospital = hospitalRepo.findById(dto.getHospitalId()).orElseThrow(()-> new RuntimeException("Hospital not found"));

        DonationRequest request = DonationRequest.builder()
                .donor(donor)
                .hospital(hospital)
                .bloodGroup(dto.getBloodGroup())
                .dateTime(dto.getDateAndTime())
                .status("PENDING")
                .build();

        requestRepo.save(request);
        dto.setId(request.getId());
        dto.setStatus("PENDING");
        return dto;
    }

    @Override
    public List<DonationRequestDTO> findByHospital(Long hospitalId) {
        return requestRepo.findByHospitalHospitalId(hospitalId)
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    @Override
    public List<DonationRequestDTO> findByDonor(Long donorId) {
        return requestRepo.findByDonorDonorId(donorId)
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    @Override
    public DonationRequestDTO updateStatus(Long requestId, String status) {
    DonationRequest request = requestRepo.findById(requestId).orElseThrow(()-> new RuntimeException("Donation not found"));
    request.setStatus(status);
    requestRepo.save(request);
    return convertToDTO(request);
    }

    private DonationRequestDTO convertToDTO(DonationRequest request) {
        return
                DonationRequestDTO.builder()
                        .id(request.getId())
                        .donorId(request.getDonor().getDonorId())
                        .hospitalId(request.getHospital().getHospitalId())
                        .donorName(request.getDonor().getFullName())
                        .hospitalName(request.getHospital().getHospitalName())
                        .bloodGroup(request.getBloodGroup())
                        .dateAndTime(request.getDateTime())
                        .status(request.getStatus())
                        .build();
    }
}
