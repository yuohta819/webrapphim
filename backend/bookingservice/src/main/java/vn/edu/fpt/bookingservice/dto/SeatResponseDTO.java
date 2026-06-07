package vn.edu.fpt.bookingservice.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SeatResponseDTO {
    private Long scheduleSeatId;
    private String seatCode; // Để String nếu mã ghế dạng A1, A2... hoặc Long nếu là số thô
    private String seatStatus; // AVAILABLE, BOOKED
    private String seatType;
    private Double price;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy HH:mm")
    private LocalDateTime createAt;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy HH:mm")
    private LocalDateTime updateAt;
}
