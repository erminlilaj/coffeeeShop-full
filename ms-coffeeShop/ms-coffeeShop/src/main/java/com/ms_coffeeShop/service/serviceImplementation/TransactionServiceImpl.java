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
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.YearMonth;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {
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
    public List<MonthlyStatisticsDto> getMonthlyStatistics(YearMonth month, String type) {
        int year = month.getYear();
        int monthValue = month.getMonthValue();

        List<Long> purchaseProductIds = purchasesRepository.findProductIdsWithPurchasesInMonth(year, monthValue);
        List<Long> sellingProductIds = sellingsRepository.findProductIdsWithSellingsInMonth(year, monthValue);

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
            int totalBought = 0;
            double totalSpent = 0.0;
            int totalSold = 0;
            double totalRevenue = 0.0;
            double totalProfit = 0.0;

            if (type == null || type.equalsIgnoreCase("both") || type.equalsIgnoreCase("purchases")) {
                totalBought = purchasesRepository.sumQuantityByProductAndMonth(product.getId(), month);
                totalSpent = purchasesRepository.sumTotalPriceByProductAndMonth(product.getId(), month);
            }

            if (type == null || type.equalsIgnoreCase("both") || type.equalsIgnoreCase("sellings")) {
                totalSold = sellingsRepository.sumQuantityByProductAndMonth(product.getId(), month);
                totalRevenue = sellingsRepository.sumTotalPriceByProductAndMonth(product.getId(), month);
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
}