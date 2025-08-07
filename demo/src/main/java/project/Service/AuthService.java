package project.Service;

import project.Dto.AuthResponse;
import project.Dto.LoginRequest;
import project.Dto.RegisterRequest;

public interface AuthService {

    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
