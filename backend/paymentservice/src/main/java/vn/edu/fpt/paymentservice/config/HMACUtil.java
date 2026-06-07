package vn.edu.fpt.paymentservice.config;

import java.nio.charset.StandardCharsets;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

public class HMACUtil {
    public static String hmacHex64(String algorithm, String key, String data) {
        try {
            Mac sha256_HMAC = Mac.getInstance(algorithm);
            SecretKeySpec secret_key = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), algorithm);
            sha256_HMAC.init(secret_key);
            
            byte[] hashBytes = sha256_HMAC.doFinal(data.getBytes(StandardCharsets.UTF_8));
            
            // Chuyển đổi byte sang chuỗi Hex chuẩn xác nhất
            StringBuilder hexString = new StringBuilder();
            for (byte b : hashBytes) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            throw new RuntimeException("Lỗi thực hiện băm HMAC SHA256", e);
        }
    }
}
