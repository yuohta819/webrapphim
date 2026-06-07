package vn.edu.fpt.ticketservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import vn.edu.fpt.ticketservice.dto.BookingDTO;
import vn.edu.fpt.ticketservice.dto.UserDTO;

@Component
@FeignClient(name = "user-service", path = "/userservice/account")
public interface UserClient {
    @GetMapping("/role-member/member/find/{id}")
    UserDTO getUser(@PathVariable("id") Integer userId);
}
