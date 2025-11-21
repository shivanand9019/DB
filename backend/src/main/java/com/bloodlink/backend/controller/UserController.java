package com.bloodlink.backend.controller;

import com.bloodlink.backend.dtos.LoginRequest;
import com.bloodlink.backend.dtos.LoginResponse;
import com.bloodlink.backend.dtos.RegisterRequest;
import com.bloodlink.backend.dtos.UserResponse;
import com.bloodlink.backend.model.Role;
import com.bloodlink.backend.model.User;
import com.bloodlink.backend.repositories.UserRepo;
import com.bloodlink.backend.service.UserService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", allowCredentials = "true")
public class UserController {

    private final UserService userService;
    private final UserRepo userRepo;



    // ----------------------------------------
    // Check email exists
    // ----------------------------------------
    @GetMapping("/check/{email}")
    public ResponseEntity<String> checkEmail(@PathVariable String email) {
        boolean exists = userService.existsByEmail(email);
        return ResponseEntity.ok(exists ? "Exists" : "Not Found");
    }


    // ----------------------------------------
    // Register User
    // ----------------------------------------
    @PostMapping("/register")
    public ResponseEntity<UserResponse> registerUser(@RequestBody RegisterRequest request) {
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setRole(request.getRole());

        User savedUser = userService.registerUser(user);

//        String token = jwtService.generateToken(
//                user.getEmail(),
//                user.getRole().name(),
//                user.getUserID()
//        );
        Long donorId = null;
        Long hospitalId = null;

        if (savedUser.getRole() == Role.DONOR && savedUser.getDonor() != null) {
            donorId = savedUser.getDonor().getDonorId();
        } else if (savedUser.getRole() == Role.HOSPITAL && savedUser.getHospital() != null) {
            hospitalId = savedUser.getHospital().getHospitalId();
        }

        UserResponse response = new UserResponse(
                "User registered successfully",
//                token,
                savedUser.getRole().name(),
                savedUser.getUserID(),
                donorId,
                hospitalId
        );

        return ResponseEntity.ok(response);
    }
//    @PostMapping("/register")
//    public ResponseEntity<UserResponse> registerUser(@RequestBody RegisterRequest request) {
//
//        User savedUser = userService.registerUser(user);
//
//        Long donorId = null;
//        Long hospitalId = null;
//
//        if (savedUser.getRole() == Role.DONOR && savedUser.getDonor() != null) {
//            donorId = savedUser.getDonor().getDonorId();
//        } else if (savedUser.getRole() == Role.HOSPITAL && savedUser.getHospital() != null) {
//            hospitalId = savedUser.getHospital().getHospitalId();
//        }
//
//        UserResponse response = new UserResponse(
//                "User registered successfully",
//                savedUser.getRole().name(),
//                savedUser.getUserID(),
//                donorId,
//                hospitalId
//        );
//
//        return ResponseEntity.ok(response);
//    }


    // ----------------------------------------
    // Login User
    // ----------------------------------------
    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@RequestBody LoginRequest request) {

        User user = userService.loginUser(request.getEmail(), request.getPassword());
//        String token = jwtService.generateToken(
//                user.getEmail(),
//                user.getRole().name(),
//                user.getUserID()
//        );
        // Check role match
        if (!user.getRole().name().equalsIgnoreCase(request.getRole())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new UserResponse("Invalid role Selection", null, null, null, null));
        }

        Long donorId = userService.getDonorIdByUserId(user.getUserID());
        Long hospitalId = userService.getHospitalIdByUserId(user.getUserID());

        UserResponse response = new UserResponse(
                "Login successful!",
//                token,
                user.getRole().name(),
                user.getUserID(),
                donorId,
                hospitalId
        );

        return ResponseEntity.ok(response);
    }


    // ----------------------------------------
    // Update Password
    // ----------------------------------------
    @PutMapping("/password")
    public ResponseEntity<?> updatePassword(@RequestBody Map<String, String> request) {

        Long userId = userService.getLoggedInUserId(); // TODO: use proper security context

        boolean updated = userService.updatePassword(
                userId,
                request.get("currentPassword"),
                request.get("newPassword")
        );

        if (updated) {
            return ResponseEntity.ok("Password updated successfully");
        } else {
            return ResponseEntity.badRequest().body("Current password does not match");
        }
    }


    // ----------------------------------------
    // Update Preferences
    // ----------------------------------------
    @PutMapping("/{userId}/preferences")
    public ResponseEntity<String> updatePreferences(@PathVariable Long userId,
                                                    @RequestBody Map<String, Boolean> preferences) {

        userService.updatePreferences(userId, preferences);
        return ResponseEntity.ok("Preferences updated successfully");
    }

    @GetMapping("/{userId}/preferences")
    public ResponseEntity<Map<String, Boolean>> getPreferences(@PathVariable Long userId) {

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, Boolean> preferences = new HashMap<>();
        preferences.put("emailNotifications", user.isEmailNotifications());
        preferences.put("smsNotifications", user.isSmsNotifications());

        return ResponseEntity.ok(preferences);
    }
}


//package com.bloodlink.backend.controller;
//
//import com.bloodlink.backend.dtos.LoginRequest;
//
//import com.bloodlink.backend.dtos.LoginResponse;
//import com.bloodlink.backend.dtos.RegisterRequest;
//import com.bloodlink.backend.dtos.UserResponse;
//import com.bloodlink.backend.model.Hospital;
//import com.bloodlink.backend.model.Role;
//import com.bloodlink.backend.model.User;
//import com.bloodlink.backend.repositories.UserRepo;
//
//import com.bloodlink.backend.dtos.RegisterRequest;
//import com.bloodlink.backend.dtos.UserResponse;
//import com.bloodlink.backend.model.Hospital;
//import com.bloodlink.backend.model.User;
//import com.bloodlink.backend.service.UserService;
//import lombok.RequiredArgsConstructor;
//import org.apache.tomcat.util.net.openssl.ciphers.Authentication;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//
//import java.util.HashMap;
//
//import java.util.Map;
//
//import static javax.swing.text.html.HTML.Tag.HEAD;
//
//@RestController
//@RequestMapping("/api/users")
//@RequiredArgsConstructor
//@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", allowCredentials = "true")
//public class UserController {
//
//    private final UserService userService;
//
//    private final UserRepo userRepo;
//
//
//
//    // Check if email exists
//    @GetMapping("/check/{email}")
//    public ResponseEntity<String> checkEmail(@PathVariable String email) {
//        boolean exists = userService.existsByEmail(email);
//        return ResponseEntity.ok(exists ? "Exists" : "Not Found");
//    }
//
//
//
//    // Register new user
//

//
//
//    // Register new user
////    @PostMapping("/register")
////    public ResponseEntity<UserResponse> registerUser(@RequestBody RegisterRequest request) {
////        User user = new User();
////        user.setEmail(request.getEmail());
////        user.setPassword(request.getPassword());
////        user.setRole(request.getRole());
////
////        User savedUser = userService.registerUser(user);
////        UserResponse response = new UserResponse(
////                "User registered successfully",
////                savedUser.getRole().name(),
////                savedUser.getUserID(),
////                savedUser.getDonor().getDonorId(),
////                savedUser.getHospital().getHospitalId()
////        );
////        return ResponseEntity.ok(response);
////    }
//
//    // Login user
////    @PostMapping("/login")
////    public ResponseEntity<LoginResponse> loginUser(@RequestBody LoginRequest request) {
////
////        User user = userService.loginUser(request.getEmail(), request.getPassword());
////
////        LoginResponse response = new LoginResponse();
////        response.setMessage("Login successful!");
////        response.setUserId(user.getUserID());
////        response.setRole(user.getRole().name());
////
////        // ✅ Add donorId or hospitalId
////        if (user.getRole() == Role.DONOR) {
////            response.setDonorId(userService.getDonorIdByUserId(user.getUserID()));
////        }
////
////        if (user.getRole() == Role.HOSPITAL) {
////            response.setHospitalId(userService.getHospitalIdByUserId(user.getUserID()));
////        }
////
////        return ResponseEntity.ok(response);
////    }
//     @PostMapping("/login")
//     public ResponseEntity<UserResponse> login(@RequestBody LoginRequest request) {
//
//         User user = userService.loginUser(request.getEmail(), request.getPassword());
//   if(!user.getRole().name().equalsIgnoreCase(request.getRole())){
//       return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
//               new UserResponse("Invalid role Selection",null,null,null,null));
//   }
//         Long donorId = userService.getDonorIdByUserId(user.getUserID());
//         Long hospitalId = userService.getHospitalIdByUserId(user.getUserID());
//
//         UserResponse response = new UserResponse(
//                 "Login successful!",
//                 user.getRole().name(),
//                 user.getUserID(),
//                 donorId,
//                 hospitalId
//         );
//
//         return ResponseEntity.ok(response);
//     }
//
//
////    @PostMapping("/login")
////    public ResponseEntity<UserResponse> loginUser(@RequestBody LoginRequest request) {
////
////        User user = userService.loginUser(request.getEmail(), request.getPassword());
////
////        Long donorId = userService.getDonorIdByUserId(user.getUserID());
////        Long hospitalId = userService.getHospitalIdByUserId(user.getUserID());
////
////        UserResponse response = new UserResponse(
////                "Login successful!",
////                user.getRole().name(),
////                user.getUserID(),
////                donorId,
////                hospitalId
////        );
////
////        return ResponseEntity.ok(response);
////    }
//
//
//        UserResponse response = new UserResponse(
//                "User registered successfully",
//                savedUser.getRole().name(),
//                savedUser.getUserID()
//        );
//        return ResponseEntity.ok(response);
//    }
//
//    // Login user
//    @PostMapping("/login")
//    public ResponseEntity<UserResponse> loginUser(@RequestBody LoginRequest request) {
//        User user = userService.loginUser(request.getEmail(), request.getPassword());
//        UserResponse response = new UserResponse(
//                "Login successful!",
//                user.getRole().name(),
//                user.getUserID()
//        );
//        return ResponseEntity.ok(response);
//    }
//
//    // Update password
//    @PutMapping("/password")
//    public ResponseEntity<String> updatePassword(@RequestBody Map<String, String> request) {
//        Long userId = userService.getLoggedInUserId(); // get from security context
//        String currentPassword = request.get("currentPassword");
//        String newPassword = request.get("newPassword");
//
//        boolean updated = userService.updatePassword(userId, currentPassword, newPassword);
//        if (updated)
//            return ResponseEntity.ok("Password updated successfully");
//        else
//            return ResponseEntity.badRequest().body("Current password does not match");
//    }
//
//    // Update preferences
//    @PutMapping("/{userId}/preferences")
//    public ResponseEntity<String> updatePreferences(@PathVariable Long userId, @RequestBody Map<String, Boolean> preferences) {
//        userService.updatePreferences(userId, preferences);
//        return ResponseEntity.ok("Preferences updated successfully");
//    }
//
//    @GetMapping("/{userId}/preferences")
//    public ResponseEntity<Map<String, Boolean>> getPreferences(@PathVariable Long userId) {
//        User user = userRepo.findById(userId)
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        Map<String, Boolean> preferences = new HashMap<>();
//        preferences.put("emailNotifications", user.isEmailNotifications());
//        preferences.put("smsNotifications", user.isSmsNotifications());
//
//        return ResponseEntity.ok(preferences);
//    }
//
//
//}
