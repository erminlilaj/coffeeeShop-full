package com.ms_coffeeShop.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "jwt")
@Data
public class JwtConfig {
    private String secret = "f429ec54f354b72bed77a5c0afedecb91f347f479a09f74f4107592764b56d1c";
    private long expiration = 86400000; // 24 hours
}