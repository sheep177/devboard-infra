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
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        System.out.println("➡️ 注册请求 - 用户名: " + user.getUsername() + ", tenantId: " + user.getTenantId());

        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            System.out.println("❌ 用户名已存在");
            return ResponseEntity.status(400).body("Username already exists");
        }

        if (userRepository.existsByTenantId(user.getTenantId())) {
            return ResponseEntity.badRequest().body("Tenant ID already exists. Please choose a different one.");
        }


        user.setRole("ADMIN");
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);

        System.out.println("✅ 用户注册成功: " + user.getUsername());

        // 返回 JWT（可选，若你希望注册完直接登录）
        String token = jwtUtil.generateToken(user);
        return ResponseEntity.ok(Map.of("token", token));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();
        Long tenantId = loginRequest.getTenantId();

        System.out.println("➡️ 登录请求 - 用户名: " + username + ", tenantId: " + tenantId);

        Optional<User> optionalUser = userRepository.findByUsernameAndTenantId(username, tenantId);
        if (optionalUser.isEmpty()) {
            System.out.println("❌ 用户不存在");
            return ResponseEntity.status(401).body("Invalid username or tenant ID");
        }

        User user = optionalUser.get();
        if (!passwordEncoder.matches(password, user.getPassword())) {
            System.out.println("❌ 密码错误");
            return ResponseEntity.status(401).body("Invalid password");
        }

        String token = jwtUtil.generateToken(user);
        System.out.println("✅ 登录成功，返回 token");

        return ResponseEntity.ok(Map.of("token", token));
    }
}
