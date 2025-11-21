package com.bloodlink.backend.dtos;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Setter;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter

public class UserResponse {
    private String message;
//    private String token;
    private String role;
    private Long userId;

    private Long donorId;
    private Long hospitalId;



}
