package com.codewith.firstApp.service;

import com.codewith.firstApp.dto.AuthResponse;
import com.codewith.firstApp.dto.LoginRequest;
import com.codewith.firstApp.dto.RegisterRequest;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}
