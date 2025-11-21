package com.bloodlink.backend.dtos;

import com.bloodlink.backend.model.Role;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {
    private String email;
    private Role role;
    private String password;


}
