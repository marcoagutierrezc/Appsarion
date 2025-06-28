/*package com.Backend.EPI.config;

import com.Backend.EPI.persistence.entity.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtils {

    private final String jwtSecret = "YourSecretKeyForJWTGenerationWithMinimum32Characters";
    private final int jwtExpirationMs = 86400000; // 1 día

    private final Key key = Keys.hmacShaKeyFor(jwtSecret.getBytes());

    public String generateToken(User user) {
        return Jwts.builder()
                .setSubject(user.getEmail()) // Usamos el email como identificador del token
                .claim("role", user.getRole()) // Añadimos información adicional (rol del usuario)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(SignatureAlgorithm.HS256, jwtSecret) // Firma el token con una clave secreta
                .compact();
    }

    public String getEmailFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public String getRoleFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get("role", String.class);
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            e.printStackTrace();
            return false;
        }
    }
}*/

