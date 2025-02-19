package com.ms_coffeeShop.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MonthlyStatisticsDto {
    private String productName;
    private int totalBought;
    private double totalSpent;
    private int totalSold;
    private double totalRevenue;
    private double totalProfit;

}