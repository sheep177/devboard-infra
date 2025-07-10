// ✅ AuthController.java
package com.devboard.controller;

import com.devboard.model.User;
import com.devboard.repository.UserRepository;
import com.devboard.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository, JwtUtil jwtUtil, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists");
        }
        if (userRepository.existsByTenantId(user.getTenantId())) {
            return ResponseEntity.badRequest().body("Tenant ID already exists. Please choose a different one.");
        }
        user.setRole("admin");
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();
        Long tenantId = loginRequest.getTenantId();

        Optional<User> optionalUser = userRepository.findByUsernameAndTenantId(username, tenantId);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(401).body("Invalid username or tenant ID");
        }

        User user = optionalUser.get();
        if (!passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity.status(401).body("Invalid password");
        }

        String token = jwtUtil.generateToken(user);
        return ResponseEntity.ok(Map.of("token", token));
    }
}
