package com.apextrader.api.repository;

import com.apextrader.api.model.Order;
import com.apextrader.api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Unit 3 & 4: Spring Data JPA Integration
 */
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    // Custom JPQL Query
    @Query("SELECT o FROM Order o WHERE o.user.id = :userId ORDER BY o.timestamp DESC")
    List<Order> findTradeHistoryByUserId(@Param("userId") Long userId);
}
