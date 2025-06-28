package com.Backend.EPI.service;

import com.Backend.EPI.persistence.entity.FormData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendPqrEmail(FormData formData) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo("appsarion.unillanos@gmail.com");
        message.setSubject("PQR: " + formData.getAsunto());
        message.setText(
                "Nombre: " + formData.getNombre() + "\n" +
                        "Email: " + formData.getEmail() + "\n" +
                        "Número: " + formData.getNumero() + "\n\n" +
                        "Mensaje:\n" + formData.getMensaje()
        );

        mailSender.send(message);
    }
}