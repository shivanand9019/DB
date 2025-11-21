package com.bloodlink.backend.service;

import com.bloodlink.backend.dtos.BloodStockDTO;

import com.bloodlink.backend.model.BloodStock;

import com.bloodlink.backend.model.Hospital;

import java.util.List;

public interface BloodStockService {

    List<BloodStock> getBloodStockByHospital(Long hospitalId);
    BloodStockDTO addOrUpdateBloodStock(BloodStockDTO stockDTO);

}
