package com.codewith.firstApp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String token;
    private String role;
    private String name;
    private String email;
    private Long userId;
}
