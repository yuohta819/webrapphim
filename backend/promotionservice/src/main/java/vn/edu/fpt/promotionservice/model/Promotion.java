package vn.edu.fpt.promotionservice.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

// Import các annotation của Jakarta Validation
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Document(collection = "promotion")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Promotion {
    @Id
    private String promotionId; 

    @NotBlank(message = "Tiêu đề khuyến mãi không được để trống")
    @Field(name = "title")
    private String title;

    @NotBlank(message = "Chi tiết khuyến mãi không được để trống")
    @Field(name = "detail")
    private String detail;

    @NotNull(message = "Mức giảm giá không được để trống")
    @Min(value = 1, message = "Mức giảm giá phải lớn hơn hoặc bằng 1")
    @Field(name = "discount_level")
    private Integer discountLevel;

    // Thời gian bắt đầu: Có thể là ngay bây giờ hoặc trong tương lai
    @NotNull(message = "Thời gian bắt đầu không được để trống")
    @FutureOrPresent(message = "Thời gian bắt đầu phải là hiện tại hoặc trong tương lai")
    @Field(name = "start_time")
    private LocalDateTime startTime;

    // Thời gian kết thúc: Bắt buộc phải ở trong tương lai
    @NotNull(message = "Thời gian kết thúc không được để trống")
    @Future(message = "Thời gian kết thúc phải là một ngày trong tương lai")
    @Field(name = "end_time")
    private LocalDateTime endTime;

    @Field(name = "image")
    private String image;

    @NotBlank(message = "Trạng thái không được để trống")
    @Field(name = "status")
    private String status;

    private Boolean isDeleted = false;

    @CreatedDate
    @Field(name = "created_at")
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Field(name = "updated_at")
    private LocalDateTime updatedAt;
}