package vn.edu.fpt.authservice.consumer;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import jakarta.transaction.Transactional;
import vn.edu.fpt.authservice.model.Account;
import vn.edu.fpt.authservice.repository.AccountRepository;

@Component
public class RollBackAccount {
    @Autowired
    private AccountRepository accountRepository;

    @KafkaListener(topics = "account-rollback-topic", groupId = "auth-service-group")
    @Transactional
    public void consumerCallback(String result) {
        // 1. Tìm tất cả tài khoản trùng email, sắp xếp theo ID tăng dần
        System.out.println(result + " error");
        if (result != null) {
            result = result.trim(); // Xóa khoảng trắng nếu có
            if (result.startsWith("\"") && result.endsWith("\"")) {
                result = result.substring(1, result.length() - 1); // Cắt bỏ ký tự " ở đầu và cuối
            }
        }
        Account accounts = accountRepository.findByEmailOrderByIdAsc(result);
        System.out.println(accounts);
        // 2. Nếu có nhiều hơn 1 tài khoản trùng nhau
        if (accounts != null) {
            accountRepository.delete(accounts);
        }
        

    }

}
