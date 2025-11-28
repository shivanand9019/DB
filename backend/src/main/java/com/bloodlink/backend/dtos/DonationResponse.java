package com.bloodlink.backend.dtos;
import com.bloodlink.backend.model.RequestStatus;
import com.bloodlink.backend.model.Status;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Getter
@Setter

public class DonationResponse {

    private String donorName;
    private Long donationId;
    private Double bloodQuantity;
    private String bloodGroup;
    private LocalDate donationDate;
    private LocalTime donationTime;
    private RequestStatus status;



}
