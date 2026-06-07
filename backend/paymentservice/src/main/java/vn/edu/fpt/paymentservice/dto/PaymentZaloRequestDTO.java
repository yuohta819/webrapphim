package vn.edu.fpt.paymentservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
public class PaymentZaloRequestDTO {
    @JsonProperty("return_code")
    private int returnCode;

    @JsonProperty("return_message")
    private String returnMessage;

    @JsonProperty("sub_return_code")
    private int subReturnCode;

    @JsonProperty("sub_return_message")
    private String subReturnMessage;

    @JsonProperty("zp_trans_token")
    private String zpTransToken;

    @JsonProperty("order_url")
    private String orderUrl;

    @JsonProperty("cashier_order_url")
    private String cashierOrderUrl;

    @JsonProperty("order_token")
    private String orderToken;

    @JsonProperty("qr_code")
    private String qrCode;
}
