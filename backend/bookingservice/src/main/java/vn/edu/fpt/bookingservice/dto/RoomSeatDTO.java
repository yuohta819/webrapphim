package vn.edu.fpt.bookingservice.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RoomSeatDTO {
    private Integer seatId;
    private String seatColumn;
    private Integer seatRow;
    private Double price;
}
