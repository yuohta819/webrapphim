package vn.edu.fpt.bankaccountservice.client;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import vn.edu.fpt.bankaccountservice.dto.UserDTO;





@Component
@FeignClient(name = "user-service", path = "/account/members")
public interface UserClient {
    @GetMapping("/find/{accountId}")
    UserDTO getUser(@PathVariable("accountId") Integer id);
}
