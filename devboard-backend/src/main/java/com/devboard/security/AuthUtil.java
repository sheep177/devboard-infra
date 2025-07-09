package com.devboard.security;

import com.devboard.model.User;
import com.devboard.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
public class AuthUtil {

    private static UserRepository staticUserRepository;

    public AuthUtil(UserRepository userRepository) {
        AuthUtil.staticUserRepository = userRepository;
    }

    public static User getCurrentUser() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getPrincipal() == null) {
            throw new RuntimeException("No authenticated user found.");
        }

        Object principal = auth.getPrincipal();
        if (principal instanceof UserDetails userDetails) {
            return staticUserRepository.findByUsername(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found in database: " + userDetails.getUsername()));
        }

        throw new RuntimeException("Unknown principal type: " + principal.getClass().getName());
    }

}

