package com.sutreya.ecommerce.controller;

import com.sutreya.ecommerce.model.CartItem;
import com.sutreya.ecommerce.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {
    
    @Autowired
    private CartService cartService;
    
    @GetMapping("/{userId}")
    public ResponseEntity<List<CartItem>> getCart(@PathVariable UUID userId) {
        return ResponseEntity.ok(cartService.getCartItems(userId));
    }
    
    @PostMapping("/add")
    public ResponseEntity<CartItem> addToCart(@RequestBody Map<String, Object> request) {
        UUID userId = UUID.fromString((String) request.get("userId"));
        UUID productId = UUID.fromString((String) request.get("productId"));
        Integer quantity = (Integer) request.getOrDefault("quantity", 1);
        
        return ResponseEntity.ok(cartService.addToCart(userId, productId, quantity));
    }
    
    @PutMapping("/update")
    public ResponseEntity<CartItem> updateQuantity(@RequestBody Map<String, Object> request) {
        UUID userId = UUID.fromString((String) request.get("userId"));
        UUID productId = UUID.fromString((String) request.get("productId"));
        Integer quantity = (Integer) request.get("quantity");
        
        return ResponseEntity.ok(cartService.updateQuantity(userId, productId, quantity));
    }
    
    @DeleteMapping("/remove")
    public ResponseEntity<Void> removeFromCart(@RequestBody Map<String, String> request) {
        UUID userId = UUID.fromString(request.get("userId"));
        UUID productId = UUID.fromString(request.get("productId"));
        
        cartService.removeFromCart(userId, productId);
        return ResponseEntity.ok().build();
    }
    
    @DeleteMapping("/clear/{userId}")
    public ResponseEntity<Void> clearCart(@PathVariable UUID userId) {
        cartService.clearCart(userId);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/count/{userId}")
    public ResponseEntity<Map<String, Long>> getCartCount(@PathVariable UUID userId) {
        return ResponseEntity.ok(Map.of("count", cartService.getCartCount(userId)));
    }
}
