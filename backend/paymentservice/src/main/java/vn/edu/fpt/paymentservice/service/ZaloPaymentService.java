package vn.edu.fpt.paymentservice.service;

import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.Date;
import java.util.Map;
import org.apache.hc.core5.http.ContentType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

// Import cấu trúc dữ liệu Form cho OkHttp
import okhttp3.FormBody;
import okhttp3.OkHttpClient;
import okhttp3.RequestBody;
import vn.edu.fpt.commonservice.model.ErrorMessage;
import vn.edu.fpt.commonservice.model.SuccessMessage;
import vn.edu.fpt.paymentservice.config.HMACUtil;
import vn.edu.fpt.paymentservice.dto.PaymentZaloRequestDTO;
import vn.edu.fpt.paymentservice.repository.PaymentRepository;

@Service
public class ZaloPaymentService {
    @Value("${zalopay.app-id}")
    private String appId;

    @Value("${zalopay.key1}")
    private String key1;
    @Value("${zalopay.key2}")
    private String key2;
    @Value("${zalopay.endpoint.create-order}")
    private String createOrderUrl;
    @Value("${zalopay.callbackurl}")
    private String callbackUrl;
    @Autowired
    private PaymentRepository paymentRepository;
    private final OkHttpClient okHttpClient = new OkHttpClient();
    private static final String TOPIC_BOOKING_STATUS = "booking-status-topic";
    private static final String TOPIC_SEAT_STATUS = "seat-status-topic";
    private static final String TOPIC_TICKET_CREATE = "ticket-create-topic";
    private static final String TOPIC_NOTIFICATION = "notification-topic";
    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    public PaymentZaloRequestDTO createOrder(long amount, String paymentId) {
        try {
            // 1. Khởi tạo thời gian và ID giao dịch
            long expireDuration = 300;
            long currentTime = System.currentTimeMillis();
            String orderId = String.valueOf(currentTime);
            String appTransId = new SimpleDateFormat("yyMMdd").format(new Date()) + "_" + orderId;

            String appTime = String.valueOf(currentTime);
            String amountStr = String.valueOf(amount);
            String embedData = "{}";
            String item = "[]";
            String description = "Thanh toan don hang #" + orderId;
            String appUser = "user123";
            String dataToHash = appId + "|" +
                    appTransId + "|" +
                    appUser + "|" +
                    amountStr + "|" +
                    appTime + "|" +
                    embedData + "|" +
                    item;

            System.out.println("==> Chuỗi đem đi Hash thực tế: " + dataToHash);

            String mac = HMACUtil.hmacHex64("HmacSHA256", key1.trim(), dataToHash);
            System.out.println("==> Mã MAC tạo ra: " + mac);

            ObjectMapper mapper = new ObjectMapper();
            ObjectNode bodyJson = mapper.createObjectNode();

            bodyJson.put("app_id", Integer.parseInt(appId)); // Bắt buộc là INT: 2553
            bodyJson.put("app_user", appUser); // String
            bodyJson.put("app_time", Long.parseLong(appTime)); // Bắt buộc là LONG
            bodyJson.put("amount", amount); // Bắt buộc là LONG
            bodyJson.put("app_trans_id", appTransId); // String
            bodyJson.put("embed_data", embedData); // String "{}"
            bodyJson.put("expire_duration_seconds", expireDuration);
            bodyJson.put("item", item); // String "[]"
            bodyJson.put("description", description); // String
            bodyJson.put("bank_code", "zalopayapp"); // String
            bodyJson.put("callback_url", callbackUrl); // String
            bodyJson.put("mac", mac); // String

            updatePaymentAppId(appTransId, paymentId, mac);
            String jsonPayload = mapper.writeValueAsString(bodyJson);
            System.out.println("==> JSON Payload gửi đi: " + jsonPayload);
            // 4. Gửi Request bằng JSON BODY (application/json) thay vì Form
            String responseStr = org.apache.hc.client5.http.fluent.Request.post(createOrderUrl)
                    .bodyString(jsonPayload, ContentType.APPLICATION_JSON)
                    .execute()
                    .returnContent()
                    .asString(StandardCharsets.UTF_8);

            System.out.println("==> ZaloPay Response: " + responseStr);
            return mapper.readValue(responseStr, PaymentZaloRequestDTO.class);

        } catch (Exception e) {
            e.printStackTrace();

            // 3. Xử lý trường hợp lỗi: Tạo một object DTO báo lỗi để return thay vì trả về
            // chuỗi String lỗi cũ
            PaymentZaloRequestDTO errorResponse = new PaymentZaloRequestDTO();
            errorResponse.setReturnCode(2);
            errorResponse.setReturnMessage("Lỗi hệ thống: " + e.getMessage());
            return errorResponse;
        }
    }

    public Map<String, Object> receiveCallback(Map<String, Object> requestBody) {
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode result = mapper.createObjectNode();

        // === ĐOẠN CODE IN DỮ LIỆU ===
        try {
            String jsonString = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(requestBody);
            System.out.println("================= ZALOPAY CALLBACK REQUEST BODY =================");
            System.out.println(jsonString);
            System.out.println("================================================================");
        } catch (Exception e) {
            System.out.println("Không thể in requestBody dạng JSON: " + e.getMessage());
        }
        try {
            String dataStr = (String) requestBody.get("data");
            String requestMac = (String) requestBody.get("mac");

            // 1. Tính toán lại mã MAC bằng data nhận được và KEY2
            String expectedMac = HMACUtil.hmacHex64("HmacSHA256", key2, dataStr);

            // 2. Kiểm tra chữ ký xem có trùng khớp không
            if (!expectedMac.equals(requestMac)) {
                // Thất bại: Chữ ký không hợp lệ (có thể có ai đó đang giả mạo request)
                result.put("return_code", -1);
                result.put("return_message", "mac not equal");
            } else {
                // Thành công: Chữ ký hợp lệ, giải mã data để lấy thông tin chi tiết
                Map<String, Object> dataJson = mapper.readValue(dataStr, Map.class);

                String appTransId = (String) dataJson.get("app_trans_id");
                long amount = ((Number) dataJson.get("amount")).longValue();
                String zpTransId = String.valueOf(dataJson.get("zp_trans_id"));

                // KIỂM TRA TRẠNG THÁI THỰC TẾ CỦA ĐƠN HÀNG TRONG DATA
                // ZaloPay quy định: return_code = 1 trong data nghĩa là người dùng đã trừ tiền
                // thành công
                int dataReturnCode = ((Number) dataJson.getOrDefault("return_code", 1)).intValue();
                System.out.println(dataReturnCode);
                if (dataReturnCode == 1) {
                    // CƠ CHẾ 1: THANH TOÁN THÀNH CÔNG
                    System.out.println("==> [SUCCESS] Thanh toán THÀNH CÔNG cho đơn hàng: " + appTransId);
                    System.out.println("==> Số tiền: " + amount + " | Mã ZaloPay: " + zpTransId);

                    updatePaymentSuccess(appTransId, zpTransId, "SUCCESS");

                } else {
                    // CƠ CHẾ 2: THANH TOÁN THẤT BẠI HOẶC BỊ HUỶ
                    System.out.println("==> [FAILED] Giao dịch thất bại hoặc bị huỷ cho đơn hàng: " + appTransId);
                    updatePaymentSuccess(appTransId, zpTransId, "CANCEL");
                    // TODO: Cập nhật DB của bạn: status = "FAILED" hoặc "CANCELLED"
                    // bookingService.updateStatus(appTransId, "FAILED");
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            result.put("return_code", 0); // Lỗi hệ thống của bạn, ZaloPay sẽ gửi lại callback sau
            result.put("return_message", e.getMessage());
        }

        // Trả về kết quả cho ZaloPay biết bạn đã xử lý xong, nếu không họ sẽ gọi lại
        // liên tục
        return mapper.convertValue(result, Map.class);
    }

    public void updatePaymentAppId(String appTransId, String id, String mac) {

        paymentRepository.findByPaymentIdAndIsDeleted(id, false).ifPresent(payment -> {
            payment.setAppTransId(appTransId); // Cập nhật trạng thái thành Đã thanh toán
            payment.setMac(mac);
            paymentRepository.save(payment); // MongoRepository tự động UPDATE vì đã trùng ID thô
            System.out.println("==> DB đã cập nhật thành công cho đơn: " + appTransId);
        });
    }

    public void updatePaymentSuccess(String appTransId, String zpTransId, String status) {

        paymentRepository.findByAppTransIdAndIsDeleted(appTransId, false).ifPresent(payment -> {
            payment.setPaymentStatus(status);
            payment.setZpTransId(zpTransId);
            paymentRepository.save(payment); // MongoRepository tự động UPDATE vì đã trùng ID thô
            System.out.println("==> DB đã cập nhật thành công cho đơn: " + appTransId);
        });
    }

    public ResponseEntity<?> checkOrderStatus(String appTransId, String bookingId, String showTimeId) {
        try {
            if (paymentRepository.findByBookingIdAndIsDeleted(bookingId, false).isEmpty()) {
                return ResponseEntity.ok(new ErrorMessage("404", "Không tìm thấy đơn thanh toán!!!", "null",
                        HttpStatus.NOT_FOUND));
            }
            if (paymentRepository.findByAppTransIdAndIsDeleted(appTransId, false).isEmpty()) {
                return ResponseEntity.ok(new ErrorMessage("404", "Mã thanh toán bị sai. Vui lòng thử lại sau!!!", "null",
                        HttpStatus.NOT_FOUND));
            }
            String dataToHash = appId + "|" + appTransId + "|" + key1.trim();
            String mac = HMACUtil.hmacHex64("HmacSHA256", key1.trim(), dataToHash);

            // 💥 ĐỔI: Sử dụng chuẩn RequestBody cho Form dữ liệu
            RequestBody formBody = new FormBody.Builder()
                    .add("app_id", appId)
                    .add("app_trans_id", appTransId)
                    .add("mac", mac)
                    .build();

            // 💥 ĐỔI: Gọi đích danh okhttp3.Request để tránh đụng hàng
            okhttp3.Request request = new okhttp3.Request.Builder()
                    .url("https://sb-openapi.zalopay.vn/v2/query")
                    .post(formBody)
                    .build();

            // 💥 ĐỔI: Dùng biến okHttpClient đã khai báo ở đầu Class và khai báo rõ
            // okhttp3.Response
            try (okhttp3.Response response = okHttpClient.newCall(request).execute()) {
                if (response.isSuccessful() && response.body() != null) {
                    String responseData = response.body().string();
                    System.out.println("==> Trạng thái thực tế từ ZaloPay: " + responseData);

                    ObjectMapper mapper = new ObjectMapper();
                    JsonNode rootNode = mapper.readTree(responseData);
                    int returnCode = rootNode.get("return_code").asInt();

                    if (returnCode == 1) {
                        System.out.println("-> Đơn hàng đã THANH TOÁN THÀNH CÔNG!");
                        updatePaymentSuccess(appTransId, rootNode.get("zp_trans_id").asText(), "SUCCESS");
                        kafkaTemplate.send(TOPIC_BOOKING_STATUS, bookingId + ":" + "BOOKED");
                        kafkaTemplate.send(TOPIC_TICKET_CREATE, bookingId);
                        kafkaTemplate.send(TOPIC_NOTIFICATION, bookingId);
                        return ResponseEntity.ok(new SuccessMessage("200", "Đơn hàng thanh toán thành công!",
                                "ACCEPTED", LocalDate.now()));
                    } else if (returnCode == 2) {
                        System.out.println("-> Đơn hàng THANH TOÁN THẤT BẠI hoặc ĐÃ HẾT HẠN!");
                        updatePaymentSuccess(appTransId, "", "FAILED");
                        kafkaTemplate.send(TOPIC_BOOKING_STATUS, bookingId + ":" + "FAILED");
                        kafkaTemplate.send(TOPIC_SEAT_STATUS, bookingId + ":" + "FAILED" + ":" + showTimeId);
                        return ResponseEntity.ok(new SuccessMessage("200",
                                "Đơn hàng thanh toán thất bại. Hết thời hạn thanh toán!", "FAILED", LocalDate.now()));
                    } else if (returnCode == 3) {
                        System.out.println("-> Đơn hàng vẫn đang CHỜ THANH TOÁN...");
                        kafkaTemplate.send(TOPIC_BOOKING_STATUS, bookingId + ":" + "FAILED");
                        return ResponseEntity
                                .ok(new SuccessMessage("200", "Đang chờ thanh toán!", "PENDING", LocalDate.now()));
                    }
                }
            }
            return ResponseEntity.ok(new SuccessMessage("200", "Đang chờ thanh toán!", "PENDING", LocalDate.now()));
        } catch (Exception e) {
            return ResponseEntity.ok(new SuccessMessage("500", e.getMessage(), "PENDING", LocalDate.now()));

        }
    }
}
