package vn.edu.fpt.dashboardservice.client;

import java.util.List;
import java.util.Map;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import vn.edu.fpt.dashboardservice.dto.CountDashboard;
import vn.edu.fpt.dashboardservice.model.MovieTotal;


@Component
@FeignClient(name = "movie-service", path = "/movieservice/movie")
public interface MovieClient {

    @GetMapping("/role-employee/count")
    CountDashboard getCountMovie(@RequestParam("month") Integer monthClient, @RequestParam("year") Integer yearClient);

}
