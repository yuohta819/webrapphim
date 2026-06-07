package vn.edu.fpt.notificationservice.client;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import vn.edu.fpt.notificationservice.dto.BookingDTO;





@Component
@FeignClient(name = "bookingservice", path = "/booking")
public interface BookingClient {
    @GetMapping("/find/{bookingId}")
    BookingDTO getBooking(@PathVariable("bookingId") String id);
}
