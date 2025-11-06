package com.Backend.EPI.web.controller;

import com.Backend.EPI.service.GoogleEmailService;
import com.Backend.EPI.service.PasswordResetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/emails")
public class EmailController {

    @Autowired
    private GoogleEmailService emailService;

    @Autowired
    private PasswordResetService passwordResetService;

    /**
     * Envía un email de prueba
     * POST /api/emails/test
     * Body: { "to": "destinatario@ejemplo.com" }
     */
    @PostMapping("/test")
    public ResponseEntity<Map<String, Object>> sendTestEmail(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();

        try {
            String to = request.get("to");
            if (to == null || to.isEmpty()) {
                response.put("success", false);
                response.put("message", "El campo 'to' es requerido");
                return ResponseEntity.badRequest().body(response);
            }

            String textContent = "¡Hola!\n\n"
                    + "Este es un email de prueba enviado desde Appsarion usando Google SMTP.\n"
                    + "Si recibiste este email, ¡la configuración está funcionando correctamente! ✅\n\n"
                    + "Atentamente,\n"
                    + "Equipo Appsarion";

            emailService.sendSimpleEmail(to, "Email de Prueba - Appsarion", textContent);

            response.put("success", true);
            response.put("message", "Email enviado exitosamente");
            response.put("to", to);
            response.put("timestamp", System.currentTimeMillis());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al enviar email: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Solicita recuperación de contraseña
     * POST /api/emails/request-password-reset
     * Body: { "email": "usuario@ejemplo.com" }
     *
     * Genera un token seguro y envía link de recuperación por email
     */
    @PostMapping("/request-password-reset")
    public ResponseEntity<Map<String, Object>> requestPasswordReset(
            @RequestBody Map<String, String> request,
            HttpServletRequest httpRequest) {
        Map<String, Object> response = new HashMap<>();

        try {
            String email = request.get("email");
            if (email == null || email.isEmpty()) {
                response.put("success", false);
                response.put("message", "El campo 'email' es requerido");
                return ResponseEntity.badRequest().body(response);
            }

            // Obtener información del cliente para auditoría
            String ipAddress = getClientIpAddress(httpRequest);
            String userAgent = httpRequest.getHeader("User-Agent");

            passwordResetService.requestPasswordReset(email, ipAddress, userAgent);

            response.put("success", true);
            response.put("message", "Se ha enviado un enlace de recuperación a tu email. "
                    + "Verifica tu bandeja de entrada (válido por 1 hora)");

            return ResponseEntity.ok(response);
        } catch (SecurityException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error procesando solicitud: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Valida un token de recuperación de contraseña
     * GET /api/emails/validate-reset-token?token=xyz123
     */
    @GetMapping("/validate-reset-token")
    public ResponseEntity<Map<String, Object>> validateResetToken(
            @RequestParam String token) {
        Map<String, Object> response = new HashMap<>();

        try {
            if (token == null || token.isEmpty()) {
                response.put("success", false);
                response.put("message", "Token requerido");
                return ResponseEntity.badRequest().body(response);
            }

            boolean isValid = passwordResetService.validateResetToken(token);

            response.put("success", isValid);
            if (isValid) {
                response.put("message", "Token válido");
            } else {
                response.put("message", "Token inválido o expirado");
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error validando token: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Reestablece la contraseña usando un token válido
     * POST /api/emails/reset-password
     * Body: { "token": "xyz123", "newPassword": "nuevaContraseña123" }
     *
     * Requerimientos de seguridad:
     * - Token debe ser válido y no expirado
     * - Contraseña mínimo 8 caracteres
     * - Se registra IP y User Agent para auditoría
     */
    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, Object>> resetPassword(
            @RequestBody Map<String, String> request,
            HttpServletRequest httpRequest) {
        Map<String, Object> response = new HashMap<>();

        try {
            String token = request.get("token");
            String newPassword = request.get("newPassword");

            if (token == null || token.isEmpty()) {
                response.put("success", false);
                response.put("message", "Token requerido");
                return ResponseEntity.badRequest().body(response);
            }

            if (newPassword == null || newPassword.isEmpty()) {
                response.put("success", false);
                response.put("message", "Nueva contraseña requerida");
                return ResponseEntity.badRequest().body(response);
            }

            if (newPassword.length() < 8) {
                response.put("success", false);
                response.put("message", "La contraseña debe tener al menos 8 caracteres");
                return ResponseEntity.badRequest().body(response);
            }

            // Obtener información del cliente para auditoría
            String ipAddress = getClientIpAddress(httpRequest);
            String userAgent = httpRequest.getHeader("User-Agent");

            passwordResetService.resetPassword(token, newPassword, ipAddress, userAgent);

            response.put("success", true);
            response.put("message", "Contraseña restablecida exitosamente. Intenta ingresar con tu nueva contraseña.");

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error restableciendo contraseña: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Obtiene la dirección IP del cliente considerando proxies
     */
    private String getClientIpAddress(HttpServletRequest request) {
        String[] headers = {
            "X-Forwarded-For",
            "Proxy-Client-IP",
            "WL-Proxy-Client-IP",
            "HTTP_X_FORWARDED_FOR",
            "HTTP_X_FORWARDED",
            "HTTP_X_PROXY_AUTHORIZATION",
            "HTTP_CLIENT_IP",
            "HTTP_FORWARDED_FOR",
            "HTTP_FORWARDED",
            "HTTP_VIA",
            "REMOTE_ADDR"
        };

        for (String header : headers) {
            String ip = request.getHeader(header);
            if (ip != null && !ip.isEmpty() && !"unknown".equalsIgnoreCase(ip)) {
                // Si hay múltiples IPs (en X-Forwarded-For), tomar la primera
                if (ip.contains(",")) {
                    ip = ip.split(",")[0].trim();
                }
                return ip;
            }
        }

        return request.getRemoteAddr();
    }
}




