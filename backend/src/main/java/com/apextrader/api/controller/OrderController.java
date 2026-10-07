package com.apextrader.api.controller;

import com.apextrader.api.dto.OrderRequest;
import com.apextrader.api.model.Order;
import com.apextrader.api.service.TradeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Unit 4: Presentation Layer
 */
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final TradeService tradeService;

    public OrderController(TradeService tradeService) {
        this.tradeService = tradeService;
    }

    @PostMapping("/execute")
    public ResponseEntity<Order> executeOrder(@Valid @RequestBody OrderRequest request) {
        Order executedOrder = tradeService.executeOrder(request);
        return new ResponseEntity<>(executedOrder, HttpStatus.CREATED);
    }

    @GetMapping("/history/{userId}")
    public ResponseEntity<List<Order>> getOrderHistory(@PathVariable Long userId) {
        List<Order> history = tradeService.getTradeHistory(userId);
        return ResponseEntity.ok(history);
    }
}
