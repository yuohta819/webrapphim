package vn.edu.fpt.authservice.controller;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import vn.edu.fpt.authservice.dto.AccountMemberDto;
import vn.edu.fpt.authservice.dto.UpdatePassword;
import vn.edu.fpt.authservice.model.Account;
import vn.edu.fpt.authservice.service.AuthService;
import vn.edu.fpt.authservice.service.OtpService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/account")
public class AuthController {
    private AuthService authService;
    @Autowired
    private OtpService otpService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }
    // khong can token
    @PostMapping("/login")
    public ResponseEntity<?> postMethodName(@RequestBody Account login) {
        return authService.loginMember(login);
    }
    // khong can token
    @PostMapping("/create")
    public ResponseEntity<?> postMethodName(@Valid @RequestBody AccountMemberDto account) {
        return authService.create(account, "Member");
    }
    // khong can token
    @PostMapping("/role-admin/create")
    public ResponseEntity<?> createEmployee(@Valid @RequestBody AccountMemberDto account) {
        return authService.create(account, "Employee");
    }
    // can token (Admin, Employee)
    @GetMapping("/role-not-member/find/{userId}")
    public ResponseEntity<?> findUser(@PathVariable("userId") String id) {
        return authService.findUser(id);
    }
    // khong can token
    @GetMapping("/send-code")
    public ResponseEntity<?> getMethodName(@RequestParam("email") String email) {
        return otpService.generateAndSaveOtp(email);
    }
    // khong can token
    @GetMapping("/check-code")
    public ResponseEntity<?> getMethodName(@RequestParam("email") String email, @RequestParam("code") String code) {
        return otpService.verifyOtp(email, code);
    }
    // can token (phai là quyền "Member")
    @PostMapping("/role-member/update-password")
    public ResponseEntity<?> postMethodName(@RequestBody UpdatePassword entity) {
        return authService.updatePassword(entity);

    }

}
