package com.bloodlink.backend.impls;


import com.bloodlink.backend.exceptions.EmailAlreadyExistsException;

import com.bloodlink.backend.model.Donor;
import com.bloodlink.backend.model.Hospital;
import com.bloodlink.backend.model.Role;
import com.bloodlink.backend.model.User;
import com.bloodlink.backend.repositories.DonorRepo;
import com.bloodlink.backend.repositories.HospitalRepo;

import com.bloodlink.backend.model.Role;
import com.bloodlink.backend.model.User;
import com.bloodlink.backend.repositories.UserRepo;
import com.bloodlink.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Map;
import java.util.Optional;


import java.util.List;
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepo userRepo;

    private final DonorRepo donorRepo;
    private final HospitalRepo hospitalRepo;

    private final BCryptPasswordEncoder passwordEncoder=new BCryptPasswordEncoder();

    @Override
    public User registerUser(User user) {
        // Normalize first
        user.setEmail(user.getEmail().trim().toLowerCase());

        Optional<User> existingUser = userRepo.findByEmail(user.getEmail());

        // If already exists
        if (existingUser.isPresent()) {
            User existing = existingUser.get();
            if (!existing.isActive()) {
                existing.setActive(true);
                existing.setPassword(passwordEncoder.encode(user.getPassword()));
                return userRepo.save(existing);
            }
            throw new EmailAlreadyExistsException("Email already exists");
        }

        //  Save new user
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setActive(true);
        if (user.getRole() == null) {
            user.setRole(Role.DONOR);;
        }

        return userRepo.save(user);
    }


    @Override
    public User loginUser(String email, String password) {
        email = email.trim().toLowerCase();
        Optional<User> existingUser = userRepo.findByEmail(email);
        if (existingUser.isEmpty()) {
            throw new RuntimeException("Invalid email or password");
        }
        User user = existingUser.get();
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }
        return user;
    }


    @Override
    public User findUserByEmail(String email) {
        return userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("Invalid email:"+email));
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepo.existsByEmail(email);

    }

    @Override
    public boolean updatePassword(Long userId, String currentPassword, String newPassword) {
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));


        currentPassword = currentPassword.trim();
        newPassword = newPassword.trim();
        if(!passwordEncoder.matches(currentPassword, user.getPassword())) {
            return false;
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepo.save(user);
        return true;
    }

    @Override
    public void updatePreferences(Long userId, Map<String, Boolean> preferences) {
User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
user.setEmailNotifications(preferences.getOrDefault("emailNotifications",false));
user.setSmsNotifications(preferences.getOrDefault("smsNotifications",false));
userRepo.save(user);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    @Override
    public void deactivateUser(String email) {
        User user = userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("Invalid email:"+email));
        user.setActive(false);
        userRepo.save(user);

    }

    @Override
    public Long getLoggedInUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("No authenticated user found");
        }

        User user = (User) authentication.getPrincipal(); // cast to your User entity or UserDetails
        return user.getUserID();
    }

    public Long getDonorIdByUserId(Long userId) {
       return donorRepo.findByUserUserID(userId)
               .map(Donor::getDonorId)
               .orElse(null);
    }

    public Long getHospitalIdByUserId(Long userId) {
       return hospitalRepo.findByUserUserID(userId)
               .map(Hospital::getHospitalId)
               .orElse(null);

    }



}
