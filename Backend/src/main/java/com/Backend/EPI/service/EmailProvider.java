package com.Backend.EPI.service;

/**
 * Interfaz para proveedores de email
 * Permite cambiar entre diferentes servicios de email (Gmail, Resend, etc.)
 */
public interface EmailProvider {

    /**
     * Envía un email simple con contenido de texto plano
     *
     * @param to       Dirección de email del destinatario
     * @param subject  Asunto del email
     * @param textContent Contenido de texto plano
     */
    void sendSimpleEmail(String to, String subject, String textContent);

    /**
     * Envía un email con contenido HTML
     *
     * @param to          Dirección de email del destinatario
     * @param subject     Asunto del email
     * @param htmlContent Contenido HTML
     */
    void sendHtmlEmail(String to, String subject, String htmlContent);

    /**
     * Envía email a múltiples destinatarios
     *
     * @param recipients  Array de direcciones de email
     * @param subject     Asunto del email
     * @param htmlContent Contenido HTML
     */
    void sendEmailToMultiple(String[] recipients, String subject, String htmlContent);

    /**
     * Envía email con parámetros avanzados
     *
     * @param params Parámetros avanzados del email (CC, BCC, Reply-To, etc.)
     */
    void sendAdvancedEmail(EmailParams params);

    /**
     * Obtiene el nombre del proveedor
     *
     * @return Nombre del proveedor (Gmail, Resend, etc.)
     */
    String getProviderName();
}

