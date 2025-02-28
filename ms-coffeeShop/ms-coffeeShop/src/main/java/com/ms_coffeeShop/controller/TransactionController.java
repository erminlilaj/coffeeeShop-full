package com.ms_coffeeShop.controller;

import com.ms_coffeeShop.DTOs.MonthlyStatisticsDto;
import com.ms_coffeeShop.DTOs.TransactionDto;
import com.ms_coffeeShop.DTOs.YearlyStatisticsDTO;
import com.ms_coffeeShop.dateValidation.DateValidation;
import com.ms_coffeeShop.entity.Purchases;
import com.ms_coffeeShop.entity.Sellings;
import com.ms_coffeeShop.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Collections;
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

    @GetMapping("/sellings")
    public ResponseEntity<Page<Sellings>> get_Sellings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false)  String start_date,
            @RequestParam(required = false)  String end_date) {

        LocalDate parsedStartDate = DateValidation.getDate(start_date);
        LocalDate parsedEndDate = DateValidation.getDate(end_date);

        Page<Sellings> sellings = transactionService.get_filtered_Sellings(page, size,
                parsedStartDate, parsedEndDate);
        return ResponseEntity.ok(sellings);
    }

    @GetMapping("/purchases")
    public ResponseEntity<Page<Purchases>> get_Purchases(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false)  String start_date,
            @RequestParam(required = false)   String end_date) {

        LocalDate parsedStartDate = DateValidation.getDate(start_date);
        LocalDate parsedEndDate = DateValidation.getDate(end_date);

        Page<Purchases> purchases = transactionService.get_filtered_Purchases(page,
                size, parsedStartDate, parsedEndDate);
        return ResponseEntity.ok(purchases);
    }

    @GetMapping("/monthlyStatistics")
    public ResponseEntity<List<MonthlyStatisticsDto>> getMonthlyStatistics(
            @RequestParam String startDate,
            @RequestParam String endDate,
            @RequestParam(required = false) String type) {
        try {
            // Parse the start and end date including day
            LocalDate parsedStartDate = LocalDate.parse(startDate, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            LocalDate parsedEndDate = LocalDate.parse(endDate, DateTimeFormatter.ofPattern("yyyy-MM-dd"));

            // Call the service to get the statistics
            List<MonthlyStatisticsDto> stats = transactionService.getMonthlyStatistics(parsedStartDate, parsedEndDate, type);
            return ResponseEntity.ok(stats);
        } catch (DateTimeParseException e) {
            return ResponseEntity.badRequest().body(Collections.emptyList());
        }
    }


    @GetMapping("/yearlyStatistics")
    public ResponseEntity<List<YearlyStatisticsDTO>> getYearlyStatistics(@RequestParam int year, @RequestParam(required = false) String type) {
        List<YearlyStatisticsDTO> yearlyStatistics = transactionService.getYearlyStatistics(year, type);
        return ResponseEntity.ok(yearlyStatistics);
    }
}