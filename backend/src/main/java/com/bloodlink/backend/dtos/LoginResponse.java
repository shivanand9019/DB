package com.bloodlink.backend.dtos;

import lombok.Data;

@Data
public class LoginResponse {
    private String message;
    private Long userId;
    private String role;

    private Long donorId;
    private Long hospitalId;
}
