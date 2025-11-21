package com.bloodlink.backend.dtos;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class DonationBookingRequest {
    private Long donorId;
    private Long hospitalId;
    private LocalDate donationDate;
    private LocalTime donationTime;
}
