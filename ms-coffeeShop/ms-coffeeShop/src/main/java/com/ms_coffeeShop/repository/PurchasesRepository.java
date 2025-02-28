package com.ms_coffeeShop.repository;

import com.ms_coffeeShop.entity.Purchases;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface PurchasesRepository extends JpaRepository<Purchases, Long> {

    // Find product IDs with purchases in a specific year
    @Query("SELECT DISTINCT p.product.id FROM Purchases p WHERE FUNCTION('YEAR', p.buyingDate) = :year")
    List<Long> findProductIdsWithPurchasesInYear(@Param("year") int year);

    // Sum quantity of product purchased in a specific year
    @Query("SELECT COALESCE(SUM(p.quantity), 0) FROM Purchases p WHERE p.product.id = :productId AND FUNCTION('YEAR', p.buyingDate) = :year")
    Integer sumQuantityByProductAndYear(@Param("productId") Long productId, @Param("year") int year);

    // Sum total price of product purchased in a specific year
    @Query("SELECT COALESCE(SUM(p.totalPrice), 0.0) FROM Purchases p WHERE p.product.id = :productId AND FUNCTION('YEAR', p.buyingDate) = :year")
    Double sumTotalPriceByProductAndYear(@Param("productId") Long productId, @Param("year") int year);

    // Keep the existing methods for monthly stats
    @Query("SELECT DISTINCT p.product.id FROM Purchases p WHERE p.buyingDate BETWEEN :startDate AND :endDate")
    List<Long> findProductIdsWithPurchasesInRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT COALESCE(SUM(p.quantity), 0) FROM Purchases p WHERE p.product.id = :productId AND p.buyingDate BETWEEN :startDate AND :endDate")
    Integer sumQuantityByProductAndDateRange(@Param("productId") Long productId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT COALESCE(SUM(p.totalPrice), 0.0) FROM Purchases p WHERE p.product.id = :productId AND p.buyingDate BETWEEN :startDate AND :endDate")
    Double sumTotalPriceByProductAndDateRange(@Param("productId") Long productId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);


    @Query("SELECT p FROM Purchases p WHERE p.buyingDate BETWEEN :startDate AND :endDate")
    Page<Purchases> findByBuyingDateBetween(@Param("startDate") LocalDate startDate,
                                            @Param("endDate") LocalDate endDate,
                                            Pageable pageable);

}



