package com.apextrader.api.service;

import com.apextrader.api.dto.OrderRequest;
import com.apextrader.api.exception.InsufficientFundsException;
import com.apextrader.api.exception.InvalidTradeException;
import com.apextrader.api.model.*;
import com.apextrader.api.repository.OrderRepository;
import com.apextrader.api.repository.PositionRepository;
import com.apextrader.api.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Optional;

/**
 * Unit 4: Business Logic Layer
 */
@Service
public class TradeService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final PositionRepository positionRepository;
    private final UserService userService;

    public TradeService(UserRepository userRepository, OrderRepository orderRepository,
                        PositionRepository positionRepository, UserService userService) {
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.positionRepository = positionRepository;
        this.userService = userService;
    }

    /**
     * Unit 3 & 4: Transaction Management
     * @Transactional ensures data integrity during trade executions
     * (e.g., deducting virtual cash and creating a trade record in a single atomic transaction).
     */
    @Transactional
    public Order executeOrder(OrderRequest request) {
        User user = userService.getUserById(request.getUserId());
        
        BigDecimal totalCostOrRevenue = request.getPrice().multiply(BigDecimal.valueOf(request.getQuantity()));
        
        Order order = Order.builder()
                .user(user)
                .symbol(request.getSymbol().toUpperCase())
                .quantity(request.getQuantity())
                .price(request.getPrice())
                .orderType(request.getOrderType())
                .status(OrderStatus.PENDING)
                .build();

        try {
            if (request.getOrderType() == OrderType.BUY) {
                processBuyOrder(user, request.getSymbol().toUpperCase(), request.getQuantity(), request.getPrice(), totalCostOrRevenue);
            } else if (request.getOrderType() == OrderType.SELL) {
                processSellOrder(user, request.getSymbol().toUpperCase(), request.getQuantity(), request.getPrice(), totalCostOrRevenue);
            }
            order.setStatus(OrderStatus.EXECUTED);
        } catch (Exception e) {
            order.setStatus(OrderStatus.REJECTED);
            orderRepository.save(order);
            throw e; // rethrow to let exception handler deal with it and rollback the position/balance changes
        }

        return orderRepository.save(order);
    }

    private void processBuyOrder(User user, String symbol, Integer quantity, BigDecimal price, BigDecimal totalCost) {
        if (user.getVirtualBalance().compareTo(totalCost) < 0) {
            throw new InsufficientFundsException("Not enough virtual balance to execute buy order");
        }

        user.setVirtualBalance(user.getVirtualBalance().subtract(totalCost));
        userRepository.save(user);

        Optional<Position> existingPositionOpt = positionRepository.findByUserAndSymbol(user, symbol);
        if (existingPositionOpt.isPresent()) {
            Position position = existingPositionOpt.get();
            // Calculate new average buy price
            BigDecimal oldTotalCost = position.getAvgBuyPrice().multiply(BigDecimal.valueOf(position.getQuantity()));
            BigDecimal newTotalCost = oldTotalCost.add(totalCost);
            Integer newQuantity = position.getQuantity() + quantity;
            
            position.setQuantity(newQuantity);
            position.setAvgBuyPrice(newTotalCost.divide(BigDecimal.valueOf(newQuantity), 2, RoundingMode.HALF_UP));
            positionRepository.save(position);
        } else {
            Position position = Position.builder()
                    .user(user)
                    .symbol(symbol)
                    .quantity(quantity)
                    .avgBuyPrice(price)
                    .build();
            positionRepository.save(position);
        }
    }

    private void processSellOrder(User user, String symbol, Integer quantity, BigDecimal price, BigDecimal totalRevenue) {
        Position position = positionRepository.findByUserAndSymbol(user, symbol)
                .orElseThrow(() -> new InvalidTradeException("You don't own any shares of " + symbol));

        if (position.getQuantity() < quantity) {
            throw new InvalidTradeException("Not enough shares to sell. You have " + position.getQuantity() + " shares.");
        }

        user.setVirtualBalance(user.getVirtualBalance().add(totalRevenue));
        userRepository.save(user);

        if (position.getQuantity().equals(quantity)) {
            positionRepository.delete(position);
        } else {
            position.setQuantity(position.getQuantity() - quantity);
            positionRepository.save(position);
        }
    }

    @Transactional(readOnly = true)
    public List<Order> getTradeHistory(Long userId) {
        userService.getUserById(userId); // ensure user exists
        return orderRepository.findTradeHistoryByUserId(userId);
    }
}
