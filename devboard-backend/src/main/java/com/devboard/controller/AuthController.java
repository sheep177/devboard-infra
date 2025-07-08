// AuthController.java
package com.devboard.controller;

import com.devboard.model.User;
import com.devboard.repository.UserRepository;
import com.devboard.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.status(409).body("Username already exists");
        }
        System.out.println("Register raw password: " + user.getPassword());
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        System.out.println("Register encoded password: " + encodedPassword);
        user.setPassword(encodedPassword);
        user.setRole("Admin");
        userRepository.save(user);
        return ResponseEntity.ok("Registration successful");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        Optional<User> userOptional = userRepository.findByUsername(loginRequest.getUsername());
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            System.out.println("Login raw password: " + loginRequest.getPassword());
            System.out.println("Stored encoded password: " + user.getPassword());
            boolean matches = passwordEncoder.matches(loginRequest.getPassword(), user.getPassword());
            System.out.println("Password match result: " + matches);
            if (matches) {
                String token = jwtUtil.generateToken(user.getUsername());
                return ResponseEntity.ok(token);
            }
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }
}
