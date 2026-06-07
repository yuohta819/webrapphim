package vn.edu.fpt.notificationservice.dto;

import java.math.BigInteger;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BookingDTO {
    private String bookingId;
    private Integer userId;
    private Integer movieId;
    private List<SeatDTO> seats;
    private Long totalPrice;
    private Integer scheduleId;
    private Integer roomId;
    private Integer showTimeId;

}
