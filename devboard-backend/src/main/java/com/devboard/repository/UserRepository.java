package com.devboard.repository;

import com.devboard.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);

    // ✅ 类型为 Long，匹配数据库中的 BIGINT 类型
    boolean existsByTenantId(Long tenantId);

    Optional<User> findByIdAndTenantId(Long id, Long tenantId);

    // ✅ 新增：用于检查用户名是否已存在于当前 tenant 中
    Optional<User> findByUsernameAndTenantId(String username, Long tenantId);
}
