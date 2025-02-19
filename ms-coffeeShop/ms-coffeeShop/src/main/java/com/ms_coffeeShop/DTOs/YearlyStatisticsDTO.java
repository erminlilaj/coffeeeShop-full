package com.ms_coffeeShop.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;


@Data
    @AllArgsConstructor
    public class YearlyStatisticsDTO {
        private String productName;
        private int yearlyPurchases;
        private double totalPurchaseCost;
        private int yearlySales;
        private double totalSalesRevenue;
        private double yearlyProfit;

    }
