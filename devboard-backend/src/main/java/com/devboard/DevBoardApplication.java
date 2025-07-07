package com.devboard;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DevBoardApplication {

	public static void main(String[] args) {
		SpringApplication.run(DevBoardApplication.class, args);
		System.out.println("🟢 Application started with CORS patch");

	}

}
