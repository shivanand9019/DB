package com.bloodlink.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor




public class DonorResponse {
    private String message;
    private  String donorName;
    private String bloodGroup;
    private String location;

}
