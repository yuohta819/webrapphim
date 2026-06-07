package vn.edu.fpt.bankaccountservice.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import vn.edu.fpt.bankaccountservice.model.BankAccount;
import vn.edu.fpt.bankaccountservice.service.BankAccountService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;



@RestController
@RequestMapping("/bankaccount")
public class BankAccountController {
    @Autowired
    private BankAccountService bankAccountService;
    @PostMapping("/role-member/create")
    public ResponseEntity<?> postMethodName(@RequestBody BankAccount bankAccount) {
        return bankAccountService.create(bankAccount);
    }
    @GetMapping("/role-member/find/{id}")
    public BankAccount getMethodName(@PathVariable("id") String bankAccountId) {
        return bankAccountService.findBankAcoount(bankAccountId);
    }
    @PostMapping("/role-member/update/{id}")
    public ResponseEntity<?> postMethodName(@PathVariable("id") String bankAccountId) {
        return bankAccountService.updateStatus(bankAccountId);
    }
    @GetMapping("/role-not-member/find-all")
    public List<BankAccount> getMethodName() {
        return bankAccountService.findAllBankAccount();
    }
    
    
    
    
}
