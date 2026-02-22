package com.sutreya.ecommerce.service;

import com.sutreya.ecommerce.model.CartItem;
import com.sutreya.ecommerce.repository.CartItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class CartService {
    
    @Autowired
    private CartItemRepository cartItemRepository;
    
    public List<CartItem> getCartItems(UUID userId) {
        return cartItemRepository.findByUserId(userId);
    }
    
    @Transactional
    public CartItem addToCart(UUID userId, UUID productId, Integer quantity) {
        var existing = cartItemRepository.findByUserIdAndProductId(userId, productId);
        
        if (existing.isPresent()) {
            CartItem item = existing.get();
            item.setQuantity(item.getQuantity() + quantity);
            return cartItemRepository.save(item);
        }
        
        CartItem newItem = new CartItem();
        newItem.setUserId(userId);
        newItem.setProductId(productId);
        newItem.setQuantity(quantity);
        return cartItemRepository.save(newItem);
    }
    
    @Transactional
    public CartItem updateQuantity(UUID userId, UUID productId, Integer quantity) {
        var item = cartItemRepository.findByUserIdAndProductId(userId, productId)
            .orElseThrow(() -> new RuntimeException("Cart item not found"));
        
        item.setQuantity(quantity);
        return cartItemRepository.save(item);
    }
    
    @Transactional
    public void removeFromCart(UUID userId, UUID productId) {
        var item = cartItemRepository.findByUserIdAndProductId(userId, productId)
            .orElseThrow(() -> new RuntimeException("Cart item not found"));
        cartItemRepository.delete(item);
    }
    
    @Transactional
    public void clearCart(UUID userId) {
        cartItemRepository.deleteByUserId(userId);
    }
    
    public long getCartCount(UUID userId) {
        return cartItemRepository.countByUserId(userId);
    }
}
