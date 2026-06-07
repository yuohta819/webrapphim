package vn.edu.fpt.userservice.controller;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import vn.edu.fpt.userservice.dto.AccountMemberDto;
import vn.edu.fpt.userservice.dto.CountAccount;
import vn.edu.fpt.userservice.model.Account;
import vn.edu.fpt.userservice.service.UserService;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/account/members")
public class MemberController {
    private UserService memberService;

    public MemberController(UserService memberService) {
        this.memberService = memberService;
    }
    // khong can token
    @PostMapping("/create")
    public ResponseEntity<?> createMember(@RequestBody AccountMemberDto account) {
        return memberService.create(account);
    }
    //  can token (Admin, Employee)
    @GetMapping("/role-not-member/me")
    public Account getMyInfo(HttpServletRequest request) {
        return memberService.infor(request);

    }
    // can token (Member)
    @GetMapping("/role-member/{id}")
    public ResponseEntity<?> getMemberById(@RequestHeader("userId") String userIdToken,@PathVariable("id") String userId) {
        return memberService.inforUser(userIdToken);
    }
    // can token (Member)
    @PutMapping("/role-not-member/update/{id}/{status}")
    public ResponseEntity<?> updateStatus(@PathVariable("id") String userId, @PathVariable("status") String isBank) {

        return memberService.updateStatus(userId, isBank);
    }
    // can token (Admin, Employee)
    @GetMapping("/role-not-member/count-user")
    public ResponseEntity<?> countUser(@RequestParam("month") String monthData,
            @RequestParam("year") String yearData) {
        return memberService.countUser(monthData, yearData);
    }
    //can token (Admin, Employee)
    @GetMapping("/role-not-member/count")
    public CountAccount getAllAccounts() {
        return memberService.getCountAccount();
    }
    

}
