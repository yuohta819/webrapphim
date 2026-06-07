package vn.edu.fpt.bookingservice.dto;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ShowTimeResponseDTO {
    private Long showTimeId;
    private Long roomId; // Dùng để đối chiếu xem đúng cụm rạp khách chọn không
    private String showDate;
    private String startTime;
    private String endTime;
    private List<SeatResponseDTO> scheduleSeats;
}
