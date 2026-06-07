package vn.edu.fpt.ticketservice.client;

import java.util.List;
import java.util.Map;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import vn.edu.fpt.ticketservice.dto.MovieDTO;
import vn.edu.fpt.ticketservice.dto.ShowTimeDTO;
import vn.edu.fpt.ticketservice.dto.ShowtimeLookupRequest;

@Component
@FeignClient(name = "movie-service", path = "/movieservice/movie")
public interface MovieClient {
    @GetMapping("/find/{movieId}")
    MovieDTO getMovie(@PathVariable("movieId") Integer id);

    @PostMapping("/role-employee/find/showtime/by-lists")
    List<ShowTimeDTO> getShowTimesByLists(@RequestBody ShowtimeLookupRequest request);

    @PostMapping("/role-employee/names-by-ids")
    Map<Long, String> getMovieNamesByIds(@RequestBody List<Integer> movieIds);
}
