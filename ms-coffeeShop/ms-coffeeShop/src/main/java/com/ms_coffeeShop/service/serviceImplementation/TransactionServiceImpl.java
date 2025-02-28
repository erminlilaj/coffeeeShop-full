package com.ms_coffeeShop.service.serviceImplementation;

import com.ms_coffeeShop.DTOs.MonthlyStatisticsDto;
import com.ms_coffeeShop.DTOs.TransactionDto;
import com.ms_coffeeShop.DTOs.YearlyStatisticsDTO;
import com.ms_coffeeShop.entity.Product;
import com.ms_coffeeShop.entity.Purchases;
import com.ms_coffeeShop.entity.Sellings;
import com.ms_coffeeShop.repository.ProductRepository;
import com.ms_coffeeShop.repository.PurchasesRepository;
import com.ms_coffeeShop.repository.SellingsRepository;
import com.ms_coffeeShop.service.ProductService;
import com.ms_coffeeShop.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public  class TransactionServiceImpl implements TransactionService {
    private final PurchasesRepository purchasesRepository;
    private final SellingsRepository sellingsRepository;
    private final ProductRepository productRepository;
    private final ProductService productService;

    @Override
    public Purchases createPurchase(TransactionDto transactionDto) {
        Long productId = transactionDto.getProductId();
        Product product = productService.getProductById(productId);
        productService.updateProductPurchases(product, transactionDto.getQuantity(), transactionDto.getPrice());
        Purchases purchases = new Purchases();
        purchases.setProduct(product);
        purchases.setQuantity(transactionDto.getQuantity());
        purchases.setPrice(transactionDto.getPrice());
        purchases.setTotalPrice(transactionDto.getPrice() * transactionDto.getQuantity());
        purchases.setBuyingDate(transactionDto.getTransactionDate());
        return purchasesRepository.save(purchases);
    }

    @Override
    public Sellings createSell(TransactionDto transactionDto) {
        Long productId = transactionDto.getProductId();
        Product product = productService.getProductById(productId);
        if (product.getCurrentStock() < transactionDto.getQuantity()) {
            throw new IllegalArgumentException("Insufficient stock");
        }
        productService.updateProductSellings(product, transactionDto.getQuantity(), transactionDto.getPrice());
        Sellings sellings = new Sellings();
        sellings.setProduct(product);
        sellings.setQuantity(transactionDto.getQuantity());
        sellings.setPrice(transactionDto.getPrice());
        sellings.setTotalPrice(transactionDto.getPrice() * transactionDto.getQuantity());
        sellings.setSellingDate(transactionDto.getTransactionDate());
        return sellingsRepository.save(sellings);
    }

    @Override
    public Page<Purchases> getAllPurchases(int page, int size) {
        Pageable pageable = Pageable.ofSize(size).withPage(page);
        return purchasesRepository.findAll(pageable);
    }

    @Override
    public Page<Sellings> getAllSellings(int page, int size) {
        Pageable pageable = Pageable.ofSize(size).withPage(page);
        return sellingsRepository.findAll(pageable);
    }

    @Override
    public List<MonthlyStatisticsDto> getMonthlyStatistics(LocalDate startDate, LocalDate endDate, String type) {
        // Extract the year and month from the startDate and endDate if needed
        int startYear = startDate.getYear();
        int startMonth = startDate.getMonthValue();
        int endYear = endDate.getYear();
        int endMonth = endDate.getMonthValue();

        // Fetch the products involved in purchases and sellings within the specified date range
        List<Long> purchaseProductIds = purchasesRepository.findProductIdsWithPurchasesInRange(startDate, endDate);
        List<Long> sellingProductIds = sellingsRepository.findProductIdsWithSellingsInRange(startDate, endDate);

        // Create a set to store the active product IDs based on the type (purchases, sellings, or both)
        Set<Long> activeProductIds = new HashSet<>();
        if (type == null || type.equalsIgnoreCase("both") || type.equalsIgnoreCase("purchases")) {
            activeProductIds.addAll(purchaseProductIds);
        }
        if (type == null || type.equalsIgnoreCase("both") || type.equalsIgnoreCase("sellings")) {
            activeProductIds.addAll(sellingProductIds);
        }

        if (activeProductIds.isEmpty()) {
            return List.of(); // Return empty list if no products match the criteria
        }

        // Fetch active products based on the identified product IDs
        List<Product> activeProducts = productRepository.findAllById(activeProductIds);
        return activeProducts.stream().map(product -> {
            int totalBought = 0;
            double totalSpent = 0.0;
            int totalSold = 0;
            double totalRevenue = 0.0;
            double totalProfit = 0.0;

            // If type includes "purchases", calculate statistics for purchases
            if (type == null || type.equalsIgnoreCase("both") || type.equalsIgnoreCase("purchases")) {
                totalBought = purchasesRepository.sumQuantityByProductAndDateRange(product.getId(), startDate, endDate);
                totalSpent = purchasesRepository.sumTotalPriceByProductAndDateRange(product.getId(), startDate, endDate);
            }

            // If type includes "sellings", calculate statistics for sellings
            if (type == null || type.equalsIgnoreCase("both") || type.equalsIgnoreCase("sellings")) {
                totalSold = sellingsRepository.sumQuantityByProductAndDateRange(product.getId(), startDate, endDate);
                totalRevenue = sellingsRepository.sumTotalPriceByProductAndDateRange(product.getId(), startDate, endDate);
            }

            totalProfit = totalRevenue - totalSpent;

            return new MonthlyStatisticsDto(
                    product.getName(),
                    totalBought,
                    totalSpent,
                    totalSold,
                    totalRevenue,
                    totalProfit
            );
        }).collect(Collectors.toList());
    }


    @Override
    public List<YearlyStatisticsDTO> getYearlyStatistics(int year, String type) {
        List<Long> purchaseProductIds = purchasesRepository.findProductIdsWithPurchasesInYear(year);
        List<Long> sellingProductIds = sellingsRepository.findProductIdsWithSellingsInYear(year);

        Set<Long> activeProductIds = new HashSet<>();
        if (type == null || type.equalsIgnoreCase("both") || type.equalsIgnoreCase("purchases")) {
            activeProductIds.addAll(purchaseProductIds);
        }
        if (type == null || type.equalsIgnoreCase("both") || type.equalsIgnoreCase("sellings")) {
            activeProductIds.addAll(sellingProductIds);
        }

        if (activeProductIds.isEmpty()) {
            return List.of();
        }

        List<Product> activeProducts = productRepository.findAllById(activeProductIds);
        return activeProducts.stream().map(product -> {
            int totalPurchased = 0;
            double totalPurchaseCost = 0.0;
            int totalSold = 0;
            double totalSalesRevenue = 0.0;
            double yearlyProfit = 0.0;

            if (type == null || type.equalsIgnoreCase("both") || type.equalsIgnoreCase("purchases")) {
                totalPurchased = purchasesRepository.sumQuantityByProductAndYear(product.getId(), year);
                totalPurchaseCost = purchasesRepository.sumTotalPriceByProductAndYear(product.getId(), year);
            }

            if (type == null || type.equalsIgnoreCase("both") || type.equalsIgnoreCase("sellings")) {
                totalSold = sellingsRepository.sumQuantityByProductAndYear(product.getId(), year);
                totalSalesRevenue = sellingsRepository.sumTotalPriceByProductAndYear(product.getId(), year);
            }

            yearlyProfit = totalSalesRevenue - totalPurchaseCost;

            return new YearlyStatisticsDTO(
                    product.getName(),
                    totalPurchased,
                    totalPurchaseCost,
                    totalSold,
                    totalSalesRevenue,
                    yearlyProfit
            );
        }).collect(Collectors.toList());
    }

    // Get purchases for a specific date range
    public Page<Purchases> get_filtered_Purchases(int page, int size,
                                                  LocalDate startDate,
                                                  LocalDate endDate) {

        Pageable pageable = PageRequest.of(page, size);

        System.out.println(startDate);
        if (startDate != null && endDate != null) {
            System.out.println("Filtered");
            return purchasesRepository.findByBuyingDateBetween(startDate, endDate,
                    pageable);
        } else {
            System.out.println("Not filtered");
            return purchasesRepository.findAll(pageable); // Return all if no dates provided
        }
    }

    @Override
    public Page<Sellings> get_filtered_Sellings(int page, int size, LocalDate startDate,
                                                LocalDate endDate) {
        Pageable pageable = PageRequest.of(page, size);

        System.out.println(startDate);
        if (startDate != null && endDate != null) {
            System.out.println("Filtered");
            return sellingsRepository.findByBuyingDateBetween(startDate, endDate,
                    pageable);
        } else {
            System.out.println("Not filtered");
            return sellingsRepository.findAll(pageable); // Return all if no dates provided
        }
    }

    // Get purchases for a specific date range
    public Page<Sellings> get_filtered_Sales(int page, int size,
                                                  LocalDate startDate,
                                                  LocalDate endDate) {

        Pageable pageable = PageRequest.of(page, size);

        System.out.println(startDate);
        if (startDate != null && endDate != null) {
            System.out.println("Filtered");
            return sellingsRepository.findByBuyingDateBetween(startDate, endDate,
                    pageable);
        } else {
            System.out.println("Not filtered");
            return sellingsRepository.findAll(pageable); // Return all if no dates provided
        }
    }
}