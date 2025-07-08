package com.devboard.controller;

import com.devboard.model.User;
import com.devboard.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;  // ← 新增
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173") // 根据部署环境调整
public class UserController {

    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;      // ← 新增

    public UserController(UserRepository userRepo,
                          PasswordEncoder passwordEncoder) {  // ← 构造器注入
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        // 1. 检查用户名冲突
        if (userRepo.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        // 2. 加密密码
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        // 3. 设定默认角色
        user.setRole("Member");
        // 4. 保存
        User saved = userRepo.save(user);
        // 5. 清除返回对象中的密码字段
        saved.setPassword(null);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
