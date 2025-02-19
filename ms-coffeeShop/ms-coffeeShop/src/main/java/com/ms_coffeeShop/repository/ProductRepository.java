package com.ms_coffeeShop.repository;

import com.ms_coffeeShop.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
   boolean existsByName(String name);

}
