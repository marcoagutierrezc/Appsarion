package com.Backend.EPI.service;

/**
 * Servicio centralizado para generar templates de email con formato consistente
 * Usa azul medio oscuro, logo de Appsarion y estructura uniforme
 */
public class EmailTemplateService {

    private static final String PRIMARY_COLOR = "#1e3a8a"; // Azul medio oscuro
    private static final String SECONDARY_COLOR = "#3b82f6"; // Azul más claro
    private static final String TEXT_COLOR = "#374151"; // Gris oscuro
    private static final String BORDER_COLOR = "#e5e7eb"; // Gris claro
    // Logo desde GitHub - URL raw para descargar la imagen directamente
    private static final String LOGO_URL_BASE = "https://raw.githubusercontent.com/HernanQuijano/Appsarion/main/Backend/src/main/resources/LogoName.png";

    /**
     * Genera un template HTML básico con el formato de Appsarion
     */
    public static String getEmailTemplate(String title, String content, String actionButtonText, String actionButtonUrl) {
        return "<!DOCTYPE html>\n" +
                "<html>\n" +
                "<head>\n" +
                "    <meta charset=\"UTF-8\">\n" +
                "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
                "    <style>\n" +
                "        body {\n" +
                "            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;\n" +
                "            line-height: 1.6;\n" +
                "            color: " + TEXT_COLOR + ";\n" +
                "            background-color: #f9fafb;\n" +
                "            margin: 0;\n" +
                "            padding: 0;\n" +
                "        }\n" +
                "        .container {\n" +
                "            max-width: 600px;\n" +
                "            margin: 0 auto;\n" +
                "            background-color: #ffffff;\n" +
                "            border-radius: 8px;\n" +
                "            overflow: hidden;\n" +
                "            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);\n" +
                "        }\n" +
                "        .header {\n" +
                "            background: linear-gradient(135deg, " + PRIMARY_COLOR + " 0%, " + SECONDARY_COLOR + " 100%);\n" +
                "            padding: 40px 20px;\n" +
                "            text-align: center;\n" +
                "        }\n" +
                "        .logo {\n" +
                "            height: 100px;\n" +
                "            width: auto;\n" +
                "            margin-bottom: 15px;\n" +
                "            display: inline-block;\n" +
                "        }\n" +
                "        .header h1 {\n" +
                "            color: #ffffff;\n" +
                "            margin: 0;\n" +
                "            font-size: 24px;\n" +
                "            font-weight: 600;\n" +
                "        }\n" +
                "        .content {\n" +
                "            padding: 45px 35px;\n" +
                "        }\n" +
                "        .content h2 {\n" +
                "            color: " + PRIMARY_COLOR + ";\n" +
                "            font-size: 26px;\n" +
                "            margin-top: 0;\n" +
                "            margin-bottom: 25px;\n" +
                "            font-weight: 700;\n" +
                "        }\n" +
                "        .content p {\n" +
                "            color: " + TEXT_COLOR + ";\n" +
                "            margin: 0 0 18px 0;\n" +
                "            font-size: 16px;\n" +
                "            line-height: 1.7;\n" +
                "        }\n" +
                "        .action-button {\n" +
                "            display: inline-block;\n" +
                "            background-color: " + SECONDARY_COLOR + ";\n" +
                "            color: #ffffff !important;\n" +
                "            padding: 16px 36px;\n" +
                "            text-decoration: none !important;\n" +
                "            border-radius: 8px;\n" +
                "            font-weight: 700;\n" +
                "            font-size: 18px;\n" +
                "            margin: 25px 0;\n" +
                "            transition: all 0.3s ease;\n" +
                "            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);\n" +
                "            display: inline-block;\n" +
                "            border: none;\n" +
                "            cursor: pointer;\n" +
                "        }\n" +
                "        .action-button:hover {\n" +
                "            background-color: " + PRIMARY_COLOR + ";\n" +
                "            color: #ffffff !important;\n" +
                "            box-shadow: 0 6px 16px rgba(30, 58, 138, 0.5);\n" +
                "            transform: translateY(-2px);\n" +
                "        }\n" +
                "        .info-box {\n" +
                "            background-color: #eff6ff;\n" +
                "            border-left: 5px solid " + PRIMARY_COLOR + ";\n" +
                "            padding: 18px 20px;\n" +
                "            border-radius: 6px;\n" +
                "            margin: 25px 0;\n" +
                "            font-size: 15px;\n" +
                "            color: " + TEXT_COLOR + ";\n" +
                "            line-height: 1.6;\n" +
                "        }\n" +
                "        .footer {\n" +
                "            background-color: #f9fafb;\n" +
                "            padding: 30px;\n" +
                "            text-align: center;\n" +
                "            border-top: 1px solid " + BORDER_COLOR + ";\n" +
                "        }\n" +
                "        .footer p {\n" +
                "            color: #6b7280;\n" +
                "            font-size: 13px;\n" +
                "            margin: 8px 0;\n" +
                "        }\n" +
                "        .footer a {\n" +
                "            color: " + PRIMARY_COLOR + ";\n" +
                "            text-decoration: none;\n" +
                "        }\n" +
                "        .footer a:hover {\n" +
                "            text-decoration: underline;\n" +
                "        }\n" +
                "    </style>\n" +
                "</head>\n" +
                "<body>\n" +
                "    <div class=\"container\">\n" +
                "        <div class=\"header\">\n" +
                "            <img src=\"" + LOGO_URL_BASE + "\" alt=\"Appsarion\" class=\"logo\">\n" +
                "            <h1>" + title + "</h1>\n" +
                "        </div>\n" +
                "        <div class=\"content\">\n" +
                "            " + content + "\n" +
                (actionButtonText != null && !actionButtonText.isEmpty() ?
                    "            <a href=\"" + actionButtonUrl + "\" class=\"action-button\">" + actionButtonText + "</a>\n" : "") +
                "        </div>\n" +
                "        <div class=\"footer\">\n" +
                "            <p><strong>Appsarion</strong></p>\n" +
                "            <p>Sistema de Información de Piscicultura</p>\n" +
                "            <p style=\"margin-top: 15px; color: #9ca3af;\">© 2025 Appsarion. Todos los derechos reservados.</p>\n" +
                "        </div>\n" +
                "    </div>\n" +
                "</body>\n" +
                "</html>";
    }

    /**
     * Template para email de contraseña restablecida exitosamente
     */
    public static String getPasswordResetSuccessTemplate(String userName) {
        String content = "<h2>✅ ¡Contraseña Restablecida!</h2>\n" +
                "<p>Tu contraseña ha sido restablecida <strong>exitosamente</strong>.</p>\n" +
                "<p>Ya puedes iniciar sesión en Appsarion con tu nueva contraseña.</p>\n" +
                "<div class=\"info-box\">\n" +
                "    <strong>📌 Información de seguridad:</strong>\n" +
                "    <p style=\"margin-bottom: 0; margin-top: 10px;\">• Tu contraseña anterior ha sido desactivada</p>\n" +
                "    <p style=\"margin-bottom: 0; margin-top: 5px;\">• Solo tú tendrás acceso con la nueva contraseña</p>\n" +
                "    <p style=\"margin-bottom: 0; margin-top: 5px;\">• Recomendamos no compartir tu contraseña</p>\n" +
                "</div>\n" +
                "<p style=\"margin-top: 25px; padding: 18px; background-color: #fef2f2; border-left: 5px solid #dc2626; border-radius: 6px; color: #7f1d1d;\">\n" +
                "    <strong>⚠️ Importante:</strong> Si <strong>NO</strong> solicitaste cambiar tu contraseña, por favor <strong>contacta con nosotros inmediatamente</strong>.\n" +
                "</p>";

        return getEmailTemplate("Contraseña Restablecida", content, null, null);
    }

    /**
     * Template para email de recuperación de contraseña
     */
    public static String getPasswordResetTemplate(String userName, String resetLink) {
        String content = "<h2>¡Hola " + userName + "!</h2>\n" +
                "<p>Hemos recibido una solicitud para restablecer tu contraseña.</p>\n" +
                "<p>Haz clic en el botón de abajo para crear una nueva contraseña:</p>\n" +
                "<div style=\"text-align: center;\">\n" +
                "    <a href=\"" + resetLink + "\" class=\"action-button\">Restablecer Contraseña</a>\n" +
                "</div>\n" +
                "<div class=\"info-box\">\n" +
                "    <strong>⏱️ Importante:</strong> Este enlace es válido solo por 10 minutos por razones de seguridad.\n" +
                "</div>\n" +
                "<p>Si no solicitaste este cambio, puedes ignorar este email. Tu contraseña permanecerá sin cambios.</p>";

        return getEmailTemplate("Recupera tu Contraseña", content, null, null);
    }

    /**
     * Template para email de aprobación de usuario
     */
    public static String getApprovalTemplate(String userName) {
        String content = "<h2>¡Bienvenido " + userName + "!</h2>\n" +
                "<p>Tu solicitud de registro ha sido <strong>aprobada exitosamente</strong> ✅</p>\n" +
                "<p>Ya puedes acceder a la plataforma Appsarion con tus credenciales.</p>\n" +
                "<div class=\"info-box\">\n" +
                "    <strong>📌 Próximos pasos:</strong>\n" +
                "    <p style=\"margin-bottom: 0;\">1. Inicia sesión en la plataforma</p>\n" +
                "    <p style=\"margin-bottom: 0;\">2. Completa tu perfil</p>\n" +
                "    <p style=\"margin-bottom: 0;\">3. Comienza a usar los servicios</p>\n" +
                "</div>\n" +
                "<p>Si tienes alguna pregunta o necesitas asistencia, no dudes en contactarnos.</p>";

        return getEmailTemplate("¡Cuenta Aprobada!", content, null, null);
    }

    /**
     * Template para email de rechazo de usuario
     */
    public static String getRejectionTemplate(String userName, String rejectionReason) {
        String content = "<h2>Estimado " + userName + ",</h2>\n" +
                "<p>Lamentablemente, tu solicitud de registro ha sido <strong>rechazada</strong>.</p>\n" +
                "<div class=\"info-box\">\n" +
                "    <strong>📋 Motivo:</strong>\n" +
                "    <p style=\"margin-bottom: 0;\">" + rejectionReason + "</p>\n" +
                "</div>\n" +
                "<p>Si crees que esto es un error o deseas más información sobre cómo resolver esto, por favor contacta con nuestro equipo de soporte.</p>\n" +
                "<p>Estaremos encantados de ayudarte.</p>";

        return getEmailTemplate("Actualización sobre tu Solicitud", content, null, null);
    }

    /**
     * Template para email de PQR (Petición, Queja, Reclamo)
     */
    public static String getPQRConfirmationTemplate(String userName, String pqrType, String trackingNumber) {
        String content = "<h2>Gracias por contactarnos, " + userName + "</h2>\n" +
                "<p>Hemos recibido tu " + pqrType + " correctamente.</p>\n" +
                "<div class=\"info-box\">\n" +
                "    <strong>📊 Número de Seguimiento:</strong>\n" +
                "    <p style=\"margin-bottom: 0; font-weight: 600; font-size: 16px;\">" + trackingNumber + "</p>\n" +
                "</div>\n" +
                "<p>Nuestro equipo revisará tu solicitud y te contactaremos en los próximos 2-3 días hábiles.</p>\n" +
                "<p>Puedes usar el número de seguimiento arriba para rastrear el estado de tu " + pqrType + ".</p>";

        return getEmailTemplate("Hemos Recibido tu Solicitud", content, null, null);
    }

    /**
     * Template para email de bienvenida general
     */
    public static String getWelcomeTemplate(String userName) {
        String content = "<h2>¡Bienvenido a Appsarion, " + userName + "!</h2>\n" +
                "<p>Es un placer tenerte como parte de nuestra comunidad.</p>\n" +
                "<p>Appsarion es el sistema integral de información para la gestión de piscicultura. Aquí podrás:</p>\n" +
                "<div class=\"info-box\">\n" +
                "    <p style=\"margin: 0 0 10px 0;\">✓ Gestionar datos de tus piscinas</p>\n" +
                "    <p style=\"margin: 0 0 10px 0;\">✓ Registrar evaluaciones y seguimiento</p>\n" +
                "    <p style=\"margin: 0 0 10px 0;\">✓ Acceder a reportes y análisis</p>\n" +
                "    <p style=\"margin: 0;\">✓ Colaborar con otros usuarios</p>\n" +
                "</div>\n" +
                "<p>Si tienes alguna pregunta o necesitas ayuda, nuestro equipo de soporte está disponible.</p>";

        return getEmailTemplate("¡Bienvenido a Appsarion!", content, null, null);
    }

    /**
     * Template genérico con contenido personalizado
     */
    public static String getCustomTemplate(String title, String contentHtml) {
        return getEmailTemplate(title, contentHtml, null, null);
    }

    /**
     * Template genérico con botón de acción
     */
    public static String getCustomTemplateWithButton(String title, String contentHtml, String buttonText, String buttonUrl) {
        return getEmailTemplate(title, contentHtml, buttonText, buttonUrl);
    }
}

