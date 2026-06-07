package vn.edu.fpt.ticketservice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SeatDTO {
    private Integer seatId;
    private String seatColumn;
    private Integer seatRow;
}
