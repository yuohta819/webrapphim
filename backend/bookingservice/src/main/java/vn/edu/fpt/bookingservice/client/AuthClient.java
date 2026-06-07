package vn.edu.fpt.bookingservice.client;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import vn.edu.fpt.bookingservice.dto.RoomSeatDTO;
import vn.edu.fpt.bookingservice.dto.ScoreDTO;

@Component
@FeignClient(name = "auth-service", path = "/authservice/account")
public interface AuthClient {
    @GetMapping("/role-not-member/find/{accountId}")
    ScoreDTO getScoreAccount(@PathVariable("accountId") String id);
}
// test