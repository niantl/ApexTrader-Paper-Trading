package com.apextrader.api.service;

import com.apextrader.api.dto.PortfolioDto;
import com.apextrader.api.dto.PositionDto;
import com.apextrader.api.dto.UserCreateRequest;
import com.apextrader.api.exception.ResourceNotFoundException;
import com.apextrader.api.model.Position;
import com.apextrader.api.model.User;
import com.apextrader.api.repository.PositionRepository;
import com.apextrader.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Unit 4: Business Logic Layer
 * The @Service annotation marks this as a Spring-managed service bean.
 */
@Service
public class UserService {

    private final UserRepository userRepository;
    private final PositionRepository positionRepository;
    
    // Application Properties configuration injected via @Value
    @Value("${apextrader.trading.default-virtual-balance:100000.00}")
    private BigDecimal defaultVirtualBalance;

    public UserService(UserRepository userRepository, PositionRepository positionRepository) {
        this.userRepository = userRepository;
        this.positionRepository = positionRepository;
    }

    @Transactional
    public User createUser(UserCreateRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username already exists");
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already exists");
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .virtualBalance(defaultVirtualBalance)
                .build();

        return userRepository.save(user);
    }

    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
    }

    @Transactional(readOnly = true)
    public PortfolioDto getUserPortfolio(Long userId) {
        User user = getUserById(userId);
        List<Position> positions = positionRepository.findByUser(user);

        List<PositionDto> positionDtos = positions.stream()
                .map(pos -> PositionDto.builder()
                        .symbol(pos.getSymbol())
                        .quantity(pos.getQuantity())
                        .avgBuyPrice(pos.getAvgBuyPrice())
                        .build())
                .collect(Collectors.toList());

        // Simple mock valuation based on avgBuyPrice instead of real-time market data
        BigDecimal estimatedTotalValue = positions.stream()
                .map(p -> p.getAvgBuyPrice().multiply(BigDecimal.valueOf(p.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .add(user.getVirtualBalance());

        return PortfolioDto.builder()
                .userId(user.getId())
                .virtualBalance(user.getVirtualBalance())
                .positions(positionDtos)
                .estimatedTotalValue(estimatedTotalValue)
                .build();
    }
}
