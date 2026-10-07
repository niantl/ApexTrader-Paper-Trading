package com.apextrader.api.exception;

public class InvalidTradeException extends RuntimeException {
    public InvalidTradeException(String message) {
        super(message);
    }
}
