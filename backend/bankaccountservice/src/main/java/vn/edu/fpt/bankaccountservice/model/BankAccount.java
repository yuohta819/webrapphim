package vn.edu.fpt.bankaccountservice.model;

import java.math.BigInteger;
import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Document(collection = "bank_accounts")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BankAccount {

    @Id
    private String bankAccountId;

    // Tên ngân hàng
    private String bankName;

    // Số tài khoản
    private String accountNumber;

    // Chủ tài khoản
    private String accountHolder;

    // Link ảnh QR (Cloudinary)
    private String qrImageUrl;

    // Trạng thái sử dụng
    private Boolean active;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy HH:mm", timezone = "Asia/Ho_Chi_Minh")
    private LocalDateTime createdAt = LocalDateTime.now();
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy HH:mm", timezone = "Asia/Ho_Chi_Minh")
    private LocalDateTime updatedAt;
    private Boolean isDeleted = false;
    private Integer userId;

}
