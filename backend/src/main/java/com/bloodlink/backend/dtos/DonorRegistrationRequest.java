package com.bloodlink.backend.dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.Column;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Data
public class DonorRegistrationRequest {
    private  Long userId;
    private String fullName;
    private int age;
    private  String gender;
    private String bloodGroup;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate lastDonationDate;
    @Column(name="donor_email")
    private String email;
    private String phoneNumber;
    private String city;


}
