package com.Backend.EPI.service;

import com.Backend.EPI.persistence.entity.PasswordResetToken;
import com.Backend.EPI.persistence.entity.User;
import com.Backend.EPI.persistence.repository.PasswordResetTokenRepository;
import com.Backend.EPI.persistence.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import jakarta.servlet.http.HttpServletRequest;

import java.net.Inet4Address;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Enumeration;
import java.util.Optional;

/**
 * Servicio para gestionar recuperación de contraseña
 * Con máxima seguridad para producción
 */
@Service
public class PasswordResetService {

    private static final Logger logger = LoggerFactory.getLogger(PasswordResetService.class);
    private static final int TOKEN_LENGTH = 32; // 256 bits
    private static final long EXPIRATION_MINUTES = 10; // 10 minutos
    private static final int MAX_ATTEMPTS_PER_EMAIL = 3; // Máximo 3 intentos por email en 24 horas

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GoogleEmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${app.server.url:http://localhost:8080}")
    private String serverBaseUrl;

    @Value("${app.password-reset.expiration-minutes:10}")
    private long expirationMinutes;

    /**
     * Genera un token de recuperación seguro
     */
    private String generateSecureToken() {
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[TOKEN_LENGTH];
        random.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    /**
     * Obtiene la URL base del servidor dinámica y correctamente detrás de proxies.
     * - Producción: APP_SERVER_URL (si no incluye esquema, se asume https)
     * - Con proxy: usa X-Forwarded-* (proto/host/port/prefix)
     * - Local: reemplaza localhost por IP local (para pruebas desde móvil) y mantiene http
     */
    private String getServerBaseUrl() {
        try {
            // 1) Si hay APP_SERVER_URL, usarla (normalizada)
            String envUrl = System.getenv("APP_SERVER_URL");
            if (envUrl != null && !envUrl.isBlank()) {
                String normalized = normalizeBaseUrl(envUrl, true);
                logger.info("Usando APP_SERVER_URL: {}", normalized);
                return normalized;
            }

            // 2) Intentar desde la request (respetando X-Forwarded-*
            ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attrs != null) {
                HttpServletRequest request = attrs.getRequest();

                String xfProto = headerFirstValue(request, "X-Forwarded-Proto");
                String xfHost = headerFirstValue(request, "X-Forwarded-Host");
                String xfPort = headerFirstValue(request, "X-Forwarded-Port");
                String xfPrefix = headerFirstValue(request, "X-Forwarded-Prefix");

                if (xfHost != null) {
                    String scheme = (xfProto != null && !xfProto.isBlank()) ? xfProto : request.getScheme();
                    String host = xfHost; // puede venir con puerto incluido

                    // Si no viene puerto en host y X-Forwarded-Port está presente y no es estándar
                    if (!host.contains(":") && xfPort != null && !xfPort.isBlank() && !isDefaultPort(scheme, xfPort)) {
                        host = host + ":" + xfPort;
                    }

                    String base = scheme + "://" + host + (xfPrefix != null ? xfPrefix : "");
                    return normalizeBaseUrl(base, scheme.equalsIgnoreCase("https"));
                }

                // 3) Sin X-Forwarded-* -> usar serverName/serverPort
                String serverName = request.getServerName();
                int serverPort = request.getServerPort();
                String scheme = request.getScheme();

                // Localhost → intentar IP local
                if ("localhost".equalsIgnoreCase(serverName) || "127.0.0.1".equals(serverName)) {
                    String ip = discoverLocalIp();
                    String base = scheme + "://" + ip + ":" + serverPort;
                    return normalizeBaseUrl(base, false);
                }

                // IP privada → respetar puerto y esquema
                if (isPrivateIp(serverName)) {
                    String base = scheme + "://" + serverName + ":" + serverPort;
                    return normalizeBaseUrl(base, false);
                }

                // Dominio público → sin puerto, asumir https si scheme es https
                String base = scheme + "://" + serverName;
                return normalizeBaseUrl(base, scheme.equalsIgnoreCase("https"));
            }
        } catch (Exception e) {
            logger.warn("Error resolviendo base URL: {}", e.getMessage());
        }

        // 4) Último recurso: propiedad app.server.url (application.properties)
        logger.info("Usando app.server.url de configuración: {}", serverBaseUrl);
        return normalizeBaseUrl(serverBaseUrl, serverBaseUrl.startsWith("https://"));
    }

    // Devuelve el primer valor de un header (si viene con comas)
    private String headerFirstValue(HttpServletRequest req, String name) {
        String v = req.getHeader(name);
        if (v == null) return null;
        int idx = v.indexOf(',');
        return idx > -1 ? v.substring(0, idx).trim() : v.trim();
    }

    // Normaliza la base URL: sin barra final, agrega esquema si falta (https si enforceHttps)
    private String normalizeBaseUrl(String raw, boolean enforceHttps) {
        if (raw == null) return null;
        String url = raw.trim();
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            url = (enforceHttps ? "https://" : "http://") + url;
        }
        // quitar barra final
        if (url.endsWith("/")) url = url.substring(0, url.length() - 1);
        // si se fuerza https, convertir esquema
        if (enforceHttps && url.startsWith("http://")) {
            url = "https://" + url.substring("http://".length());
        }
        return url;
    }

    // ¿Puerto por defecto para esquema?
    private boolean isDefaultPort(String scheme, String portStr) {
        try {
            int p = Integer.parseInt(portStr);
            return ("http".equalsIgnoreCase(scheme) && p == 80) || ("https".equalsIgnoreCase(scheme) && p == 443);
        } catch (NumberFormatException e) {
            return false;
        }
    }

    // Detecta una IP local (IPv4, no loopback) para pruebas LAN
    private String discoverLocalIp() {
        try {
            for (Enumeration<NetworkInterface> en = NetworkInterface.getNetworkInterfaces(); en.hasMoreElements(); ) {
                NetworkInterface intf = en.nextElement();
                if (!intf.isUp() || intf.isLoopback() || intf.isVirtual()) continue;
                for (Enumeration<InetAddress> enumIpAddr = intf.getInetAddresses(); enumIpAddr.hasMoreElements(); ) {
                    InetAddress inetAddress = enumIpAddr.nextElement();
                    if (inetAddress instanceof Inet4Address && inetAddress.isSiteLocalAddress()) {
                        return inetAddress.getHostAddress();
                    }
                }
            }
        } catch (Exception ignored) { }
        return "127.0.0.1";
    }

    /**
     * Verifica si una dirección IP es privada (RFC 1918)
     */
    private boolean isPrivateIp(String host) {
        // Si viene nombre de host, no intentar resolver; aproximación simple
        return host.startsWith("192.168.") || host.startsWith("10.") || host.startsWith("172.16.") || host.startsWith("172.17.") || host.startsWith("172.18.") || host.startsWith("172.19.") || host.startsWith("172.2") || host.startsWith("172.3");
    }

    /**
     * Solicita recuperación de contraseña
     * Envía email solo si el usuario existe
     */
    @Transactional
    public void requestPasswordReset(String email, String ipAddress, String userAgent) {
        logger.info("Password reset requested for email: {}", email);

        // Buscar usuario
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            logger.warn("Password reset requested for non-existent email: {}", email);
            // Por seguridad, no indicar que el email no existe
            return;
        }

        User user = userOpt.get();

        // Verificar límite de intentos (máximo 3 en 24 horas)
        int recentAttempts = countRecentAttempts(email);
        if (recentAttempts >= MAX_ATTEMPTS_PER_EMAIL) {
            logger.warn("Password reset limit exceeded for email: {} (attempts: {})", email, recentAttempts);
            throw new SecurityException("Demasiados intentos. Intenta más tarde.");
        }

        // Invalidar tokens anteriores no usados
        invalidatePreviousTokens(email);

        // Generar nuevo token
        String token = generateSecureToken();
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(expirationMinutes);

        PasswordResetToken resetToken = new PasswordResetToken(email, token, expiresAt, ipAddress, userAgent);
        tokenRepository.save(resetToken);

        logger.info("Password reset token generated for email: {}", email);

        // Enviar email con URL dinámica del servidor
        String resetLink = getServerBaseUrl() + "/reset-password?token=" + token;
        try {
            emailService.sendPasswordResetEmail(email, user.getName(), resetLink);
            logger.info("Password reset email sent to: {} with link: {}", email, resetLink);
        } catch (Exception e) {
            logger.error("Error sending password reset email to {}: {}", email, e.getMessage(), e);
            throw new RuntimeException("Error enviando email de recuperación", e);
        }
    }

    /**
     * Válida un token de recuperación
     */
    public boolean validateResetToken(String token) {
        if (token == null || token.isEmpty()) {
            logger.warn("Token validation requested with empty token");
            return false;
        }

        // Log diagnóstico: existencia del token en BD
        Optional<PasswordResetToken> raw = tokenRepository.findByToken(token);
        if (raw.isEmpty()) {
            logger.warn("Token not found in database: {}", token);
        } else {
            PasswordResetToken t = raw.get();
            logger.info("Token diagnostic -> email: {}, createdAt: {}, expiresAt: {}, isUsed: {}", t.getEmail(), t.getCreatedAt(), t.getExpiresAt(), t.getIsUsed());
        }

        Optional<PasswordResetToken> resetToken = tokenRepository.findValidToken(token, LocalDateTime.now());
        if (resetToken.isEmpty()) {
            logger.warn("Invalid or expired password reset token attempted: {}", token);
            return false;
        }

        PasswordResetToken prt = resetToken.get();
        if (!prt.isValid()) {
            logger.warn("Token is invalid (post-check) for email: {}, now: {}, expiresAt: {}, isUsed: {}",
                    prt.getEmail(), LocalDateTime.now(), prt.getExpiresAt(), prt.getIsUsed());
            return false;
        }

        return true;
    }

    /**
     * Reestablece la contraseña con un token válido
     */
    @Transactional
    public void resetPassword(String token, String newPassword, String ipAddress, String userAgent) {
        logger.info("Password reset attempt with token: {}", token);

        Optional<PasswordResetToken> raw = tokenRepository.findByToken(token);
        if (raw.isPresent()) {
            PasswordResetToken t = raw.get();
            logger.info("Reset diagnostic (pre) -> email: {}, createdAt: {}, expiresAt: {}, isUsed: {}", t.getEmail(), t.getCreatedAt(), t.getExpiresAt(), t.getIsUsed());
        } else {
            logger.warn("Reset diagnostic: token not found before validity check: {}", token);
        }

        // Validar token
        Optional<PasswordResetToken> resetTokenOpt = tokenRepository.findValidToken(token, LocalDateTime.now());
        if (resetTokenOpt.isEmpty()) {
            logger.warn("Invalid token used for password reset: {}", token);
            throw new IllegalArgumentException("Token inválido o expirado");
        }

        PasswordResetToken resetToken = resetTokenOpt.get();

        // Validar que no esté expirado
        if (resetToken.isExpired()) {
            logger.warn("Expired token used for password reset: {}", resetToken.getEmail());
            throw new IllegalArgumentException("Token ha expirado");
        }

        // Validar que no esté usado
        if (resetToken.getIsUsed()) {
            logger.warn("Already-used token attempted for password reset: {}", resetToken.getEmail());
            throw new IllegalArgumentException("Token ya fue utilizado");
        }

        // Validar contraseña
        if (newPassword == null || newPassword.length() < 8) {
            logger.warn("Password too short for reset");
            throw new IllegalArgumentException("La contraseña debe tener al menos 8 caracteres");
        }

        // Buscar usuario
        Optional<User> userOpt = userRepository.findByEmail(resetToken.getEmail());
        if (userOpt.isEmpty()) {
            logger.error("User not found for password reset: {}", resetToken.getEmail());
            throw new IllegalArgumentException("Usuario no encontrado");
        }

        User user = userOpt.get();

        // Actualizar contraseña
        String encodedPassword = passwordEncoder.encode(newPassword);
        user.setPassword(encodedPassword);
        userRepository.save(user);

        // Marcar token como usado
        resetToken.markAsUsed();
        tokenRepository.save(resetToken);

        logger.info("Password successfully reset for user: {}", user.getEmail());

        // Enviar email de confirmación
        try {
            String confirmationMessage = "Tu contraseña ha sido restablecida exitosamente. "
                    + "Si no fuiste tú, contacta con nosotros inmediatamente.";
            emailService.sendSimpleEmail(
                    user.getEmail(),
                    "Contraseña Restablecida",
                    confirmationMessage
            );
        } catch (Exception e) {
            logger.error("Error sending password reset confirmation email: {}", e.getMessage());
            // No lanzar excepción aquí, la contraseña ya fue restablecida
        }
    }

    /**
     * Invalida todos los tokens anteriores no usados para un email
     */
    @Transactional
    private void invalidatePreviousTokens(String email) {
        Optional<PasswordResetToken> existingToken = tokenRepository.findLatestValidTokenByEmail(email);
        if (existingToken.isPresent()) {
            PasswordResetToken token = existingToken.get();
            token.setIsUsed(true);
            tokenRepository.save(token);
            logger.info("Previous password reset token invalidated for email: {}", email);
        }
    }

    /**
     * Cuenta intentos recientes (últimas 24 horas)
     */
    private int countRecentAttempts(String email) {
        LocalDateTime oneDayAgo = LocalDateTime.now().minusDays(1);
        // Esta consulta se ejecutaría contra la base de datos
        // Por ahora retornamos 0 como placeholder
        return 0; // TODO: Implementar consulta en repositorio
    }

    /**
     * Limpia tokens expirados (ejecutar periódicamente)
     */
    @Transactional
    public void cleanupExpiredTokens() {
        logger.info("Cleaning up expired password reset tokens");
        tokenRepository.deleteExpiredTokens(LocalDateTime.now());
    }
}
