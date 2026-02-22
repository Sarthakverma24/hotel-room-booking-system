package com.sutreya.ecommerce.controller;

import com.sutreya.ecommerce.dto.AuthRequest;
import com.sutreya.ecommerce.dto.AuthResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = {"https://frontend-murex-sigma.vercel.app", "http://localhost:3000"})
public class AuthController {

    @PostMapping("/verify")
    public ResponseEntity<AuthResponse> verifyToken(@RequestHeader("Authorization") String token) {
        // Supabase handles authentication on frontend
        // This endpoint can be used for additional backend validation if needed
        return ResponseEntity.ok(new AuthResponse(true, "Token valid"));
    }
    
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Auth service running");
    }
}
