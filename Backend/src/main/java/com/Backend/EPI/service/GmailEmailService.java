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
 * Implementación de EmailProvider usando Gmail SMTP
 * Utiliza credenciales de Gmail (appsarion.unillanos@gmail.com)
 */
@Service
public class GmailEmailService implements EmailProvider {

    private static final Logger logger = LoggerFactory.getLogger(GmailEmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Override
    public String getProviderName() {
        return "Gmail";
    }

    /**
     * Envía un email simple con contenido de texto plano
     */
    @Override
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
    @Override
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
    @Override
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
     * Envía email con parámetros avanzados (CC, BCC, Reply-To, etc.)
     */
    @Override
    public void sendAdvancedEmail(EmailParams params) {
        try {
            logger.info("Enviando email avanzado a: {}, asunto: {}",
                    String.join(", ", params.getTo()), params.getSubject());

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(params.getFrom() != null ? params.getFrom() : fromEmail);
            helper.setTo(params.getTo());

            if (params.getCc() != null && params.getCc().length > 0) {
                helper.setCc(params.getCc());
            }

            if (params.getBcc() != null && params.getBcc().length > 0) {
                helper.setBcc(params.getBcc());
            }

            if (params.getReplyTo() != null && params.getReplyTo().length > 0) {
                helper.setReplyTo(params.getReplyTo()[0]);
            }

            helper.setSubject(params.getSubject());
            helper.setText(params.getContent(), params.isHtml());

            mailSender.send(message);
            logger.info("Email avanzado enviado exitosamente");
        } catch (MessagingException e) {
            logger.error("Error al enviar email avanzado: {}", e.getMessage(), e);
            throw new RuntimeException("Error al enviar email avanzado: " + e.getMessage(), e);
        } catch (Exception e) {
            logger.error("Error inesperado al enviar email avanzado: {}", e.getMessage(), e);
            throw new RuntimeException("Error al enviar email avanzado: " + e.getMessage(), e);
        }
    }
}

