package vn.edu.fpt.bookingservice.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import vn.edu.fpt.bookingservice.model.Booking;
import vn.edu.fpt.bookingservice.service.BookingService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;



@RestController
@RequestMapping("/booking")
public class BookingController {
    @Autowired
    private BookingService bookingService;
    @PostMapping("/role-member/create")
    public ResponseEntity<?> postMethodName(@RequestHeader("userId") String userIdToken,@RequestBody Booking booking) {
        return bookingService.createBooking(booking, userIdToken);
    }
    @GetMapping("/role-all/find/{id}")
    public ResponseEntity<?> getMethodName(@PathVariable("id") String  bookingId) {
        return bookingService.findBookingId(bookingId);
    }
    @GetMapping("/role-not-member/find-all")
    public List<Booking> getMethodName() {
        return bookingService.findAllBooking();
    }
    @GetMapping("/role-not-member/count")
    public ResponseEntity<?> getMethodName(@RequestParam("month") String monthData, @RequestParam("year") String yearData) {
        return bookingService.countBooking(monthData, yearData);
    }
    
    
    
}
