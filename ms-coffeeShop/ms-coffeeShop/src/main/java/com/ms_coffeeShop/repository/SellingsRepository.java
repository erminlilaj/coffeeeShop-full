package com.ms_coffeeShop.repository;

import com.ms_coffeeShop.entity.Purchases;
import com.ms_coffeeShop.entity.Sellings;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface SellingsRepository extends JpaRepository<Sellings, Long> {

    // Find product IDs with sales in a specific year
    @Query("SELECT DISTINCT s.product.id FROM Sellings s WHERE FUNCTION('YEAR', s.sellingDate) = :year")
    List<Long> findProductIdsWithSellingsInYear(@Param("year") int year);

    // Sum quantity of product sold in a specific year
    @Query("SELECT COALESCE(SUM(s.quantity), 0) FROM Sellings s WHERE s.product.id = :productId AND FUNCTION('YEAR', s.sellingDate) = :year")
    Integer sumQuantityByProductAndYear(@Param("productId") Long productId, @Param("year") int year);

    // Sum total price of product sold in a specific year
    @Query("SELECT COALESCE(SUM(s.totalPrice), 0.0) FROM Sellings s WHERE s.product.id = :productId AND FUNCTION('YEAR', s.sellingDate) = :year")
    Double sumTotalPriceByProductAndYear(@Param("productId") Long productId, @Param("year") int year);

    // Keep the existing methods for monthly stats
    @Query("SELECT DISTINCT s.product.id FROM Sellings s WHERE s.sellingDate BETWEEN :startDate AND :endDate")
    List<Long> findProductIdsWithSellingsInRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT COALESCE(SUM(s.quantity), 0) FROM Sellings s WHERE s.product.id = :productId AND s.sellingDate BETWEEN :startDate AND :endDate")
    Integer sumQuantityByProductAndDateRange(@Param("productId") Long productId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT COALESCE(SUM(s.totalPrice), 0.0) FROM Sellings s WHERE s.product.id = :productId AND s.sellingDate BETWEEN :startDate AND :endDate")
    Double sumTotalPriceByProductAndDateRange(@Param("productId") Long productId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT s FROM Sellings s WHERE s.sellingDate BETWEEN :startDate AND :endDate")
    Page<Sellings> findByBuyingDateBetween(@Param("startDate") LocalDate startDate,
                                            @Param("endDate") LocalDate endDate,
                                            Pageable pageable);
}
