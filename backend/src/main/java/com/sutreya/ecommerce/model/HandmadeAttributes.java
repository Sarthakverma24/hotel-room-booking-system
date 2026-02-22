package com.sutreya.ecommerce.model;

import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class HandmadeAttributes {
    private Integer processingDays;
    private String materials;
    private Boolean customizationAvailable;
    private String customizationOptions;
}
