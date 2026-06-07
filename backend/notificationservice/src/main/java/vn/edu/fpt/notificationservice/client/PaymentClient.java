package vn.edu.fpt.notificationservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import vn.edu.fpt.notificationservice.dto.PaymentDTO;
import vn.edu.fpt.notificationservice.dto.UserDTO;

@Component
@FeignClient(name = "paymentservice", path = "/payment")
public interface PaymentClient {
    @GetMapping("/find/{bookingId}")
    PaymentDTO getPayment(@PathVariable("bookingId") String id);
}
