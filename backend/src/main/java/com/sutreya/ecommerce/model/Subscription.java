package com.sutreya.ecommerce.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "subscriptions", schema = "public")
@Data
public class Subscription {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(name = "user_id", nullable = false)
    private UUID userId;
    
    @Column(name = "revenuecat_customer_id")
    private String revenuecatCustomerId;
    
    @Column(nullable = false)
    private String status;
    
    @Column(name = "plan_type", nullable = false)
    private String planType;
    
    @Column(name = "current_period_start")
    private Instant currentPeriodStart;
    
    @Column(name = "current_period_end")
    private Instant currentPeriodEnd;
    
    @Column(name = "cancel_at_period_end")
    private Boolean cancelAtPeriodEnd = false;
    
    @Column(name = "created_at")
    private Instant createdAt = Instant.now();
    
    @Column(name = "updated_at")
    private Instant updatedAt = Instant.now();
}
