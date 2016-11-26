package com.controle;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class StageProjectFrontApplication {

	public static void main(String[] args) {
		SpringApplication.run(StageProjectFrontApplication.class, args);
		System.out.println(new BCryptPasswordEncoder().encode("123456789"));
	}
	
	
}
