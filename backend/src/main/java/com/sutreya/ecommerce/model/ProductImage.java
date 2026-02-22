package com.sutreya.ecommerce.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "product_media")
@Data
public class ProductImage {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;
    
    @Column(nullable = false)
    private String storageKey;
    
    private String url;
    
    @Enumerated(EnumType.STRING)
    private MediaType type;
    
    private String altText;
    
    private Integer displayOrder;
    
    @Column(columnDefinition = "jsonb")
    private String metadata;
    
    @Column(name = "created_at")
    private Instant createdAt = Instant.now();
    
    public enum MediaType {
        IMAGE, VIDEO, MODEL_3D
    }
}
