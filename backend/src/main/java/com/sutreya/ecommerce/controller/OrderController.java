package com.sutreya.ecommerce.controller;

import com.sutreya.ecommerce.model.Order;
import com.sutreya.ecommerce.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = {"https://frontend-murex-sigma.vercel.app", "http://localhost:3000"})
public class OrderController {

    private final OrderRepository orderRepository;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getUserOrders(@PathVariable UUID userId) {
        return ResponseEntity.ok(orderRepository.findByUserIdOrderByCreatedAtDesc(userId));
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        order.setOrderNumber("ORD-" + System.currentTimeMillis());
        return ResponseEntity.ok(orderRepository.save(order));
    }
}
