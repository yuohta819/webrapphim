package vn.edu.fpt.notificationservice.client;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import vn.edu.fpt.notificationservice.dto.UserDTO;



@Component
@FeignClient(name = "userservice", path = "/account/member")
public interface UserClient {
    @GetMapping("/find/{accountId}")
    UserDTO getUser(@PathVariable("accountId") Integer id);
}
