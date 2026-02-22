package com.sutreya.ecommerce.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping("/api/v1/admin/analytics")
@RequiredArgsConstructor
@CrossOrigin(origins = {"https://frontend-murex-sigma.vercel.app", "http://localhost:3000"})
public class AnalyticsController {

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardMetrics(@RequestParam UUID sellerId) {
        Map<String, Object> metrics = new HashMap<>();
        metrics.put("totalRevenue", BigDecimal.valueOf(12450.00));
        metrics.put("totalOrders", 87);
        metrics.put("totalProducts", 24);
        metrics.put("lowStockItems", 3);
        
        List<Map<String, Object>> topProducts = new ArrayList<>();
        Map<String, Object> product1 = new HashMap<>();
        product1.put("name", "Handmade Pottery Bowl");
        product1.put("sales", 45);
        product1.put("revenue", 2250.00);
        topProducts.add(product1);
        
        metrics.put("topProducts", topProducts);
        return ResponseEntity.ok(metrics);
    }

    @GetMapping("/products/performance")
    public ResponseEntity<List<Map<String, Object>>> getProductPerformance(@RequestParam UUID sellerId) {
        List<Map<String, Object>> performance = new ArrayList<>();
        Map<String, Object> perf = new HashMap<>();
        perf.put("productId", UUID.randomUUID());
        perf.put("views", 1250);
        perf.put("conversionRate", 3.2);
        perf.put("revenue", 5600.00);
        performance.add(perf);
        
        return ResponseEntity.ok(performance);
    }
}
