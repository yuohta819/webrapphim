package vn.edu.fpt.dashboardservice.client;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import vn.edu.fpt.dashboardservice.dto.CountDashboard;





@Component
@FeignClient(name = "booking-service", path = "/bookingservice/booking")
public interface BookingClient {
    @GetMapping("/role-not-member/count")
    CountDashboard getCountBooking(@RequestParam("month") Integer month, @RequestParam("year") Integer year);
}
