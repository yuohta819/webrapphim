package vn.edu.fpt.bankaccountservice.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import vn.edu.fpt.bankaccountservice.client.UserClient;
import vn.edu.fpt.bankaccountservice.dto.UserDTO;
import vn.edu.fpt.bankaccountservice.model.BankAccount;
import vn.edu.fpt.bankaccountservice.repository.BankAccountRepository;
import vn.edu.fpt.commonservice.model.ErrorMessage;
import vn.edu.fpt.commonservice.model.SuccessMessage;

@Service
public class BankAccountService {
    @Autowired
    private BankAccountRepository bankAccountRepository;
    @Autowired
    private UserClient userClient;

    public ResponseEntity<?> create(BankAccount bankAccount) {
        UserDTO userDTO = userClient.getUser(bankAccount.getUserId());
        if (userDTO == null) {
            return ResponseEntity.ok(new ErrorMessage("404", "Tài khoản không tồn tại!!!", HttpStatus.NOT_FOUND));

        }
        bankAccount.setBankAccountId(generateBankAccountId());

        bankAccountRepository.save(bankAccount);
        return ResponseEntity.ok(new SuccessMessage("200", "Tạo đơn hoàn tiền thành công!!!",
                HttpStatus.ACCEPTED.name(), LocalDate.now()));
    }

    public ResponseEntity<?> updateStatus(String bankAccountId) {
        long result = bankAccountRepository.updateIsDeletedStatus(bankAccountId, true);
        if (result == 0) {
            return ResponseEntity
                    .ok(new ErrorMessage("404", "Không tìm thấy đơn hoàn tiền phù hợp!!!", HttpStatus.NOT_FOUND));

        }
        return ResponseEntity.ok(new SuccessMessage("200", "Cập nhật trạng thái thành công!!!",
                HttpStatus.ACCEPTED.name(), LocalDate.now()));
    }

    public BankAccount findBankAcoount(String bankAccountId) {
        return bankAccountRepository.findByBankAccountId(bankAccountId);
    }

    public String generateBankAccountId() {
        // Sinh một số ngẫu nhiên từ 0 đến 99 (100 là giới hạn trên, không bao gồm)
        int randomNumber = ThreadLocalRandom.current().nextInt(100000, 1000000);

        // String.format("%02d", ...) giúp biến số thành chuỗi có 2 chữ số (ví dụ: 5
        // thành "05", 12 thành "12")
        return "BA" + String.format("%02d", randomNumber);
    }

    public String createBankAccountId() {
        String bankAccountId = "";
        Boolean isCheck = false;
        int loopCount = 0;
        while (!isCheck) {
            String bankAccountIdRandom = generateBankAccountId();
            Optional<BankAccount> bankAccount = bankAccountRepository
                    .findByBankAccountIdAndIsDeleted(bankAccountIdRandom, false);
            System.out.println(bankAccount);
            if (bankAccount.isEmpty()) {
                bankAccountId = bankAccountIdRandom;
                isCheck = true;
            }
            loopCount++;
            if (loopCount >= 1000) {
                isCheck = true;
            }
        }
        if (bankAccountId.isEmpty()) {
            return "Error";
        }
        return bankAccountId;
    }

    public List<BankAccount> findAllBankAccount() {
        return bankAccountRepository.findByIsDeleted(false);
    }

}
