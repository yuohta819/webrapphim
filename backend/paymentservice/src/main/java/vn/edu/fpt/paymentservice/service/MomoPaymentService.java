package vn.edu.fpt.paymentservice.service;

import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import vn.edu.fpt.paymentservice.config.MomoCipher;

@Service
public class MomoPaymentService {

    @Value("${momo.partner-code}")
    private String partnerCode;
    @Value("${momo.access-key}")
    private String accessKey;
    @Value("${momo.secret-key}")
    private String secretKey;
    @Value("${momo.endpoint}")
    private String momoEndpoint;

    public Map<String, Object> createPayment(String orderId, long amount, String orderInfo, String returnUrl,
            String notifyUrl) {
        String requestId = String.valueOf(System.currentTimeMillis());
        String extraData = "";
        String requestType = "captureWallet";

        // ==========================================
        // DEBUG CHI TIẾT 1: KIỂM TRA INPUT ĐẦU VÀO
        // ==========================================
        System.out.println("====== [DEBUG MOMO] STEP 1: INPUT DATA ======");
        System.out.println("orderId: " + orderId);
        System.out.println("amount: " + amount);
        System.out.println("orderInfo: " + orderInfo);
        System.out.println("notifyUrl (ipnUrl): " + notifyUrl);
        System.out.println("returnUrl (redirectUrl): " + returnUrl);

        // 1. Sắp xếp chuỗi tạo chữ ký
        String rawHash = "accessKey=" + accessKey +
                "&amount=" + amount +
                "&extraData=" + extraData +
                "&ipnUrl=" + notifyUrl +
                "&orderId=" + orderId +
                "&orderInfo=" + orderInfo +
                "&partnerCode=" + partnerCode +
                "&redirectUrl=" + returnUrl +
                "&requestId=" + requestId +
                "&requestType=" + requestType;

        // ==========================================
        // DEBUG CHI TIẾT 2: CHUỖI RAW TRƯỚC KHI MÃ HÓA
        // ==========================================
        System.out.println("====== [DEBUG MOMO] STEP 2: RAW STRING TO SIGN ======");
        System.out.println(rawHash);
        // Hãy copy chuỗi in ra ở đây, so sánh từng ký tự một với chuỗi MoMo trả về
        // trong log lỗi!

        // 2. Tiến hành mã hóa tạo Signature
        String signature = MomoCipher.signHmacSHA256(rawHash, secretKey);
        System.out.println("====== [DEBUG MOMO] STEP 3: GENERATED SIGNATURE ======");
        System.out.println("Signature: " + signature);

        // 3. Đóng gói dữ liệu Payload gửi đi
        Map<String, Object> payload = new HashMap<>();
        payload.put("partnerCode", partnerCode);
        payload.put("partnerName", "Test Partner");
        payload.put("storeId", "MomoStore");
        payload.put("requestId", requestId);
        payload.put("amount", amount);
        payload.put("orderId", orderId);
        payload.put("orderInfo", orderInfo);
        payload.put("redirectUrl", returnUrl);
        payload.put("ipnUrl", notifyUrl);
        payload.put("lang", "vi");
        payload.put("extraData", extraData);
        payload.put("requestType", requestType);
        payload.put("signature", signature);

        // ==========================================
        // FIX LỖI ÉP FORMAT UTF-8 KHI GỬI (QUAN TRỌNG)
        // ==========================================
        RestTemplate restTemplate = new RestTemplate();

        // Ép RestTemplate phải đọc/ghi bằng UTF-8 để không bị lỗi chữ "Rạp Phim"
        restTemplate.getMessageConverters().forEach(converter -> {
            if (converter instanceof org.springframework.http.converter.json.MappingJackson2HttpMessageConverter) {
                ((org.springframework.http.converter.json.MappingJackson2HttpMessageConverter) converter)
                        .setDefaultCharset(StandardCharsets.UTF_8);
            }
        });

        HttpHeaders headers = new HttpHeaders();
        // Đặt Header chuẩn CONTENT-TYPE là JSON và CHARSET là UTF-8
        headers.setContentType(new MediaType("application", "json", StandardCharsets.UTF_8));
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

        // ==========================================
        // DEBUG CHI TIẾT 4: PAYLOAD THỰC TẾ GỬI ĐI
        // ==========================================
        System.out.println("====== [DEBUG MOMO] STEP 4: FINAL PAYLOAD SENT TO MOMO ======");
        System.out.println(payload.toString());

        try {
            return restTemplate.postForObject(momoEndpoint, entity, Map.class);
        } catch (Exception e) {
            System.err.println("====== [DEBUG MOMO] STEP 5: ERROR RESPONSE ======");
            System.err.println("Error Message: " + e.getMessage());
            throw new RuntimeException("Không thể kết nối tới cổng thanh toán MoMo: " + e.getMessage());
        }
    }
}
