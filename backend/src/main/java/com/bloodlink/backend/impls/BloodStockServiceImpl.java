package com.bloodlink.backend.impls;

import com.bloodlink.backend.dtos.BloodStockDTO;
import com.bloodlink.backend.model.BloodStock;
import com.bloodlink.backend.model.Hospital;
import com.bloodlink.backend.repositories.BloodRequestRepo;
import com.bloodlink.backend.repositories.BloodStockRepo;
import com.bloodlink.backend.repositories.HospitalRepo;
import com.bloodlink.backend.service.BloodStockService;
import com.bloodlink.backend.utility.BloodStockConvert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BloodStockServiceImpl implements BloodStockService {
    @Autowired
    private BloodStockRepo stockRepo;
    @Autowired
    HospitalRepo hospitalRepo;

    @Override
    public List<BloodStock> getBloodStockByHospital(Long hospitalId) {
        Hospital hospital = hospitalRepo.findById(hospitalId).orElseThrow(() -> new RuntimeException("Hospital not found"));
        List<BloodStock> stockList = stockRepo.findByHospital(hospital);
        if (stockList.isEmpty()) {
            throw new RuntimeException("No Available Blood Stock found");
        }
        return stockList;
    }
    @Override
    public BloodStockDTO addOrUpdateBloodStock(BloodStockDTO stockDTO) {
        Hospital hospital = hospitalRepo.findById(stockDTO.getHospitalId()).orElseThrow(() ->new  RuntimeException("Hospital not found"));
    BloodStock existing = stockRepo.findByHospitalAndBloodGroup(hospital, stockDTO.getBloodGroup());

    if(existing != null) {
        existing.setUnitsAvailable(stockDTO.getUnitsAvailable());
        stockRepo.save(existing);
        return BloodStockConvert.toDTO(existing);
    }else {
        BloodStock newBloodStock = BloodStockConvert.toEntity(stockDTO,hospital);
        stockRepo.save(newBloodStock);
        return BloodStockConvert.toDTO(newBloodStock);
    }

    }




}
