package com.ms_coffeeShop.controller;

import com.ms_coffeeShop.DTOs.MonthlyStatisticsDto;
import com.ms_coffeeShop.DTOs.TransactionDto;
import com.ms_coffeeShop.DTOs.YearlyStatisticsDTO;
import com.ms_coffeeShop.entity.Purchases;
import com.ms_coffeeShop.entity.Sellings;
import com.ms_coffeeShop.repository.PurchasesRepository;
import com.ms_coffeeShop.repository.SellingsRepository;
import com.ms_coffeeShop.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.YearMonth;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/transactions")
@CrossOrigin
public class TransactionController {
    private final TransactionService transactionService;

    @PostMapping("/purchase")
    public ResponseEntity<Purchases> createPurchase(@RequestBody TransactionDto transactionDto) {
        Purchases createdPurchase = transactionService.createPurchase(transactionDto);
        return ResponseEntity.ok(createdPurchase);
    }

    @PostMapping("/sell")
    public ResponseEntity<Sellings> createSell(@RequestBody TransactionDto transactionDto) {
        Sellings createdSell = transactionService.createSell(transactionDto);
        return ResponseEntity.ok(createdSell);
    }

    @GetMapping("/purchases")
    public ResponseEntity<Page<Purchases>> getAllPurchases(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Purchases> purchases = transactionService.getAllPurchases(page, size);
        return ResponseEntity.ok(purchases);
    }

    @GetMapping("/sellings")
    public ResponseEntity<Page<Sellings>> getAllSellings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Sellings> sellings = transactionService.getAllSellings(page, size);
        return ResponseEntity.ok(sellings);
    }

    @GetMapping("/monthlyStatistics")
    public ResponseEntity<List<MonthlyStatisticsDto>> getMonthlyStatistics(@RequestParam String month, @RequestParam(required = false) String type) {
        YearMonth yearMonth = YearMonth.parse(month);
        List<MonthlyStatisticsDto> monthlyStatistics = transactionService.getMonthlyStatistics(yearMonth, type);
        return ResponseEntity.ok(monthlyStatistics);
    }

    @GetMapping("/yearlyStatistics")
    public ResponseEntity<List<YearlyStatisticsDTO>> getYearlyStatistics(@RequestParam int year, @RequestParam(required = false) String type) {
        List<YearlyStatisticsDTO> yearlyStatistics = transactionService.getYearlyStatistics(year, type);
        return ResponseEntity.ok(yearlyStatistics);
    }
}