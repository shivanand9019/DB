package com.bloodlink.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DonationRequestDTO {
    private Long id;
    private Long donorId;
    private Long hospitalId;
    private String bloodGroup;
    private LocalDateTime dateAndTime;
    private String status;
    private String donorName;
    private String hospitalName;
}
