package vn.edu.fpt.notificationservice.model;

import java.math.BigInteger;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.edu.fpt.notificationservice.dto.SeatDTO;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BookingMessage {
    private String bookingId;
    private String customerName;
    private String showTime;
    private List<SeatDTO> seats;
    private String totalPrice;
    private String movieTitle;
    private String nameRoom;
    private String customerEmail;
    private LocalDateTime createAt;
}
