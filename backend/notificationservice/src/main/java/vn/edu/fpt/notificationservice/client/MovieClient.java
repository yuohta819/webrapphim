package vn.edu.fpt.notificationservice.client;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import vn.edu.fpt.notificationservice.dto.MovieDTO;
import vn.edu.fpt.notificationservice.dto.ShowTimeDTO;

@Component
@FeignClient(name = "movieservice", path = "/movie")
public interface MovieClient {
    @GetMapping("/find/{movieId}")
    MovieDTO getMovie(@PathVariable("movieId") Integer id);
    @GetMapping("/find/showtime")
    ShowTimeDTO findShowTime(
            @RequestParam("movieId") Integer movieId,
            @RequestParam("roomId") Integer roomId,
            @RequestParam("showTimeId") Integer showTimeId
    );
}
