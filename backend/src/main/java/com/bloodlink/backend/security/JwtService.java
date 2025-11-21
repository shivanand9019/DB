//package com.bloodlink.backend.security;
//
//import io.jsonwebtoken.Claims;
//import io.jsonwebtoken.Jwts;
//import io.jsonwebtoken.security.Keys;
//import org.springframework.stereotype.Service;
//
//import javax.security.auth.kerberos.KerberosKey;
//import java.nio.charset.StandardCharsets;
//import java.util.Date;
//
//@Service
//public class JwtService {
//    private static final String SECRET_KEY = "your_very_long_256bit_secret_key_for_jwt_authentication_123456";
//
//    public String generateToken(String email, String role, Long userId) {
//        return Jwts.builder()
//                .setSubject(email)
//                .claim("role", role)
//                .claim("userId", userId)
//                .setIssuedAt(new Date())
//                .setExpiration(new Date(System.currentTimeMillis() + 24 * 60 * 60 * 1000))
//                .signWith(Keys.hmacShaKeyFor(SECRET_KEY.getBytes()))
//                .compact();
//    }
//
//    public String extractEmail(String token) {
//        return extractAllClaims(token).getSubject();
//    }
//
//    public Claims extractAllClaims(String token) {
//        return Jwts.parserBuilder()
//                .setSigningKey(Keys.hmacShaKeyFor(SECRET_KEY.getBytes()))
//                .build()
//                .parseClaimsJwt(token)
//                .getBody();
//    }
//}
