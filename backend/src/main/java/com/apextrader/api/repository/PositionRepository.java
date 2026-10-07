package com.apextrader.api.repository;

import com.apextrader.api.model.Position;
import com.apextrader.api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Unit 3 & 4: Spring Data JPA Integration
 */
@Repository
public interface PositionRepository extends JpaRepository<Position, Long> {
    List<Position> findByUser(User user);
    Optional<Position> findByUserAndSymbol(User user, String symbol);
}
