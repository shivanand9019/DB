package com.bloodlink.backend.dtos;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
@Data
@Getter
@Setter
public class BloodStockDTO {
    private Long id;
    private Long hospitalId;

    private String hospitalName;
    private String bloodGroup;

    private Double unitsAvailable;
    private LocalDateTime lastUpdated;
}
