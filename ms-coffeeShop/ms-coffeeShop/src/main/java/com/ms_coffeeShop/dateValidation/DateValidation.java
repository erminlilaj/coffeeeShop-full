package com.ms_coffeeShop.dateValidation;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

public class DateValidation {

    public static LocalDate getDate(String date) {
        // If startDate and endDate are provided, parse them
        LocalDate parsedDate = null;
        if (date != null && !date.isEmpty()) {
            try {
                parsedDate = LocalDate.parse(date, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            } catch (DateTimeParseException e) {
                System.out.println(e.getMessage());
            }
        }

        return parsedDate;
    }
}
