package com.sutreya.ecommerce.dto;

import com.sutreya.ecommerce.model.Product;
import lombok.Data;
import java.math.BigDecimal;
import java.util.UUID;

@Data
public class CreateProductRequest {
    private UUID sellerId;
    private String name;
    private String description;
    private String shortDescription;
    private BigDecimal price;
    private BigDecimal compareAtPrice;
    private Integer inventoryQuantity;
    private Product.ProductType type;
    private Integer processingDays;
    private String materials;
    private Boolean customizationAvailable;
}
