package com.sutreya.ecommerce.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.sutreya.ecommerce.model.Subscription;
import com.sutreya.ecommerce.repository.SubscriptionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;

    @Transactional
    public void activateSubscription(String revenuecatCustomerId, JsonNode event) {
        Subscription subscription = subscriptionRepository
            .findByRevenuecatCustomerId(revenuecatCustomerId)
            .orElseGet(() -> createNewSubscription(revenuecatCustomerId));

        subscription.setStatus("ACTIVE");
        subscription.setCurrentPeriodStart(Instant.ofEpochMilli(
            event.get("event").get("purchased_at_ms").asLong()));
        subscription.setCurrentPeriodEnd(Instant.ofEpochMilli(
            event.get("event").get("expiration_at_ms").asLong()));
        subscription.setUpdatedAt(Instant.now());
        
        subscriptionRepository.save(subscription);
        log.info("Activated subscription for customer: {}", revenuecatCustomerId);
    }

    @Transactional
    public void markForCancellation(String revenuecatCustomerId, JsonNode event) {
        subscriptionRepository.findByRevenuecatCustomerId(revenuecatCustomerId)
            .ifPresent(subscription -> {
                subscription.setCancelAtPeriodEnd(true);
                subscription.setUpdatedAt(Instant.now());
                subscriptionRepository.save(subscription);
                log.info("Marked subscription for cancellation: {}", revenuecatCustomerId);
            });
    }

    @Transactional
    public void expireSubscription(String revenuecatCustomerId, JsonNode event) {
        subscriptionRepository.findByRevenuecatCustomerId(revenuecatCustomerId)
            .ifPresent(subscription -> {
                subscription.setStatus("EXPIRED");
                subscription.setUpdatedAt(Instant.now());
                subscriptionRepository.save(subscription);
                log.info("Expired subscription: {}", revenuecatCustomerId);
            });
    }

    private Subscription createNewSubscription(String revenuecatCustomerId) {
        Subscription subscription = new Subscription();
        subscription.setRevenuecatCustomerId(revenuecatCustomerId);
        subscription.setUserId(UUID.randomUUID());
        subscription.setStatus("PENDING");
        subscription.setPlanType("FREE");
        return subscription;
    }
}
