package com.bloodlink.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class HospitalResponse {
    private String message;
    private Long hospitalId;
    private String hospitalName;
    private String hospitalsAddress;


}
