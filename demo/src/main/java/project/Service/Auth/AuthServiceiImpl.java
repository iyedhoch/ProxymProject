package project.Service.Auth;

import project.Dto.AuthResponse;
import project.Dto.LoginRequest;
import project.Dto.RegisterRequest;
import project.Entity.User;
import project.Repository.UserRepository;
import project.Service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceiImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already in use");
        }

        User userEntity = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        userRepository.save(userEntity);

        // Convert to UserDetails for token generation
        UserDetails userDetails = convertToUserDetails(userEntity);
        String token = jwtService.generateToken(userDetails);
        return new AuthResponse(token);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User userEntity = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), userEntity.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        // Convert to UserDetails for token generation
        UserDetails userDetails = convertToUserDetails(userEntity);
        String token = jwtService.generateToken(userDetails);
        return new AuthResponse(token);
    }

    private UserDetails convertToUserDetails(User user) {
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail()) // Use email as username
                .password(user.getPassword())
                .authorities("USER")
                .build();
    }
}