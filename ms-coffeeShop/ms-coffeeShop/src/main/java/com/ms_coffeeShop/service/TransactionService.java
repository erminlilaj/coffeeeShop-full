package com.ms_coffeeShop.service;

import com.ms_coffeeShop.DTOs.MonthlyStatisticsDto;
import com.ms_coffeeShop.DTOs.TransactionDto;
import com.ms_coffeeShop.DTOs.YearlyStatisticsDTO;
import com.ms_coffeeShop.entity.Purchases;
import com.ms_coffeeShop.entity.Sellings;
import org.springframework.data.domain.Page;

import java.time.YearMonth;
import java.util.List;

public interface TransactionService {
    Purchases createPurchase(TransactionDto transactionDto);

    Sellings createSell(TransactionDto transactionDto);

    Page<Purchases> getAllPurchases(int page, int size);

    Page<Sellings> getAllSellings(int page, int size);
    List<MonthlyStatisticsDto> getMonthlyStatistics(YearMonth month,String type);
    List<YearlyStatisticsDTO> getYearlyStatistics(int year, String type);
}
