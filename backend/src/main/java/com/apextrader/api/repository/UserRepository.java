package com.apextrader.api.repository;

import com.apextrader.api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Unit 3 & 4: Spring Data JPA Integration
 * Data Access Layer abstractions mapping entities directly to SQL tables.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
}
