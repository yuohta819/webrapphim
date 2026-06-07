package vn.edu.fpt.notificationservice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SeatDTO {
    private Long seatId;

    private String seatColumn;

    private Integer seatRow;
    private String seatType;
}
