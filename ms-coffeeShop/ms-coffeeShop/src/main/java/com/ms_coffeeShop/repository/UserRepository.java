package com.ms_coffeeShop.repository;

import com.ms_coffeeShop.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserEntity, String> {
}
