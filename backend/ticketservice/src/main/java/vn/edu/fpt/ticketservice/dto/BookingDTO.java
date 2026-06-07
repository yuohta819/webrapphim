package vn.edu.fpt.ticketservice.dto;

import java.util.List;

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
    private Double totalPrice;
    private Integer scheduleId;
    private Integer roomId;
    private Integer showTimeId;

}
