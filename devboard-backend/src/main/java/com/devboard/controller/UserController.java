package com.devboard.controller;

import com.devboard.model.User;
import com.devboard.repository.UserRepository;
import com.devboard.security.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public UserController(UserRepository userRepo,
                          PasswordEncoder passwordEncoder,
                          JwtUtil jwtUtil) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody User newUser, HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token == null || !token.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing token");
        }

        String jwt = token.substring(7);
        String creatorUsername = jwtUtil.extractUsername(jwt);

        Optional<User> creator = userRepo.findByUsername(creatorUsername);
        if (creator.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid creator");
        }

        if (userRepo.findByUsername(newUser.getUsername()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Username already exists");
        }

        newUser.setTenantId(creator.get().getTenantId()); // ✅ 自动继承 tenantId
        newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));
        User saved = userRepo.save(newUser);
        saved.setPassword(null); // 不返回密码
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<?> getUsersByTenant(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token == null || !token.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing token");
        }

        String jwt = token.substring(7);
        String username = jwtUtil.extractUsername(jwt);
        Optional<User> currentUser = userRepo.findByUsername(username);
        if (currentUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid user");
        }

        Long tenantId = currentUser.get().getTenantId();
        List<User> users = userRepo.findByTenantId(tenantId);
        users.forEach(u -> u.setPassword(null)); // 不返回密码
        return ResponseEntity.ok(users);
    }

}
