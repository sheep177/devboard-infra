package com.devboard.security;

import com.devboard.model.User;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

public class AuthUtil {

    public static User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof User user) {
            return user;
        } else if (principal instanceof UserDetails userDetails) {

            throw new RuntimeException("UserDetails unsupported here");
        }
        throw new RuntimeException("Unknown principal type: " + principal);
    }
}
