package vn.edu.fpt.dashboardservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import vn.edu.fpt.dashboardservice.dto.CountDashboard;

@Component
@FeignClient(name = "payment-service", path = "/paymentservice/payment")
public interface PaymentClient {

    @GetMapping("/role-employee/count")
    CountDashboard getCountPayment(@RequestParam("month") Integer month, @RequestParam("year") Integer year);

    @GetMapping("/role-employee/total-price")
    CountDashboard getTotalPricePayment(); 

    


}
