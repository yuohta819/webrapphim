package vn.edu.fpt.paymentservice.enums; // Dòng package PHẢI ở đầu tiên

// Các dòng import (nếu có) phải đặt ở ĐÂY, dưới dòng package
// import com.fasterxml.jackson.annotation.JsonValue; 

public enum TransactionStatus {
    PENDING("Đang chờ thanh toán"),   // Bỏ chữ displayName: đi bạn nhé
    SUCCESS("Thanh toán thành công"),
    FAILED("Thanh toán thất bại"),
    CANCELLED("Đã hủy giao dịch"),
    EXPIRED("Giao dịch hết hạn"),
    REFUNDED("Đã hoàn tiền");

    private final String displayName;

    TransactionStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}