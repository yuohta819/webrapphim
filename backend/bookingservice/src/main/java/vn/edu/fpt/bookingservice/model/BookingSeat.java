package vn.edu.fpt.bookingservice.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookingSeat {
    private Long seatId;

    private String seatColumn;

    private Integer seatRow;

    private Double price;
}
