package com.apextrader.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PositionDto {
    private String symbol;
    private Integer quantity;
    private BigDecimal avgBuyPrice;
}
