package com.apextrader.api.controller;

import com.apextrader.api.dto.PortfolioDto;
import com.apextrader.api.dto.UserCreateRequest;
import com.apextrader.api.model.User;
import com.apextrader.api.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Unit 4: Presentation Layer (@RestController)
 * HTTP endpoints handling requests, validating inputs (@Valid),
 * and mapping to JSON payloads.
 */
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<User> createUser(@Valid @RequestBody UserCreateRequest request) {
        User createdUser = userService.createUser(request);
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }

    @GetMapping("/{userId}/portfolio")
    public ResponseEntity<PortfolioDto> getUserPortfolio(@PathVariable Long userId) {
        PortfolioDto portfolio = userService.getUserPortfolio(userId);
        return ResponseEntity.ok(portfolio);
    }
}
