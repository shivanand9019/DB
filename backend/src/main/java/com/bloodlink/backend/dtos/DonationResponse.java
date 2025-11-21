package com.bloodlink.backend.dtos;
import com.bloodlink.backend.model.RequestStatus;
import com.bloodlink.backend.model.Status;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

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


    public void setStatus(RequestStatus status) {
    }
}
