package vn.edu.fpt.ticketservice.client;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import vn.edu.fpt.ticketservice.dto.BookingDTO;



@Component
@FeignClient(name = "booking-service", path = "/bookingservice/booking")
public interface BookingClient {
    @GetMapping("/role-all/find/{bookingId}")
    BookingDTO getBooking(@PathVariable("bookingId") String id);
}
