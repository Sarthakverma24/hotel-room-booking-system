package com.sutreya.ecommerce.service;

import com.sutreya.ecommerce.dto.ProductDTO;
import com.sutreya.ecommerce.model.Product;
import com.sutreya.ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public Page<ProductDTO> findProducts(String category, String search, Pageable pageable) {
        Page<Product> products;
        
        if (search != null && !search.isEmpty()) {
            products = productRepository.findByNameContainingIgnoreCaseAndIsActiveTrue(search, pageable);
        } else {
            products = productRepository.findByIsActiveTrue(pageable);
        }
        
        return products.map(this::toDTO);
    }

    public ProductDTO getProductBySlug(String slug) {
        Product product = productRepository.findBySlugAndIsActiveTrue(slug)
            .orElseThrow(() -> new RuntimeException("Product not found"));
        return toDTO(product);
    }

    private ProductDTO toDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setSlug(product.getSlug());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setInventoryQuantity(product.getInventoryQuantity());
        dto.setImages(product.getImages());
        return dto;
    }
}
