package vn.edu.fpt.bookingservice.model;

import java.math.BigInteger;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Getter;
import lombok.Setter;

@Document(collection = "booking")
@Getter
@Setter
public class Booking {
    @Id
    private String bookingId;

    private Long userId;
    private Long movieId;
    private List<BookingSeat> seats;
    private Double totalPrice;
    private String status;
    private Boolean isDeleted;
    private Long roomId;
    private Integer score;
    private BigInteger showTimeId;
    private String promotionId;
    @CreatedDate // Tự động điền thời gian khi tạo mới (Insert)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy HH:mm", timezone = "Asia/Ho_Chi_Minh")
    private LocalDateTime createdAt;

    @LastModifiedDate // Tự động cập nhật thời gian mỗi khi sửa (Update/Save)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy HH:mm", timezone = "Asia/Ho_Chi_Minh")
    private LocalDateTime updatedAt; // Sửa lại tên cho chuẩn ngữ pháp

    private LocalDateTime expiryDate; // Mốc thời gian hết hạn
}