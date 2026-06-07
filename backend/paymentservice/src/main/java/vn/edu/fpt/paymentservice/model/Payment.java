package vn.edu.fpt.paymentservice.model;

import java.math.BigInteger;
import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "payment")
public class Payment {
    @Id
     private String paymentId;

    private String bookingId;

    private Long amount;

    private String orderId;

    private String paymentMethod;

    private String paymentStatus;


    private LocalDateTime createdAt;

    private Map<String, Object> gatewayResponse;

    private Boolean isDeleted;

    @Field("app_trans_id")
    private String appTransId; // Mã đơn hàng bạn gửi đi (YYMMDD_id)


    private String zpTransId;  // Mã giao dịch ZaloPay trả về khi thành công

    private String mac;
}
