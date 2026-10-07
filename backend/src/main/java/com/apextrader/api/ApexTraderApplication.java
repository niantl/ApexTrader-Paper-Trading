package com.apextrader.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Unit 4: Skeleton Web App & Auto-configuration
 * The @SpringBootApplication annotation leverages Spring Boot Auto-configuration,
 * automatically setting up beans based on classpath dependencies (e.g., Tomcat, JPA).
 */
@SpringBootApplication
public class ApexTraderApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApexTraderApplication.class, args);
    }

}
