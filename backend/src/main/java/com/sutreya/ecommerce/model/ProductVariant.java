package com.sutreya.ecommerce.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "product_variants")
@Data
public class ProductVariant {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;
    
    private String sku;
    
    @Column(nullable = false)
    private String name;
    
    private BigDecimal price;
    
    private Integer inventoryQuantity = 0;
    
    @Column(columnDefinition = "jsonb")
    private String options;
    
    private String imageUrl;
    
    @Column(name = "created_at")
    private Instant createdAt = Instant.now();
}
