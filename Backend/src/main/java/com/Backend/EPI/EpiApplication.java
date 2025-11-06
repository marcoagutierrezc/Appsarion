package com.Backend.EPI;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class EpiApplication {

	public static void main(String[] args) {
		SpringApplication.run(EpiApplication.class, args);
	}

}
