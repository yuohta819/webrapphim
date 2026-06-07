package vn.edu.fpt.userservice.service;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import vn.edu.fpt.commonservice.model.ErrorMessage;
import vn.edu.fpt.commonservice.model.SuccessMessage;
import vn.edu.fpt.userservice.config.JwtUntil;
import vn.edu.fpt.userservice.dto.AccountClaimToken;
import vn.edu.fpt.userservice.dto.AccountMemberDto;
import vn.edu.fpt.userservice.dto.CountAccount;
import vn.edu.fpt.userservice.dto.CountMovieDTO;
import vn.edu.fpt.userservice.model.Account;
import vn.edu.fpt.userservice.repository.AccountRepository;

@Service
public class UserService {
    private AccountRepository accountRepository;

    @Autowired
    private JwtUntil jwtUntil;
    private static final String TOPIC_ACCOUNT_ROLLBACK = "account-rollback-topic";
    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    public UserService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    public ResponseEntity<?> create(AccountMemberDto accountMember) {
        accountMember.getAccountMap().setRegisterDate(LocalDateTime.now());
        if (accountMember.getAccountMap().getPhone().length() != 10) {
            kafkaTemplate.send(TOPIC_ACCOUNT_ROLLBACK, "Same Phone");
            return ResponseEntity.ok(new ErrorMessage("400", "Số điện thoại phải đủ 10 số", HttpStatus.BAD_REQUEST));
        }
        boolean count = accountRepository.checkExistByEmailOrPhoneOrIdCard(accountMember.getAccountMap().getPhone(),
                accountMember.getAccountMap().getIdentityCard());
        if (count) {
            kafkaTemplate.send(TOPIC_ACCOUNT_ROLLBACK, accountMember.getAccountMap().getEmail());
            return ResponseEntity
                    .ok(new ErrorMessage("409", "Email, ID Card hoặc Phone đã được đăng kí ", HttpStatus.CONFLICT));
        }
        Account account = new Account();
        account.setUserId(accountMember.getAccountMap().getUserId());
        BeanUtils.copyProperties(accountMember.getAccountMap(), account);
        accountRepository.save(account);
        try {

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorMessage("500", "Lỗi hệ thống khi gửi event", HttpStatus.INTERNAL_SERVER_ERROR));
        }
        return ResponseEntity.ok(new SuccessMessage("200", "Tạo tài khoản thành công", "SUCCESS", LocalDate.now()));
    }

    public Account infor(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        Claims claims = jwtUntil.extractAllClaims(token);
        AccountClaimToken accountClaimToken = new AccountClaimToken();
        accountClaimToken.setId((String) claims.get("accountid"));
        return accountRepository.getByUserId(accountClaimToken.getId());
    }

    public ResponseEntity<?> inforUser(String userId) {
        try {
            Account account = accountRepository.getByUserId(userId);

            if (account == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ErrorMessage("404", "Không tìm thấy người dùng!", HttpStatus.NOT_FOUND));
            }

            return ResponseEntity.ok(account);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorMessage("500", "Có lỗi hệ thống xảy ra. Vui lòng thử lại sau!",
                            HttpStatus.INTERNAL_SERVER_ERROR));
        }
    }

    public ResponseEntity<?> updateStatus(String accountId, String status) {
        try {
            Integer codeBank = Integer.parseInt(status);
            Integer userId = Integer.parseInt(accountId);
            Boolean isBank = false;
            if (codeBank == 1) {
                isBank = true;
            }
            int result = accountRepository.updateroleBank(userId, isBank);
            if (result == 0) {
                return ResponseEntity.ok(new ErrorMessage("400", "Tài khoản không tồn tại", HttpStatus.BAD_REQUEST));
            }
            return ResponseEntity.ok(
                    new SuccessMessage("200", "Cập nhật trạng thái hoàn tiền thành công!!!!", "SUCCESS",
                            LocalDate.now()));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorMessage("500", "Có lỗi hệ thống xảy ra. Vui lòng thử lại sau!",
                            HttpStatus.INTERNAL_SERVER_ERROR));
        }
    }

    public ResponseEntity<?> countUser(String month, String year) {
        try {
            Integer monthInteger = Integer.parseInt(month);
            Integer yearInteger = Integer.parseInt(year);
            CountMovieDTO countUserDTO = new CountMovieDTO();
            Long count = accountRepository.countAccountsByMonthAndYear(monthInteger, yearInteger);
            countUserDTO.setCount(count != null ? count : 0L);
            return ResponseEntity.ok(countUserDTO);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity
                    .ok(new ErrorMessage("500", "Lỗi dữ liệu vui lòng tải lại trang!!!!", HttpStatus.NOT_FOUND));
        }
    }

    public CountAccount getCountAccount() {
        Long countAccount1 = accountRepository.countByIsDeletedFalse();
        CountAccount account = new CountAccount();
        account.setCount(countAccount1);
        return account;
    }
}