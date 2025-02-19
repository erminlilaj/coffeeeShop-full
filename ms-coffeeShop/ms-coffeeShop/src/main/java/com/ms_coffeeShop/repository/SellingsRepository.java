package com.ms_coffeeShop.repository;

import com.ms_coffeeShop.entity.Sellings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.YearMonth;
import java.util.List;

public interface SellingsRepository extends JpaRepository<Sellings, Long> {

    @Query("SELECT COALESCE(SUM(s.quantity), 0) FROM Sellings s WHERE s.product.id = :productId AND YEAR(s.sellingDate) = :#{#month.year} AND MONTH(s.sellingDate) = :#{#month.monthValue}")
    Integer sumQuantityByProductAndMonth(@Param("productId") Long productId, @Param("month") YearMonth month);

    @Query("SELECT COALESCE(SUM(s.totalPrice), 0.0) FROM Sellings s WHERE s.product.id = :productId AND YEAR(s.sellingDate) = :#{#month.year} AND MONTH(s.sellingDate) = :#{#month.monthValue}")
    Double sumTotalPriceByProductAndMonth(@Param("productId") Long productId, @Param("month") YearMonth month);

    @Query("SELECT COALESCE(SUM(s.quantity), 0) FROM Sellings s WHERE s.product.id = :productId AND YEAR(s.sellingDate) = :year")
    Integer sumQuantityByProductAndYear(@Param("productId") Long productId, @Param("year") int year);

    @Query("SELECT COALESCE(SUM(s.totalPrice), 0.0) FROM Sellings s WHERE s.product.id = :productId AND YEAR(s.sellingDate) = :year")
    Double sumTotalPriceByProductAndYear(@Param("productId") Long productId, @Param("year") int year);

    @Query("SELECT DISTINCT s.product.id FROM Sellings s WHERE YEAR(s.sellingDate) = :year")
    List<Long> findProductIdsWithSellingsInYear(@Param("year") int year);

    @Query("SELECT DISTINCT s.product.id FROM Sellings s WHERE YEAR(s.sellingDate) = :year AND MONTH(s.sellingDate) = :month")
    List<Long> findProductIdsWithSellingsInMonth(@Param("year") int year, @Param("month") int month);
}