package com.apextrader.api.service;

import com.apextrader.api.dto.OrderRequest;
import com.apextrader.api.exception.InsufficientFundsException;
import com.apextrader.api.exception.InvalidTradeException;
import com.apextrader.api.model.*;
import com.apextrader.api.repository.OrderRepository;
import com.apextrader.api.repository.PositionRepository;
import com.apextrader.api.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit 4: Testing Basics in Spring Boot (Unit Testing)
 * Implement unit tests using JUnit 5 and @InjectMocks / @Mock (Mockito)
 * for testing trading rules in the business service layer.
 */
@ExtendWith(MockitoExtension.class)
public class TradeServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private PositionRepository positionRepository;

    @Mock
    private UserService userService;

    @InjectMocks
    private TradeService tradeService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .username("testuser")
                .virtualBalance(new BigDecimal("10000.00"))
                .build();
    }

    @Test
    void executeOrder_BuySuccess() {
        // Arrange
        OrderRequest request = OrderRequest.builder()
                .userId(1L)
                .symbol("AAPL")
                .quantity(10)
                .price(new BigDecimal("150.00"))
                .orderType(OrderType.BUY)
                .build();

        when(userService.getUserById(1L)).thenReturn(testUser);
        when(positionRepository.findByUserAndSymbol(testUser, "AAPL")).thenReturn(Optional.empty());
        when(orderRepository.save(any(Order.class))).thenAnswer(i -> i.getArguments()[0]);

        // Act
        Order executedOrder = tradeService.executeOrder(request);

        // Assert
        assertEquals(OrderStatus.EXECUTED, executedOrder.getStatus());
        assertEquals(new BigDecimal("8500.00"), testUser.getVirtualBalance()); // 10000 - (10 * 150)
        verify(userRepository, times(1)).save(testUser);
        verify(positionRepository, times(1)).save(any(Position.class));
    }

    @Test
    void executeOrder_BuyInsufficientFunds() {
        // Arrange
        OrderRequest request = OrderRequest.builder()
                .userId(1L)
                .symbol("AAPL")
                .quantity(100)
                .price(new BigDecimal("150.00")) // Cost = 15000, balance = 10000
                .orderType(OrderType.BUY)
                .build();

        when(userService.getUserById(1L)).thenReturn(testUser);
        when(orderRepository.save(any(Order.class))).thenAnswer(i -> i.getArguments()[0]);

        // Act & Assert
        assertThrows(InsufficientFundsException.class, () -> tradeService.executeOrder(request));
        
        // Ensure virtual balance wasn't deducted
        assertEquals(new BigDecimal("10000.00"), testUser.getVirtualBalance());
    }
    
    @Test
    void executeOrder_SellSuccess() {
        // Arrange
        OrderRequest request = OrderRequest.builder()
                .userId(1L)
                .symbol("AAPL")
                .quantity(5)
                .price(new BigDecimal("160.00"))
                .orderType(OrderType.SELL)
                .build();

        Position existingPosition = Position.builder()
                .user(testUser)
                .symbol("AAPL")
                .quantity(10)
                .avgBuyPrice(new BigDecimal("150.00"))
                .build();

        when(userService.getUserById(1L)).thenReturn(testUser);
        when(positionRepository.findByUserAndSymbol(testUser, "AAPL")).thenReturn(Optional.of(existingPosition));
        when(orderRepository.save(any(Order.class))).thenAnswer(i -> i.getArguments()[0]);

        // Act
        Order executedOrder = tradeService.executeOrder(request);

        // Assert
        assertEquals(OrderStatus.EXECUTED, executedOrder.getStatus());
        assertEquals(new BigDecimal("10800.00"), testUser.getVirtualBalance()); // 10000 + (5 * 160)
        assertEquals(5, existingPosition.getQuantity()); // 10 - 5
        verify(userRepository, times(1)).save(testUser);
        verify(positionRepository, times(1)).save(existingPosition);
    }

    @Test
    void executeOrder_SellInvalidTrade() {
        // Arrange
        OrderRequest request = OrderRequest.builder()
                .userId(1L)
                .symbol("TSLA") // Don't own TSLA
                .quantity(5)
                .price(new BigDecimal("200.00"))
                .orderType(OrderType.SELL)
                .build();

        when(userService.getUserById(1L)).thenReturn(testUser);
        when(positionRepository.findByUserAndSymbol(testUser, "TSLA")).thenReturn(Optional.empty());
        when(orderRepository.save(any(Order.class))).thenAnswer(i -> i.getArguments()[0]);

        // Act & Assert
        assertThrows(InvalidTradeException.class, () -> tradeService.executeOrder(request));
    }
}
