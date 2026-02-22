package com.sutreya.ecommerce.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sutreya.ecommerce.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/webhooks")
@RequiredArgsConstructor
@Slf4j
public class RevenueCatWebhookController {

    private final SubscriptionService subscriptionService;
    private final ObjectMapper objectMapper;

    @PostMapping("/revenuecat")
    public ResponseEntity<Void> handleRevenueCatWebhook(
            @RequestHeader(value = "X-RevenueCat-Signature", required = false) String signature,
            @RequestBody String payload) {
        
        try {
            JsonNode event = objectMapper.readTree(payload);
            String eventType = event.get("event").get("type").asText();
            String appUserId = event.get("event").get("app_user_id").asText();
            
            log.info("Processing RevenueCat event: {} for user: {}", eventType, appUserId);

            switch (eventType) {
                case "INITIAL_PURCHASE":
                case "RENEWAL":
                case "UNCANCELLATION":
                    subscriptionService.activateSubscription(appUserId, event);
                    break;
                    
                case "CANCELLATION":
                    subscriptionService.markForCancellation(appUserId, event);
                    break;
                    
                case "EXPIRATION":
                    subscriptionService.expireSubscription(appUserId, event);
                    break;
                    
                default:
                    log.info("Unhandled RevenueCat event type: {}", eventType);
            }

            return ResponseEntity.ok().build();
            
        } catch (Exception e) {
            log.error("Error processing RevenueCat webhook", e);
            return ResponseEntity.status(500).build();
        }
    }
}
