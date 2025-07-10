package com.devboard.security;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

@Component
public class AuthUtil {
    private final HttpServletRequest request;

    public AuthUtil(HttpServletRequest request) {
        this.request = request;
    }

    public Long getCurrentTenantId() {
        Object attr = request.getAttribute("tenantId");
        return (attr instanceof Long) ? (Long) attr : null;
    }
}
