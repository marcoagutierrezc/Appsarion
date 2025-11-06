package com.Backend.EPI.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Controller para servir páginas estáticas
 * Las páginas HTML se sirven automáticamente desde src/main/resources/static/
 */
@Controller
public class ViewController {

    /**
     * Ruta raíz (para debugging)
     */
    @GetMapping("/")
    public String home() {
        return "redirect:/api/emails/test";
    }
}

