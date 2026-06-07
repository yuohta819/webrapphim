package vn.edu.fpt.notificationservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import vn.edu.fpt.notificationservice.dto.AccountDTO;
import vn.edu.fpt.notificationservice.dto.BookingDTO;

@Component
@FeignClient(name = "authservice", path = "/account")
public interface AuthClient {
    @GetMapping("/find/{userId}")
    AccountDTO getAccount(@PathVariable("userId") Integer id);
}
