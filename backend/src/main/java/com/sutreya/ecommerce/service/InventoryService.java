package com.sutreya.ecommerce.service;

import com.sutreya.ecommerce.model.Product;
import com.sutreya.ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final ProductRepository productRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional
    public void updateInventory(UUID productId, int quantityChange) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found"));
        
        int newQuantity = product.getInventoryQuantity() + quantityChange;
        product.setInventoryQuantity(Math.max(0, newQuantity));
        productRepository.save(product);
        
        notifyInventoryChange(productId, newQuantity);
    }

    private void notifyInventoryChange(UUID productId, int newQuantity) {
        Map<String, Object> update = new HashMap<>();
        update.put("productId", productId);
        update.put("available", newQuantity);
        update.put("status", newQuantity > 0 ? "IN_STOCK" : "OUT_OF_STOCK");
        
        messagingTemplate.convertAndSend("/topic/products/" + productId + "/inventory", update);
    }
}
