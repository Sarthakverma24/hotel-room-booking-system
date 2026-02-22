package com.sutreya.ecommerce.service;

import com.sutreya.ecommerce.model.Product;
import com.sutreya.ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
public class BulkProductService {

    private final ProductRepository productRepository;

    @Transactional
    public Map<String, Object> updatePrices(List<UUID> productIds, BigDecimal percentageChange) {
        List<Product> products = productRepository.findAllById(productIds);
        int successCount = 0;
        
        for (Product product : products) {
            BigDecimal newPrice = product.getPrice()
                .multiply(BigDecimal.ONE.add(percentageChange.divide(BigDecimal.valueOf(100))));
            product.setPrice(newPrice);
            successCount++;
        }
        
        productRepository.saveAll(products);
        
        Map<String, Object> result = new HashMap<>();
        result.put("success", successCount);
        result.put("failed", productIds.size() - successCount);
        return result;
    }

    @Transactional
    public Map<String, Object> bulkUpdateInventory(Map<UUID, Integer> updates) {
        List<Product> products = productRepository.findAllById(updates.keySet());
        
        for (Product product : products) {
            Integer newQuantity = updates.get(product.getId());
            if (newQuantity != null) {
                product.setInventoryQuantity(newQuantity);
            }
        }
        
        productRepository.saveAll(products);
        
        Map<String, Object> result = new HashMap<>();
        result.put("updated", products.size());
        return result;
    }
}
