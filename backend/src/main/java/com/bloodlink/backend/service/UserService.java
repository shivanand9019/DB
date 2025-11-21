package com.bloodlink.backend.service;

import com.bloodlink.backend.model.Donation;
import com.bloodlink.backend.model.User;

import java.util.List;
import java.util.Map;

public interface UserService {

    User registerUser(User user);
    User loginUser(String email, String password);
    User findUserByEmail(String email);

    boolean existsByEmail(String email);
    boolean updatePassword(Long userId, String currentPassword,String newPassword);
    void updatePreferences(Long userId, Map<String, Boolean> preferences);
    List<User> getAllUsers();
    void deactivateUser(String email);
    public Long getLoggedInUserId() ;

    public Long getDonorIdByUserId(Long userId) ;

    public Long getHospitalIdByUserId(Long userId) ;

}
