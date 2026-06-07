package vn.edu.fpt.authservice.service;

import java.math.BigInteger;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;
import java.util.logging.ErrorManager;

import javax.management.relation.Role;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import jakarta.validation.Valid;
import vn.edu.fpt.authservice.client.UserClient;
import vn.edu.fpt.authservice.config.JwtUntil;
import vn.edu.fpt.authservice.dto.AccountMemberDto;
import vn.edu.fpt.authservice.dto.ErrorResponse;
import vn.edu.fpt.authservice.dto.TrackingEvent;
import vn.edu.fpt.authservice.dto.UpdatePassword;
import vn.edu.fpt.authservice.model.Account;
import vn.edu.fpt.authservice.model.Member;
import vn.edu.fpt.authservice.model.Roles;
import vn.edu.fpt.authservice.repository.AccountRepository;
import vn.edu.fpt.authservice.repository.MemberRepository;
import vn.edu.fpt.authservice.repository.RolesRepository;
import vn.edu.fpt.commonservice.model.ErrorMessage;
import vn.edu.fpt.commonservice.model.SuccessMessage;

@Service
public class AuthService {
    private MemberRepository memberRepository;
    private RolesRepository rolesRepository;
    private JwtUntil jwtUtils;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private AccountRepository accountRepository;
    private RestClient restClient;

    @Autowired
    private OtpService otpService;
    @Autowired
    private StringRedisTemplate redisTemplate;
    private static final String REDIS_KEY_PREFIX = "movie:";
    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;
    private final String TOPIC_TRACKING_USER = "user-tracking-events";
    @Autowired
    private UserClient userClient;

    public AuthService(MemberRepository memberRepository, RolesRepository rolesRepository,
            JwtUntil jwtUtils, AccountRepository accountRepository, RestClient restClient) {
        this.memberRepository = memberRepository;
        this.rolesRepository = rolesRepository;
        this.jwtUtils = jwtUtils;
        this.accountRepository = accountRepository;
        this.restClient = restClient;
    }

    public ResponseEntity<?> loginMember(Account login) {
        Account account = accountRepository.checkEmail(login.getEmail());
        if (account == null) {
            return ResponseEntity.ok(new ErrorMessage("404", "Tài khoản hoặc mật khẩu sai", HttpStatus.NOT_FOUND));
        }
        if (!passwordEncoder.matches(login.getPassword(), account.getPassword())) {
            return ResponseEntity.ok(new ErrorMessage("404", "Mật khẩu sai", HttpStatus.NOT_FOUND));
        }
        Map<String, Object> response = new HashMap<>();
        response.put("token",
                jwtUtils.generateToken(account.getEmail(), account.getId(), account.getEmail(),
                        account.getRoles().getRoleName(),account.getUserId()));
        response.put("accountid", account.getUserId());
        response.put("account", account.getEmail());
        System.out.println(account.getRoles().getRoleName());
        response.put("role", account.getRoles().getRoleName());
        return ResponseEntity.ok(response);
    }

    public ResponseEntity<?> create(AccountMemberDto accountMember, String roleAccount) {
        if (accountRepository.checkEmail(accountMember.getAccountMap().getEmail()) != null) {
            return ResponseEntity
                    .ok(new ErrorMessage("409", "Email, ID Card hoặc Phone đã được đăng kí ",
                            HttpStatus.CONFLICT));
        }
        if (roleAccount.equalsIgnoreCase("Member")) {
            otpService.checkStatusEmail(accountMember.getAccountMap().getEmail());
        }
        String hashedPassword = passwordEncoder.encode(accountMember.getAccountMap().getPassword());
        Roles role = rolesRepository.getByRoleName(roleAccount);
        Account account = new Account();
        Member member = new Member();
        String userId = generateCustomBookingId();
        account.setEmail(accountMember.getAccountMap().getEmail());
        account.setPassword(hashedPassword);
        account.setRoles(role);
        account.setCreateAt(LocalDateTime.now());
        member.setScore(BigInteger.ZERO);
        member.setAccount(account);
        member.setUserId(userId);
        Member inforMember = memberRepository.save(member);
        
        accountRepository.updateUserIdByAccountId(userId, accountMember.getAccountMap().getEmail());
        accountMember.getAccountMap().setUserId(userId);
        ;
        try {

            ErrorResponse result = userClient.createMember(accountMember);
            if (result != null && "409".equals(result.getCode())) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(result);

            } else {
                return ResponseEntity
                        .ok(new SuccessMessage("200", "Tạo tài khoản thành công", "SUCCESS", LocalDate.now()));
            }

        } catch (Exception e) {
            // Khối catch này chỉ bắt khi sập server, sai URL, timeout...
            System.out.println("Lỗi kết nối hệ thống: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi kết nối tới UserService");
        }

    }

    public ResponseEntity<?> updatePassword(UpdatePassword updatePassword) {

        String oldPassword = updatePassword.getPasswordOld();
        String newPassword = updatePassword.getPasswordNew();
        Account account = accountRepository.getByUserId(updatePassword.getUserId());
        if (account == null) {
            return ResponseEntity.ok(new ErrorMessage("404", "Tài khoản không tồn tại!!", HttpStatus.NOT_FOUND));
        }
        String key = "Authention:" + account.getEmail();
        String result = redisTemplate.opsForValue().get(key);
        if (result == null || !result.equalsIgnoreCase("true")) {
            return ResponseEntity.ok(new ErrorMessage("404", "Email chưa được xác nhận!!!!!", HttpStatus.NOT_FOUND));
        }

        if (!passwordEncoder.matches(oldPassword, account.getPassword())) {
            return ResponseEntity.ok(new ErrorMessage("404", "Mật khẩu cũ sai", HttpStatus.NOT_FOUND));
        }
        String hashedPassword = passwordEncoder.encode(newPassword);
        account.setPassword(hashedPassword);
        account.setUpdateAt(LocalDateTime.now());
        accountRepository.save(account);
        TrackingEvent event = new TrackingEvent();
        event.setEventId(UUID.randomUUID().toString());
        event.setEventType("UPDATE_PASSWORD");
        event.setUserId("ANONYMOUS");
        event.setSource("auth-service");

        Map<String, Object> props = new HashMap<>();
        props.put("user_id", updatePassword.getUserId());
        event.setProperties(props);
        kafkaTemplate.send(TOPIC_TRACKING_USER, String.valueOf(updatePassword.getUserId()), event);
        if (result.equalsIgnoreCase("true")) {
            redisTemplate.delete(key); // Xóa mã ngay sau khi dùng thành công để bảo mật

        }
        return ResponseEntity.ok(new SuccessMessage("404", "Cập nhật mật khẩu thành công!!!!",
                HttpStatus.ACCEPTED.name(), LocalDate.now()));
    }

    public ResponseEntity<?> findUserId(String accountId) {
        Optional<Account> account = accountRepository.findByUserId(accountId);
        if (account.isEmpty()) {
            return ResponseEntity
                    .ok(new ErrorMessage("404", "Không tìm thấy đơn Booking", HttpStatus.NOT_FOUND));
        }
        return ResponseEntity.ok(account.get());
    }

    public String generateCustomBookingId() {
        // Sinh một số ngẫu nhiên từ 0 đến 99 (100 là giới hạn trên, không bao gồm)
        int randomNumber = ThreadLocalRandom.current().nextInt(100000, 1000000);

        // String.format("%02d", ...) giúp biến số thành chuỗi có 2 chữ số (ví dụ: 5
        // thành "05", 12 thành "12")
        return "US" + String.format("%02d", randomNumber);
    }

    public ResponseEntity<?> findUser(String userId) {
        Account account = accountRepository.getByUserId(userId);
        if (account == null) {
            return ResponseEntity.ok(new ErrorMessage("404", "Không tìm thấy thông tin!!!", HttpStatus.NOT_FOUND));
        }
        return ResponseEntity.ok(account);
    }
}
