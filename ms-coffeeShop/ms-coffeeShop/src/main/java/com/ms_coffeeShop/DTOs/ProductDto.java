package com.ms_coffeeShop.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductDto {

    private String name;
    private Integer currentStock;
    private double lastBoughtPrice;
    private double lastSoldPrice;

}
