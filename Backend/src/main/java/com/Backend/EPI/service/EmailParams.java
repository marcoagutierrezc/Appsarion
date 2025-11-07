package com.Backend.EPI.service;

/**
 * Clase para parámetros avanzados de email
 * Permite enviar emails con CC, BCC, Reply-To, etc.
 */
public class EmailParams {
    private String from;
    private String[] to;
    private String[] cc;
    private String[] bcc;
    private String[] replyTo;
    private String subject;
    private String textContent;
    private String htmlContent;
    private boolean isHtml;

    public EmailParams() {
        this.isHtml = false;
    }

    // Builder pattern para facilitar la creación
    public static EmailParamsBuilder builder() {
        return new EmailParamsBuilder();
    }

    public static class EmailParamsBuilder {
        private String from;
        private String[] to;
        private String[] cc;
        private String[] bcc;
        private String[] replyTo;
        private String subject;
        private String textContent;
        private String htmlContent;
        private boolean isHtml;

        public EmailParamsBuilder from(String from) {
            this.from = from;
            return this;
        }

        public EmailParamsBuilder to(String... to) {
            this.to = to;
            return this;
        }

        public EmailParamsBuilder cc(String... cc) {
            this.cc = cc;
            return this;
        }

        public EmailParamsBuilder bcc(String... bcc) {
            this.bcc = bcc;
            return this;
        }

        public EmailParamsBuilder replyTo(String... replyTo) {
            this.replyTo = replyTo;
            return this;
        }

        public EmailParamsBuilder subject(String subject) {
            this.subject = subject;
            return this;
        }

        public EmailParamsBuilder textContent(String textContent) {
            this.textContent = textContent;
            this.isHtml = false;
            return this;
        }

        public EmailParamsBuilder htmlContent(String htmlContent) {
            this.htmlContent = htmlContent;
            this.isHtml = true;
            return this;
        }

        public EmailParams build() {
            EmailParams params = new EmailParams();
            params.from = this.from;
            params.to = this.to;
            params.cc = this.cc;
            params.bcc = this.bcc;
            params.replyTo = this.replyTo;
            params.subject = this.subject;
            params.textContent = this.textContent;
            params.htmlContent = this.htmlContent;
            params.isHtml = this.isHtml;
            return params;
        }
    }

    // Getters y Setters
    public String getFrom() {
        return from;
    }

    public void setFrom(String from) {
        this.from = from;
    }

    public String[] getTo() {
        return to;
    }

    public void setTo(String[] to) {
        this.to = to;
    }

    public String[] getCc() {
        return cc;
    }

    public void setCc(String[] cc) {
        this.cc = cc;
    }

    public String[] getBcc() {
        return bcc;
    }

    public void setBcc(String[] bcc) {
        this.bcc = bcc;
    }

    public String[] getReplyTo() {
        return replyTo;
    }

    public void setReplyTo(String[] replyTo) {
        this.replyTo = replyTo;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getTextContent() {
        return textContent;
    }

    public void setTextContent(String textContent) {
        this.textContent = textContent;
    }

    public String getHtmlContent() {
        return htmlContent;
    }

    public void setHtmlContent(String htmlContent) {
        this.htmlContent = htmlContent;
    }

    public boolean isHtml() {
        return isHtml;
    }

    public void setHtml(boolean html) {
        isHtml = html;
    }

    public String getContent() {
        return isHtml ? htmlContent : textContent;
    }
}

