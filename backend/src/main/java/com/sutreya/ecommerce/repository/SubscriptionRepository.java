package com.sutreya.ecommerce.repository;

import com.sutreya.ecommerce.model.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, UUID> {
    Optional<Subscription> findByRevenuecatCustomerId(String revenuecatCustomerId);
    Optional<Subscription> findByUserId(UUID userId);
}
