package vn.edu.fpt.bookingservice.dto;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class MovieScheduleWrapperDTO {
    private List<MovieScheduleResponseDTO> movieSchedules;
}
