package vn.edu.fpt.bookingservice.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class PromotionDTO {
    private String promotionId; 

    private String title;

    private String detail;

    private Integer discountLevel;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private String image;

    private String status;
    private Boolean isDeleted = false;
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
