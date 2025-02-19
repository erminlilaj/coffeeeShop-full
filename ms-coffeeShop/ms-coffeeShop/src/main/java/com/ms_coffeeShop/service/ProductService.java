package com.ms_coffeeShop.service;

import com.ms_coffeeShop.DTOs.ProductDto;
import com.ms_coffeeShop.entity.Product;

import java.util.List;

public interface ProductService {
    Product createProduct(ProductDto productDto);

    List<Product> findAllProducts();

    Product getProductById(Long id);

    boolean deleteProduct(Long id);

    void updateProductPurchases(Product product, int quantity, double price);

    void updateProductSellings(Product product, int quantity, double price);
}
