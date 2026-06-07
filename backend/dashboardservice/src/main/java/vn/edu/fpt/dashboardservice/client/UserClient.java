package vn.edu.fpt.dashboardservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import vn.edu.fpt.dashboardservice.dto.CountDashboard;

@Component
@FeignClient(name = "user-service", path = "/userservice/account/members")
public interface UserClient {
    @GetMapping("/role-not-member/count-user")
    CountDashboard getCountUser(@RequestParam("month") Integer month, @RequestParam("year") Integer year);
    @GetMapping("/role-not-member/count")
    CountDashboard getCountDashBoard();
}
  