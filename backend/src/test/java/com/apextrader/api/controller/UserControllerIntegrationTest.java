package com.apextrader.api.controller;

import com.apextrader.api.dto.UserCreateRequest;
import com.apextrader.api.model.User;
import com.apextrader.api.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Unit 4: Testing Basics in Spring Boot (Integration Testing)
 * Write integration tests using @SpringBootTest and @AutoConfigureMockMvc / MockMvc
 * to verify REST API responses and HTTP status codes (e.g., 200 OK, 201 Created, 400 Bad Request).
 */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional // Rollback after each test
public class UserControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    @Test
    void createUser_Returns201Created() throws Exception {
        UserCreateRequest request = UserCreateRequest.builder()
                .username("newtrader")
                .email("newtrader@example.com")
                .build();

        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.username").value("newtrader"))
                .andExpect(jsonPath("$.email").value("newtrader@example.com"))
                .andExpect(jsonPath("$.virtualBalance").value(100000.0));
    }

    @Test
    void createUser_InvalidEmail_Returns400BadRequest() throws Exception {
        UserCreateRequest request = UserCreateRequest.builder()
                .username("newtrader")
                .email("invalid-email") // Invalid
                .build();

        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.email").exists());
    }

    @Test
    void getUserPortfolio_Returns200OK() throws Exception {
        // Create user directly in DB
        User user = User.builder()
                .username("portfolioUser")
                .email("portfolio@example.com")
                .virtualBalance(new BigDecimal("100000.00"))
                .build();
        user = userRepository.save(user);

        mockMvc.perform(get("/api/users/" + user.getId() + "/portfolio")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value(user.getId()))
                .andExpect(jsonPath("$.virtualBalance").value(100000.0));
    }
    
    @Test
    void getUserPortfolio_UserNotFound_Returns404NotFound() throws Exception {
        mockMvc.perform(get("/api/users/999/portfolio") // Non-existent ID
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").exists());
    }
}
