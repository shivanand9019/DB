package com.bloodlink.backend.dtos;


import com.bloodlink.backend.model.Role;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {
    private String email;
    private String password;

    private String role;


}
