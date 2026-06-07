package vn.edu.fpt.bookingservice.client;

import java.math.BigInteger;
import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import vn.edu.fpt.bookingservice.dto.MovieScheduleResponseDTO;
import vn.edu.fpt.bookingservice.dto.MovieScheduleWrapperDTO;

@Component
@FeignClient(name = "movie-service", path = "/movieservice/movie")
public interface MovieClient {
    @GetMapping("/find/{movieId}")
    MovieScheduleWrapperDTO getMovieSchedules(@PathVariable("movieId") Long movieId);
    @GetMapping("/role-employee/check-booking")
    Boolean checkBookingValid(
            @RequestParam("movieId") Long movieId,
            @RequestParam("roomId") Long roomId,
            @RequestParam("showTimeId") BigInteger showTimeId
    );
}
