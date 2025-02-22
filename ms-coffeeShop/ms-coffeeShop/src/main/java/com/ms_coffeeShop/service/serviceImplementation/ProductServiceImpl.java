package com.ms_coffeeShop.service.serviceImplementation;

import com.ms_coffeeShop.DTOs.ProductDto;
import com.ms_coffeeShop.entity.Product;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ms_coffeeShop.repository.ProductRepository;
import com.ms_coffeeShop.service.ProductService;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    @Autowired
    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public Product createProduct(ProductDto productDto) {
        Product product = new Product();

        if (productDto.getName().isEmpty()) {
            throw new IllegalArgumentException("Product name cannot be empty");
        }
        if (productRepository.existsByName(productDto.getName())) {
            throw new IllegalArgumentException("Product with name " + productDto.getName() + " already exists");
        }
        product.setName(productDto.getName());
        product.setCurrentStock(productDto.getCurrentStock());
        product.setLastSoldPrice(productDto.getLastSoldPrice());
        product.setLastBoughtPrice(productDto.getLastBoughtPrice());
        return productRepository.save(product);
    }

    @Override
    public List<Product> findAllProducts() {
        List<Product> products = productRepository.findAll();
        if (products.isEmpty()) {
            throw new NoSuchElementException("No products found");
        }
        return products;
    }

    @Override
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Product not found with id: " + id));
    }

    @Override
    public boolean deleteProduct(Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return true;
        } else {
            throw new NoSuchElementException("Product not found with id: " + id);
        }
    }

    @Override
    public void updateProductPurchases(Product product, int quantity, double price) {
        product.setLastBoughtPrice(price);
        product.setCurrentStock(product.getCurrentStock() + quantity);
        productRepository.save(product);
    }

    @Override
    public void updateProductSellings(Product product, int quantity, double price) {
        product.setLastSoldPrice(price);
        product.setCurrentStock(product.getCurrentStock() - quantity);
        productRepository.save(product);

    }
    @Override
    public List<Product> sellMultipleProducts(List<ProductDto> productDtos) {
        List<Product> products = new ArrayList<>();

        for (ProductDto productDto : productDtos) {

            if (productDto.getName().isEmpty()) {
                throw new IllegalArgumentException("Product name cannot be empty");
            }


            Product product = productRepository.findByName(productDto.getName())
                    .orElseThrow(() ->
                            new IllegalArgumentException("Product not found: " + productDto.getName()));


            if (productDto.getLastSoldPrice() <= 0) {
                throw new IllegalArgumentException("Last sold price must be greater than 0");
            }


            if (product.getCurrentStock() <= 0) {
                throw new IllegalArgumentException("Insufficient stock for product: " + productDto.getName());
            }


            System.out.println(product.getCurrentStock());
            product.setCurrentStock(product.getCurrentStock() - 1);
            product.setLastSoldPrice(productDto.getLastSoldPrice());

            products.add(product);
        }

        return productRepository.saveAll(products);
    }

}