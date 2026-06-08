package vn.edu.fpt.authservice.service;

import java.time.Duration;
import java.time.LocalDate;
import java.util.Random;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import vn.edu.fpt.commonservice.model.ErrorMessage;
import vn.edu.fpt.commonservice.model.SuccessMessage;

@Service
public class OtpService {

    @Autowired
    private StringRedisTemplate redisTemplate;

    private static final String OTP_PREFIX = "otp:";
    private static final long OTP_VALID_DURATION_MINUTES = 5;
    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;
    private static final String TOPIC_EMAIL_CODE = "email-code-topic";

    // 1. Tạo và lưu OTP vào Redis
    public ResponseEntity<?> generateAndSaveOtp(String email) {
        // Sinh mã ngẫu nhiên 6 chữ số
        String otpCode = String.format("%06d", new Random().nextInt(999999));
        String key = OTP_PREFIX + email;
        if (!isAllowed(email)) {
            // Ném ra một Custom Exception để Controller bắt và trả về 429
            return ResponseEntity
                .ok(new ErrorMessage("429", "Không được gửi quá nhiều mã!!!", "null", HttpStatus.TOO_MANY_REQUESTS));
        }
        // Lưu vào Redis với TTL là 5 phút
        redisTemplate.opsForValue().set(key, otpCode, Duration.ofMinutes(OTP_VALID_DURATION_MINUTES));
        kafkaTemplate.send(TOPIC_EMAIL_CODE, email);

        return ResponseEntity
                .ok(new SuccessMessage("200", "Gửi OTP Thành Công!!!", HttpStatus.ACCEPTED.name(), LocalDate.now()));
    }

    public void emailAuthentication(String email) {
        String key = "Authention:" + email;
        redisTemplate.opsForValue().set(key, "true", Duration.ofMinutes(OTP_VALID_DURATION_MINUTES));
    }

    // 2. Xác thực OTP từ người dùng nhập vào
    public ResponseEntity<?> verifyOtp(String email, String userOtp) {
        String key = OTP_PREFIX + email;
        String savedOtp = redisTemplate.opsForValue().get(key);
        System.out.println(savedOtp);
        if (savedOtp == null || !savedOtp.equalsIgnoreCase(userOtp)) {
            return ResponseEntity.ok(new vn.edu.fpt.commonservice.model.ErrorMessage("404", "Mã OTP không tồn tại hoặc sai", "null",
                    HttpStatus.NOT_FOUND));

        }

        if (savedOtp.equals(userOtp)) {
            redisTemplate.delete(key); // Xóa mã ngay sau khi dùng thành công để bảo mật

        }
        emailAuthentication(email);
        return ResponseEntity
                .ok(new SuccessMessage("200", "Mã OTP hợp lệ", HttpStatus.ACCEPTED.name(), LocalDate.now()));

    }

    public ResponseEntity<?> checkStatusEmail(String email) {
        String key = "Authention:" + email;
        String result = redisTemplate.opsForValue().get(key);
        if (result == null || !result.equalsIgnoreCase("true")) {
            throw new RuntimeException("Email chưa được xác nhận!!!!!");
        }
        if (result.equalsIgnoreCase("true")) {
            redisTemplate.delete(key); // Xóa mã ngay sau khi dùng thành công để bảo mật

        }
        return ResponseEntity
                .ok(new SuccessMessage("200", "Mã OTP hợp lệ", HttpStatus.ACCEPTED.name(), LocalDate.now()));
    }

    public boolean isAllowed(String email) {
        String key = "mail_limit:" + email;
        Long count = redisTemplate.opsForValue().increment(key);

        if (count == 1) {
            // Set thời hạn 60 giây cho mỗi lần gửi
            redisTemplate.expire(key, 10, TimeUnit.MINUTES);
            return true;
        }
        
        // Nếu số lần gửi vượt quá 5 lần trong 60 giây (ví dụ)
        if (count > 1) {
            return false;
        }
        
        return true;
    }
}