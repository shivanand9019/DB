package com.bloodlink.backend.dtos;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class HospitalRegistrationRequest {
    private Long userId;
    private String hospitalName;
    private String hospitalAddress;
    private String email;
    private  String password;
    private String hospitalContactNumber;
}
