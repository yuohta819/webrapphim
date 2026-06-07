package vn.edu.fpt.authservice.consumer;

import java.math.BigInteger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import vn.edu.fpt.authservice.model.Account;
import vn.edu.fpt.authservice.repository.AccountRepository;
@Component
public class UpdateScoreBeforeBooking {
     @Autowired
    private AccountRepository accountRepository;
    @KafkaListener(topics = "score-update-before-topic", groupId = "auth-score-before-service-group")
    public void consumerUpdateScore(String result) {
        String cleanResult = result.replace("\"", "").trim();
        // 1. Tìm tất cả tài khoản trùng email, sắp xếp theo ID tăng dần
        String userId = cleanResult.split(":")[0] + "";
        java.math.BigInteger price = new java.math.BigDecimal(cleanResult.split(":")[1]).toBigInteger();
        System.out.println(cleanResult);
        accountRepository.updateScore(userId, price);
        
    }
}
