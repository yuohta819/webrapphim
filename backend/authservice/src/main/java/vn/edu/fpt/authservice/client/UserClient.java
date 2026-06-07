package vn.edu.fpt.authservice.client;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import vn.edu.fpt.authservice.dto.AccountMemberDto;
import vn.edu.fpt.authservice.dto.ErrorResponse;






@Component
@FeignClient(name = "user-service", path = "/userservice/account/members")
public interface UserClient {
    @PostMapping("/create")
    ErrorResponse createMember(@RequestBody AccountMemberDto accountMemberDto);
}
