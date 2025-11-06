package com.Backend.EPI.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Servicio para enviar correos usando Google SMTP
 * Utiliza credenciales de Gmail (appsarion.unillanos@gmail.com)
 */
@Service
public class GoogleEmailService {

    private static final Logger logger = LoggerFactory.getLogger(GoogleEmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    /**
     * Envía un email simple con contenido de texto plano
     */
    public void sendSimpleEmail(String to, String subject, String textContent) {
        try {
            logger.info("Enviando email simple a: {}, asunto: {}", to, subject);

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(textContent);

            mailSender.send(message);
            logger.info("Email enviado exitosamente a: {}", to);
        } catch (Exception e) {
            logger.error("Error al enviar email simple a {}: {}", to, e.getMessage(), e);
            throw new RuntimeException("Error al enviar email a " + to + ": " + e.getMessage(), e);
        }
    }

    /**
     * Envía un email con contenido HTML
     */
    public void sendHtmlEmail(String to, String subject, String htmlContent) {
        try {
            logger.info("Enviando email HTML a: {}, asunto: {}", to, subject);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            logger.info("Email HTML enviado exitosamente a: {}", to);
        } catch (MessagingException e) {
            logger.error("Error al enviar email HTML a {}: {}", to, e.getMessage(), e);
            throw new RuntimeException("Error al enviar email HTML a " + to + ": " + e.getMessage(), e);
        } catch (Exception e) {
            logger.error("Error inesperado al enviar email HTML a {}: {}", to, e.getMessage(), e);
            throw new RuntimeException("Error al enviar email HTML a " + to + ": " + e.getMessage(), e);
        }
    }

    /**
     * Envía email a múltiples destinatarios
     */
    public void sendEmailToMultiple(String[] recipients, String subject, String htmlContent) {
        try {
            logger.info("Enviando email a múltiples destinatarios: {}, asunto: {}", recipients.length, subject);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(recipients);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            logger.info("Email enviado exitosamente a {} destinatarios", recipients.length);
        } catch (MessagingException e) {
            logger.error("Error al enviar email a múltiples destinatarios: {}", e.getMessage(), e);
            throw new RuntimeException("Error al enviar email a múltiples destinatarios: " + e.getMessage(), e);
        } catch (Exception e) {
            logger.error("Error inesperado al enviar email a múltiples destinatarios: {}", e.getMessage(), e);
            throw new RuntimeException("Error al enviar email a múltiples destinatarios: " + e.getMessage(), e);
        }
    }

    /**
     * Envía email con CC y/o BCC
     */
    public void sendEmailWithCopies(String to, String[] cc, String[] bcc, String subject, String htmlContent) {
        try {
            logger.info("Enviando email con copias a: {}, asunto: {}", to, subject);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(to);
            if (cc != null && cc.length > 0) {
                helper.setCc(cc);
            }
            if (bcc != null && bcc.length > 0) {
                helper.setBcc(bcc);
            }
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            logger.info("Email con copias enviado exitosamente a: {}", to);
        } catch (MessagingException e) {
            logger.error("Error al enviar email con copias a {}: {}", to, e.getMessage(), e);
            throw new RuntimeException("Error al enviar email con copias: " + e.getMessage(), e);
        } catch (Exception e) {
            logger.error("Error inesperado al enviar email con copias a {}: {}", to, e.getMessage(), e);
            throw new RuntimeException("Error al enviar email con copias: " + e.getMessage(), e);
        }
    }

    /**
     * Envía email de bienvenida
     */
    public void sendWelcomeEmail(String to, String userName) {
        logger.info("Enviando email de bienvenida a: {}", to);
        String subject = "¡Bienvenido a Appsarion!";
        String textContent = "Hola " + userName + ",\n\n"
                + "¡Bienvenido a Appsarion! Nos alegra tenerlo con nosotros.\n\n"
                + "Atentamente,\n"
                + "Equipo Appsarion";

        sendSimpleEmail(to, subject, textContent);
    }

    /**
     * Envía notificación de certificado
     */
    public void sendCertificateNotification(String to, String userName, String certificateCode) {
        logger.info("Enviando notificación de certificado a: {}", to);
        String subject = "Tu Certificado está Listo";
        String textContent = "Hola " + userName + ",\n\n"
                + "¡Tu certificado ha sido generado exitosamente!\n"
                + "Código de certificado: " + certificateCode + "\n\n"
                + "Atentamente,\n"
                + "Equipo Appsarion";

        sendSimpleEmail(to, subject, textContent);
    }

    /**
     * Envía notificación de evaluación completada
     */
    public void sendEvaluationCompletedEmail(String to, String userName, int score, boolean passed) {
        logger.info("Enviando resultado de evaluación a: {}, puntuación: {}", to, score);
        String subject = passed ? "¡Felicitaciones! Has aprobado la evaluación" : "Resultado de tu evaluación";
        String textContent = "Hola " + userName + ",\n\n"
                + "Tu evaluación ha sido completada.\n"
                + "Puntuación: " + score + "%\n"
                + "Resultado: " + (passed ? "APROBADO ✓" : "NO APROBADO") + "\n\n"
                + "Atentamente,\n"
                + "Equipo Appsarion";

        sendSimpleEmail(to, subject, textContent);
    }

    /**
     * Envía email de verificación
     */
    public void sendVerificationEmail(String to, String userName, String verificationLink) {
        logger.info("Enviando email de verificación a: {}", to);
        String subject = "Verifica tu cuenta en Appsarion";
        String textContent = "Hola " + userName + ",\n\n"
                + "Por favor verifica tu cuenta usando el siguiente enlace:\n"
                + verificationLink + "\n\n"
                + "Atentamente,\n"
                + "Equipo Appsarion";

        sendSimpleEmail(to, subject, textContent);
    }

    /**
     * Envía email de restablecimiento de contraseña
     */
    public void sendPasswordResetEmail(String to, String userName, String resetLink) {
        logger.info("Enviando email de restablecimiento de contraseña a: {}", to);
        String subject = "Restablece tu contraseña en Appsarion";
        String textContent = "Hola " + userName + ",\n\n"
                + "Para restablecer tu contraseña, haz clic en el siguiente enlace:\n"
                + resetLink + "\n\n"
                + "Si no solicitaste esto, ignora este email.\n\n"
                + "Atentamente,\n"
                + "Equipo Appsarion";

        sendSimpleEmail(to, subject, textContent);
    }

    /**
     * Envía email personalizado
     */
    public void sendCustomEmail(String to, String subject, String htmlContent, String textContent) {
        logger.info("Enviando email personalizado a: {}, asunto: {}", to, subject);
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);

            if (htmlContent != null && !htmlContent.isEmpty()) {
                helper.setText(htmlContent, true);
            } else {
                helper.setText(textContent, false);
            }

            mailSender.send(message);
            logger.info("Email personalizado enviado exitosamente a: {}", to);
        } catch (MessagingException e) {
            logger.error("Error al enviar email personalizado a {}: {}", to, e.getMessage(), e);
            throw new RuntimeException("Error al enviar email personalizado: " + e.getMessage(), e);
        } catch (Exception e) {
            logger.error("Error inesperado al enviar email personalizado a {}: {}", to, e.getMessage(), e);
            throw new RuntimeException("Error al enviar email personalizado: " + e.getMessage(), e);
        }
    }

    /**
     * Envía email de aprobación de registro a un usuario
     */
    public void sendApprovalEmail(String to, String userName) {
        try {
            logger.info("Enviando email de aprobación a: {}", to);

            String subject = "¡Tu registro ha sido aprobado! - Appsarion";
            String htmlContent = "<!DOCTYPE html>\n" +
                    "<html>\n" +
                    "<head>\n" +
                    "    <meta charset=\"UTF-8\">\n" +
                    "</head>\n" +
                    "<body style=\"font-family: Arial, sans-serif; line-height: 1.6; color: #333;\">\n" +
                    "    <div style=\"max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;\">\n" +
                    "        <h2 style=\"color: #4caf50;\">¡Bienvenido a Appsarion!</h2>\n" +
                    "        <p>Hola " + userName + ",</p>\n" +
                    "        <p>Nos complace informarte que <strong>tu registro ha sido aprobado exitosamente</strong>. Ya puedes acceder a tu cuenta y comenzar a usar la plataforma.</p>\n" +
                    "        <p><strong>Datos de acceso:</strong></p>\n" +
                    "        <ul>\n" +
                    "            <li>Email: " + to + "</li>\n" +
                    "            <li>URL de acceso: <a href=\"http://localhost:3000/login\">Inicia sesión aquí</a></li>\n" +
                    "        </ul>\n" +
                    "        <p style=\"margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px; font-size: 12px; color: #999;\">\n" +
                    "            Si tienes problemas para acceder, contacta con nosotros en <a href=\"mailto:appsarion.unillanos@gmail.com\">appsarion.unillanos@gmail.com</a>\n" +
                    "        </p>\n" +
                    "        <p style=\"font-size: 12px; color: #999;\">© 2025 Appsarion. Todos los derechos reservados.</p>\n" +
                    "    </div>\n" +
                    "</body>\n" +
                    "</html>";

            sendHtmlEmail(to, subject, htmlContent);
            logger.info("Email de aprobación enviado exitosamente a: {}", to);
        } catch (Exception e) {
            logger.error("Error al enviar email de aprobación a {}: {}", to, e.getMessage(), e);
            throw new RuntimeException("Error al enviar email de aprobación", e);
        }
    }

    /**
     * Envía email de rechazo de registro a un usuario
     */
    public void sendRejectionEmail(String to, String userName, String rejectionReason) {
        try {
            logger.info("Enviando email de rechazo a: {}", to);

            String subject = "Estado de tu solicitud de registro - Appsarion";
            String htmlContent = "<!DOCTYPE html>\n" +
                    "<html>\n" +
                    "<head>\n" +
                    "    <meta charset=\"UTF-8\">\n" +
                    "</head>\n" +
                    "<body style=\"font-family: Arial, sans-serif; line-height: 1.6; color: #333;\">\n" +
                    "    <div style=\"max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;\">\n" +
                    "        <h2 style=\"color: #f44336;\">Estado de tu solicitud</h2>\n" +
                    "        <p>Hola " + userName + ",</p>\n" +
                    "        <p>Lamentamos informarte que <strong>tu solicitud de registro ha sido rechazada</strong> después de revisión por nuestro equipo.</p>\n" +
                    "        <p><strong>Motivo del rechazo:</strong></p>\n" +
                    "        <p style=\"background-color: #f5f5f5; padding: 10px; border-left: 4px solid #f44336;\">" + rejectionReason + "</p>\n" +
                    "        <p>Si crees que esto es un error o deseas apelar esta decisión, por favor contáctanos en <a href=\"mailto:appsarion.unillanos@gmail.com\">appsarion.unillanos@gmail.com</a></p>\n" +
                    "        <p style=\"margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px; font-size: 12px; color: #999;\">\n" +
                    "            © 2025 Appsarion. Todos los derechos reservados.\n" +
                    "        </p>\n" +
                    "    </div>\n" +
                    "</body>\n" +
                    "</html>";

            sendHtmlEmail(to, subject, htmlContent);
            logger.info("Email de rechazo enviado exitosamente a: {}", to);
        } catch (Exception e) {
            logger.error("Error al enviar email de rechazo a {}: {}", to, e.getMessage(), e);
            throw new RuntimeException("Error al enviar email de rechazo", e);
        }
    }
}
