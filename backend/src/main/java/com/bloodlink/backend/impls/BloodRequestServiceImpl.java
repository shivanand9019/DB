package com.bloodlink.backend.impls;

import com.bloodlink.backend.dtos.BloodRequestDTO;
import com.bloodlink.backend.model.BloodRequest;
import com.bloodlink.backend.model.Hospital;
import com.bloodlink.backend.model.RequestStatus;
import com.bloodlink.backend.repositories.BloodRequestRepo;
import com.bloodlink.backend.repositories.HospitalRepo;
import com.bloodlink.backend.service.BloodRequestService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BloodRequestServiceImpl implements BloodRequestService {
    private  final BloodRequestRepo requestRepo;
    private final HospitalRepo hospitalRepo;
    public BloodRequestServiceImpl(BloodRequestRepo requestRepo, HospitalRepo hospitalRepo) {
        this.requestRepo = requestRepo;
        this.hospitalRepo = hospitalRepo;
    }
    @Override
    public BloodRequestDTO createBloodRequest(BloodRequestDTO dto) {
       BloodRequest request = new BloodRequest();
       request.setPatientName(dto.getPatientName());
       request.getBloodGroup(dto.getBloodGroup());
       request.setUnitsRequired(dto.getUnitsRequired());
       request.setContact(dto.getContact());
       request.setDate(dto.getDate());
       request.setStatus(RequestStatus.PENDING);
       Hospital hospital = hospitalRepo.findById(dto.getHospitalId())
               .orElseThrow(()-> new RuntimeException("Hospital not found"));

        request.setHospital(hospital);

        BloodRequest saved = requestRepo.save(request);
        return convertToDTO(saved);
    }

    @Override
    public List<BloodRequestDTO> getRequestsByHospital(Long hospitalId) {
        List<BloodRequest> requests = requestRepo.findByHospitalHospitalId(hospitalId);
        return requests.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    public BloodRequestDTO updateStatus(Long requestId, String status) {
        BloodRequest request = requestRepo.findById(requestId).orElseThrow(() -> new RuntimeException("Request Not Found"));
        request.setStatus(Enum.valueOf(com.bloodlink.backend.model.RequestStatus.class, status.toUpperCase()));
        requestRepo.save(request);
        return convertToDTO(request);
    }

    @Override
    public List<BloodRequestDTO> getRequestsByDonor(Long donorId) {
        List<BloodRequest> requests = requestRepo.findByDonorDonorId(donorId);
        return requests.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    private BloodRequestDTO convertToDTO(BloodRequest req){
        BloodRequestDTO dto = new BloodRequestDTO();
        dto.setRequestId(req.getRequestId());
        dto.setPatientName(req.getDonor().getFullName());
        dto.setBloodGroup(req.getBloodGroup());
        dto.setUnitsRequired(req.getUnitsRequired());
        dto.setContact(req.getContact());
        dto.setDate(req.getDate());
        dto.setStatus(req.getStatus());
        return dto;
    }
}
