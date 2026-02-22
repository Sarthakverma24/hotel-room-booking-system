package com.sutreya.ecommerce.service;

import com.sutreya.ecommerce.dto.CreateProductRequest;
import com.sutreya.ecommerce.dto.ProductDTO;
import com.sutreya.ecommerce.model.HandmadeAttributes;
import com.sutreya.ecommerce.model.Product;
import com.sutreya.ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminProductService {

    private final ProductRepository productRepository;

    @Transactional
    public ProductDTO createProduct(CreateProductRequest request) {
        Product product = new Product();
        product.setSellerId(request.getSellerId());
        product.setName(request.getName());
        product.setSlug(generateSlug(request.getName()));
        product.setDescription(request.getDescription());
        product.setShortDescription(request.getShortDescription());
        product.setPrice(request.getPrice());
        product.setCompareAtPrice(request.getCompareAtPrice());
        product.setInventoryQuantity(request.getInventoryQuantity());
        product.setType(request.getType() != null ? request.getType() : Product.ProductType.PHYSICAL);
        
        if (request.getProcessingDays() != null) {
            HandmadeAttributes attrs = new HandmadeAttributes();
            attrs.setProcessingDays(request.getProcessingDays());
            attrs.setMaterials(request.getMaterials());
            attrs.setCustomizationAvailable(request.getCustomizationAvailable());
            product.setHandmadeAttributes(attrs);
        }
        
        product = productRepository.save(product);
        return toDTO(product);
    }

    @Transactional
    public ProductDTO updateProduct(UUID id, CreateProductRequest request) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found"));
        
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setShortDescription(request.getShortDescription());
        product.setPrice(request.getPrice());
        product.setCompareAtPrice(request.getCompareAtPrice());
        product.setInventoryQuantity(request.getInventoryQuantity());
        product.setUpdatedAt(Instant.now());
        
        product = productRepository.save(product);
        return toDTO(product);
    }

    @Transactional
    public void deleteProduct(UUID id) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setIsActive(false);
        productRepository.save(product);
    }

    public List<String> uploadMedia(UUID productId, List<MultipartFile> files) {
        // Placeholder for media upload - integrate with Supabase Storage
        return files.stream()
            .map(file -> "https://storage.supabase.co/products/" + productId + "/" + file.getOriginalFilename())
            .collect(Collectors.toList());
    }

    public Page<ProductDTO> getSellerProducts(UUID sellerId, Pageable pageable) {
        Page<Product> products = productRepository.findBySellerId(sellerId, pageable);
        return products.map(this::toDTO);
    }

    private String generateSlug(String name) {
        return name.toLowerCase()
            .replaceAll("[^a-z0-9\\s-]", "")
            .replaceAll("\\s+", "-")
            + "-" + UUID.randomUUID().toString().substring(0, 8);
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
