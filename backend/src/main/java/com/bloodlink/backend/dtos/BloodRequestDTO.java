package com.bloodlink.backend.dtos;

import com.bloodlink.backend.model.RequestStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
@Getter
@Setter
public class BloodRequestDTO {
    private Long requestId;

    private String patientName;
    private String bloodGroup;
    private int unitsRequired;
    private  String contact;
    private LocalDate date;
    private  Long hospitalId;
    private RequestStatus status;

}
