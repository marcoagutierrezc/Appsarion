package com.Backend.EPI.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Factory para gestionar el proveedor de email
 * Permite cambiar entre Gmail y Resend configurando una propiedad
 * en application.properties o application.yml
 *
 * Configuración en application.properties:
 * - email.provider=gmail (por defecto)
 * - email.provider=resend
 */
@Component
public class EmailProviderFactory {

    private static final Logger logger = LoggerFactory.getLogger(EmailProviderFactory.class);

    @Autowired
    private GmailEmailService gmailEmailService;

    @Autowired
    private ResendEmailService resendEmailService;

    @Value("${email.provider:gmail}")
    private String emailProvider;

    /**
     * Obtiene la implementación del proveedor de email configurado
     *
     * @return Implementación de EmailProvider
     */
    public EmailProvider getEmailProvider() {
        logger.info("Usando proveedor de email: {}", emailProvider);

        return switch (emailProvider.toLowerCase()) {
            case "resend" -> {
                logger.info("Inicializando ResendEmailService");
                yield resendEmailService;
            }
            case "gmail" -> {
                logger.info("Inicializando GmailEmailService");
                yield gmailEmailService;
            }
            default -> {
                logger.warn("Proveedor de email '{}' no reconocido. Usando Gmail por defecto.", emailProvider);
                yield gmailEmailService;
            }
        };
    }

    /**
     * Obtiene el nombre del proveedor actualmente configurado
     *
     * @return Nombre del proveedor
     */
    public String getProviderName() {
        return getEmailProvider().getProviderName();
    }

    /**
     * Cambia el proveedor de email en tiempo de ejecución
     * (Útil para testing)
     *
     * @param provider Nombre del proveedor (gmail, resend)
     */
    public void setEmailProvider(String provider) {
        this.emailProvider = provider;
        logger.info("Proveedor de email cambiado a: {}", provider);
    }
}

