package com.ms_coffeeShop.service;

import com.ms_coffeeShop.DTOs.MonthlyStatisticsDto;
import com.ms_coffeeShop.DTOs.TransactionDto;
import com.ms_coffeeShop.DTOs.YearlyStatisticsDTO;
import com.ms_coffeeShop.entity.Purchases;
import com.ms_coffeeShop.entity.Sellings;
import org.springframework.data.domain.Page;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

public interface TransactionService {
    Purchases createPurchase(TransactionDto transactionDto);

    Sellings createSell(TransactionDto transactionDto);

    Page<Purchases> getAllPurchases(int page, int size);

    Page<Sellings> getAllSellings(int page, int size);
    // In your repository interface

    List<MonthlyStatisticsDto> getMonthlyStatistics(LocalDate startDate, LocalDate endDate, String type);

    List<YearlyStatisticsDTO> getYearlyStatistics(int year, String type);

    Page<Purchases> get_filtered_Purchases(int page, int size, LocalDate start_date
    ,LocalDate end_date);

    Page<Sellings> get_filtered_Sellings(int page, int size, LocalDate start_date
            ,LocalDate end_date);


}
