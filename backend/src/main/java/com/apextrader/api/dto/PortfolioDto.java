package com.apextrader.api.dto;

import com.apextrader.api.model.Position;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PortfolioDto {
    private Long userId;
    private BigDecimal virtualBalance;
    private List<PositionDto> positions;
    
    // In a real application, you'd calculate this based on live market data.
    // For this assignment, we might just use a placeholder or calculate based on avgBuyPrice.
    private BigDecimal estimatedTotalValue; 
}
