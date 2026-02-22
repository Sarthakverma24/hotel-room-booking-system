package com.sutreya.ecommerce.controller;

import com.sutreya.ecommerce.dto.CreateProductRequest;
import com.sutreya.ecommerce.dto.ProductDTO;
import com.sutreya.ecommerce.service.AdminProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/products")
@RequiredArgsConstructor
@CrossOrigin(origins = {"https://frontend-murex-sigma.vercel.app", "http://localhost:3000"})
public class AdminProductController {

    private final AdminProductService adminProductService;

    @PostMapping
    public ResponseEntity<ProductDTO> createProduct(@RequestBody CreateProductRequest request) {
        ProductDTO product = adminProductService.createProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(product);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable UUID id, @RequestBody CreateProductRequest request) {
        ProductDTO product = adminProductService.updateProduct(id, request);
        return ResponseEntity.ok(product);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable UUID id) {
        adminProductService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/media")
    public ResponseEntity<List<String>> uploadMedia(
            @PathVariable UUID id,
            @RequestParam("files") List<MultipartFile> files) {
        List<String> urls = adminProductService.uploadMedia(id, files);
        return ResponseEntity.ok(urls);
    }

    @GetMapping
    public ResponseEntity<Page<ProductDTO>> getSellerProducts(
            @RequestParam UUID sellerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<ProductDTO> products = adminProductService.getSellerProducts(sellerId, PageRequest.of(page, size));
        return ResponseEntity.ok(products);
    }
}
