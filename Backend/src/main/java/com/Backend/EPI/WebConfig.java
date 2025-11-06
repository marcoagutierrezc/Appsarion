package com.Backend.EPI;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOriginPatterns("http://localhost:8081", "exp://*", "http://192.168.56.1:8081") // permite patrón y soporte para credenciales
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*");
                        //.allowCredentials(true);
            }

            @Override
            public void addViewControllers(ViewControllerRegistry registry) {
                // Mapea /reset-password -> forward al archivo estático /reset-password.html
                // Mantiene la URL original con el token en la query string
                registry.addViewController("/reset-password").setViewName("forward:/reset-password.html");
            }

            @Override
            public void addResourceHandlers(ResourceHandlerRegistry registry) {
                // Sirve imágenes desde classpath:/static/ y classpath:/
                registry.addResourceHandler("/*.png")
                        .addResourceLocations("classpath:/static/", "classpath:/");
                // Fallback general para recursos estáticos
                registry.addResourceHandler("/**")
                        .addResourceLocations("classpath:/static/", "classpath:/public/", "classpath:/resources/", "classpath:/META-INF/resources/");
            }
        };
    }
}
