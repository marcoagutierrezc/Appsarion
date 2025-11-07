package com.Backend.EPI.service;

import com.Backend.EPI.persistence.entity.FormData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Servicio unificado de email que usa el proveedor configurado
 * Puede cambiar entre Gmail y Resend sin modificar el código
 */
@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private EmailProviderFactory emailProviderFactory;

    /**
     * Envía un email de PQR usando el proveedor configurado
     *
     * @param formData Datos del formulario PQR
     */
    public void sendPqrEmail(FormData formData) {
        try {
            EmailProvider provider = emailProviderFactory.getEmailProvider();
            logger.info("Enviando email PQR con proveedor: {}", provider.getProviderName());

            // Generar número de seguimiento
            String trackingNumber = "PQR-" + System.currentTimeMillis();

            String htmlContent = EmailTemplateService.getPQRConfirmationTemplate(
                    formData.getNombre(),
                    formData.getAsunto(),
                    trackingNumber
            );

            provider.sendHtmlEmail(
                    "appsarion.unillanos@gmail.com",
                    "Nueva PQR: " + formData.getAsunto(),
                    htmlContent
            );
        } catch (Exception e) {
            logger.error("Error al enviar email PQR: {}", e.getMessage(), e);
            throw new RuntimeException("Error al enviar email PQR: " + e.getMessage(), e);
        }
    }

    /**
     * Envía un email simple usando el proveedor configurado
     *
     * @param to       Dirección de destino
     * @param subject  Asunto del email
     * @param content  Contenido del email
     */
    public void sendSimpleEmail(String to, String subject, String content) {
        EmailProvider provider = emailProviderFactory.getEmailProvider();
        logger.info("Enviando email simple con proveedor: {}", provider.getProviderName());
        provider.sendSimpleEmail(to, subject, content);
    }

    /**
     * Envía un email HTML usando el proveedor configurado
     *
     * @param to          Dirección de destino
     * @param subject     Asunto del email
     * @param htmlContent Contenido HTML
     */
    public void sendHtmlEmail(String to, String subject, String htmlContent) {
        EmailProvider provider = emailProviderFactory.getEmailProvider();
        logger.info("Enviando email HTML con proveedor: {}", provider.getProviderName());
        provider.sendHtmlEmail(to, subject, htmlContent);
    }

    /**
     * Envía un email a múltiples destinatarios usando el proveedor configurado
     *
     * @param recipients  Array de direcciones
     * @param subject     Asunto del email
     * @param htmlContent Contenido HTML
     */
    public void sendEmailToMultiple(String[] recipients, String subject, String htmlContent) {
        EmailProvider provider = emailProviderFactory.getEmailProvider();
        logger.info("Enviando email a {} destinatarios con proveedor: {}",
                recipients.length, provider.getProviderName());
        provider.sendEmailToMultiple(recipients, subject, htmlContent);
    }

    /**
     * Envía un email con parámetros avanzados usando el proveedor configurado
     *
     * @param params Parámetros avanzados del email
     */
    public void sendAdvancedEmail(EmailParams params) {
        EmailProvider provider = emailProviderFactory.getEmailProvider();
        logger.info("Enviando email avanzado con proveedor: {}", provider.getProviderName());
        provider.sendAdvancedEmail(params);
    }

    /**
     * Obtiene el nombre del proveedor actualmente en uso
     *
     * @return Nombre del proveedor
     */
    public String getCurrentProvider() {
        return emailProviderFactory.getProviderName();
    }

    /**
     * Envía un email de recuperación de contraseña
     *
     * @param email      Email del usuario
     * @param name       Nombre del usuario
     * @param resetLink  Enlace de recuperación
     */
    public void sendPasswordResetEmail(String email, String name, String resetLink) {
        try {
            EmailProvider provider = emailProviderFactory.getEmailProvider();
            logger.info("Enviando email de recuperación de contraseña a: {} con proveedor: {}",
                    email, provider.getProviderName());

            String htmlContent = EmailTemplateService.getPasswordResetTemplate(name, resetLink);
            provider.sendHtmlEmail(email, "Recupera tu Contraseña - Appsarion", htmlContent);
            logger.info("Email de recuperación de contraseña enviado a: {}", email);
        } catch (Exception e) {
            logger.error("Error al enviar email de recuperación de contraseña a {}: {}",
                    email, e.getMessage(), e);
            throw new RuntimeException("Error al enviar email de recuperación: " + e.getMessage(), e);
        }
    }

    /**
     * Envía un email de aprobación de usuario
     *
     * @param email Email del usuario
     * @param name  Nombre del usuario
     */
    public void sendApprovalEmail(String email, String name) {
        try {
            EmailProvider provider = emailProviderFactory.getEmailProvider();
            logger.info("Enviando email de aprobación a: {} con proveedor: {}",
                    email, provider.getProviderName());

            String htmlContent = EmailTemplateService.getApprovalTemplate(name);
            provider.sendHtmlEmail(email, "¡Tu Cuenta ha sido Aprobada! - Appsarion", htmlContent);
            logger.info("Email de aprobación enviado a: {}", email);
        } catch (Exception e) {
            logger.error("Error al enviar email de aprobación a {}: {}",
                    email, e.getMessage(), e);
            throw new RuntimeException("Error al enviar email de aprobación: " + e.getMessage(), e);
        }
    }

    /**
     * Envía un email de rechazo de usuario
     *
     * @param email            Email del usuario
     * @param name             Nombre del usuario
     * @param rejectionReason  Motivo del rechazo
     */
    public void sendRejectionEmail(String email, String name, String rejectionReason) {
        try {
            EmailProvider provider = emailProviderFactory.getEmailProvider();
            logger.info("Enviando email de rechazo a: {} con proveedor: {}",
                    email, provider.getProviderName());

            String htmlContent = EmailTemplateService.getRejectionTemplate(name, rejectionReason);
            provider.sendHtmlEmail(email, "Actualización sobre tu Solicitud de Registro - Appsarion", htmlContent);
            logger.info("Email de rechazo enviado a: {}", email);
        } catch (Exception e) {
            logger.error("Error al enviar email de rechazo a {}: {}",
                    email, e.getMessage(), e);
            throw new RuntimeException("Error al enviar email de rechazo: " + e.getMessage(), e);
        }
    }

    /**
     * Envía un email de confirmación cuando la contraseña ha sido restablecida exitosamente
     *
     * @param email Email del usuario
     * @param name  Nombre del usuario
     */
    public void sendPasswordResetSuccessEmail(String email, String name) {
        try {
            EmailProvider provider = emailProviderFactory.getEmailProvider();
            logger.info("Enviando email de confirmación de contraseña restablecida a: {} con proveedor: {}",
                    email, provider.getProviderName());

            String htmlContent = EmailTemplateService.getPasswordResetSuccessTemplate(name);
            provider.sendHtmlEmail(email, "Contraseña Restablecida Exitosamente - Appsarion", htmlContent);
            logger.info("Email de confirmación de contraseña enviado a: {}", email);
        } catch (Exception e) {
            logger.error("Error al enviar email de confirmación de contraseña a {}: {}",
                    email, e.getMessage(), e);
            throw new RuntimeException("Error al enviar email de confirmación: " + e.getMessage(), e);
        }
    }
}