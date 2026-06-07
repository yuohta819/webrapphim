package vn.edu.fpt.authservice.consumer;

import java.math.BigInteger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import jakarta.transaction.Transactional;
import vn.edu.fpt.authservice.model.Account;
import vn.edu.fpt.authservice.repository.AccountRepository;

@Component
public class UpdateScoreAccount {
    @Autowired
    private AccountRepository accountRepository;

    @KafkaListener(topics = "score-update-topic", groupId = "auth-score-service-group")
    public void consumerUpdateScore(String result) {
        String cleanResult = result.replace("\"", "").trim();
        // 1. Tìm tất cả tài khoản trùng email, sắp xếp theo ID tăng dần
        String userId = cleanResult.split(":")[0] + "";
        Integer price = Integer.parseInt(cleanResult.split(":")[1]);
        Account account = accountRepository.getByUserId(userId);
        BigInteger oldPrice = account.getMember().getScore();
        if (price >= 200000) {
            BigInteger newScore = oldPrice.add(BigInteger.valueOf(10000));

            accountRepository.updateScore(userId, newScore);
            return;
        }
        System.out.println(price);
        if (price >= 50000) {
            BigInteger newScore = oldPrice.add(BigInteger.valueOf(1000));

            accountRepository.updateScore(userId, newScore);
            return;
        }
    }
}
