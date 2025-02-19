package com.ms_coffeeShop.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "product")
public class Product {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    private String name;
    private Integer currentStock;
    private double lastBoughtPrice;
    private double lastSoldPrice;

//    @PrePersist
//    private void onCreate(){
//        currentStock=0;
//        lastSoldPrice=0.0;
//    }


}