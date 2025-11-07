package com.Backend.EPI.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import com.resend.services.emails.model.CreateEmailResponse;

/**
 * Implementación de EmailProvider usando Resend SDK
 * Resend es un servicio moderno de envío de emails
 *
 * Utiliza la SDK oficial de Resend con Render
 */
@Service
public class ResendEmailService implements EmailProvider {

    private static final Logger logger = LoggerFactory.getLogger(ResendEmailService.class);
    private static final String DEFAULT_FROM_EMAIL = "Appsarion <onboarding@resend.dev>";

    private Resend resend;

    @Value("${resend.api-key:}")
    private String resendApiKey;

    /**
     * Inicializa el cliente de Resend
     */
    private void initialize() {
        if (this.resend == null && resendApiKey != null && !resendApiKey.isEmpty()) {
            this.resend = new Resend(resendApiKey);
            logger.info("Cliente Resend inicializado con API key");
        }
    }

    @Override
    public String getProviderName() {
        return "Resend";
    }

    /**
     * Envía un email simple con contenido de texto plano
     */
    @Override
    public void sendSimpleEmail(String to, String subject, String textContent) {
        try {
            initialize();
            logger.info("Enviando email simple a: {}, asunto: {}", to, subject);

            CreateEmailOptions request = CreateEmailOptions.builder()
                    .from(DEFAULT_FROM_EMAIL)
                    .to(to)
                    .subject(subject)
                    .text(textContent)
                    .build();

            CreateEmailResponse response = resend.emails().send(request);
            logger.info("Email enviado exitosamente a: {}, ID: {}", to, response.getId());
        } catch (ResendException e) {
            logger.error("Error de Resend al enviar email simple a {}: {}", to, e.getMessage(), e);
            throw new RuntimeException("Error al enviar email a " + to + ": " + e.getMessage(), e);
        } catch (Exception e) {
            logger.error("Error inesperado al enviar email simple a {}: {}", to, e.getMessage(), e);
            throw new RuntimeException("Error al enviar email a " + to + ": " + e.getMessage(), e);
        }
    }

    /**
     * Envía un email con contenido HTML
     */
    @Override
    public void sendHtmlEmail(String to, String subject, String htmlContent) {
        try {
            initialize();
            logger.info("Enviando email HTML a: {}, asunto: {}", to, subject);

            CreateEmailOptions request = CreateEmailOptions.builder()
                    .from(DEFAULT_FROM_EMAIL)
                    .to(to)
                    .subject(subject)
                    .html(htmlContent)
                    .build();

            CreateEmailResponse response = resend.emails().send(request);
            logger.info("Email HTML enviado exitosamente a: {}, ID: {}", to, response.getId());
        } catch (ResendException e) {
            logger.error("Error de Resend al enviar email HTML a {}: {}", to, e.getMessage(), e);
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
            initialize();
            logger.info("Enviando email a múltiples destinatarios: {}, asunto: {}", recipients.length, subject);

            CreateEmailOptions request = CreateEmailOptions.builder()
                    .from(DEFAULT_FROM_EMAIL)
                    .to(recipients)
                    .subject(subject)
                    .html(htmlContent)
                    .build();

            CreateEmailResponse response = resend.emails().send(request);
            logger.info("Email enviado exitosamente a {} destinatarios, ID: {}", recipients.length, response.getId());
        } catch (ResendException e) {
            logger.error("Error de Resend al enviar email a múltiples destinatarios: {}", e.getMessage(), e);
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
            initialize();
            logger.info("Enviando email avanzado a: {}, asunto: {}",
                    String.join(", ", params.getTo()), params.getSubject());

            // Construir el request base
            CreateEmailOptions.Builder builder = CreateEmailOptions.builder()
                    .from(DEFAULT_FROM_EMAIL)
                    .to(params.getTo())
                    .subject(params.getSubject());


            // Agregar contenido (HTML o texto plano)
            if (params.isHtml() && params.getHtmlContent() != null) {
                builder.html(params.getHtmlContent());
            } else if (params.getTextContent() != null) {
                builder.text(params.getTextContent());
            }

            CreateEmailResponse response = resend.emails().send(builder.build());
            logger.info("Email avanzado enviado exitosamente, ID: {}", response.getId());
        } catch (ResendException e) {
            logger.error("Error de Resend al enviar email avanzado: {}", e.getMessage(), e);
            throw new RuntimeException("Error al enviar email avanzado: " + e.getMessage(), e);
        } catch (Exception e) {
            logger.error("Error inesperado al enviar email avanzado: {}", e.getMessage(), e);
            throw new RuntimeException("Error al enviar email avanzado: " + e.getMessage(), e);
        }
    }
}

