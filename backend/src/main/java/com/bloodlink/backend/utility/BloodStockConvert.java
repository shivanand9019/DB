package com.bloodlink.backend.utility;

import com.bloodlink.backend.dtos.BloodStockDTO;
import com.bloodlink.backend.model.BloodStock;
import com.bloodlink.backend.model.Hospital;

public class BloodStockConvert {
    //DTO to entity
    public static BloodStock toEntity(BloodStockDTO dto, Hospital hospital) {
        BloodStock stock = new BloodStock();
        stock.setId(dto.getId());
        stock.setHospital(hospital);
        stock.setBloodGroup(dto.getBloodGroup());
        stock.setUnitsAvailable(dto.getUnitsAvailable());
        stock.setLastUpdated(dto.getLastUpdated());
        return stock;
    }


    // entity to  DTO

    public static BloodStockDTO toDTO(BloodStock stock) {
        BloodStockDTO stockDTO = new BloodStockDTO();
        stockDTO.setId(stock.getId());
        stockDTO.setHospitalId(stock.getHospital().getHospitalId());
        stockDTO.setHospitalName(stock.getHospital().getHospitalName());
        stockDTO.setBloodGroup(stock.getBloodGroup());
        stockDTO.setUnitsAvailable(stock.getUnitsAvailable());
        stockDTO.setLastUpdated(stock.getLastUpdated());
        return stockDTO;
    }
}
