package com.bloodlink.backend.controller;

import com.bloodlink.backend.dtos.BloodStockDTO;

import com.bloodlink.backend.model.BloodStock;

import com.bloodlink.backend.service.BloodStockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.bloodlink.backend.dtos.BloodStockDTO;

import java.util.List;

@RestController
@RequestMapping("/api/bloodstock")
@CrossOrigin(origins = "http://localhost:5173")
public class BloodStockController {
    @Autowired
    private final BloodStockService stockService;


    public BloodStockController(BloodStockService stockService) {

        this.stockService = stockService;
    }
    @GetMapping("/{hospitalId}")
    public ResponseEntity<?> getStockByHospital(@PathVariable Long hospitalId) {
        try {
            List<BloodStock> stockList = stockService.getBloodStockByHospital(hospitalId);
            return ResponseEntity.ok(stockList);
        } catch (RuntimeException e) {
            return ResponseEntity.ok("No BloodStock Available");
        }
    }

//        public ResponseEntity<List<BloodStockDTO>> getStock(@PathVariable Long hospitalId){
//        return ResponseEntity.ok(stockService.getBloodStockByHospital(hospitalId));
//
//
    @PostMapping("/update")
    public ResponseEntity<BloodStockDTO>addOrUpdate(@RequestBody BloodStockDTO stockDTO)
        {
        return ResponseEntity.ok(stockService.addOrUpdateBloodStock(stockDTO));
    }

}
