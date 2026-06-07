package vn.edu.fpt.dashboardservice.client;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import vn.edu.fpt.dashboardservice.dto.CountDashboard;
import vn.edu.fpt.dashboardservice.model.MovieTotal;

@Component
@FeignClient(name = "ticket-service", path = "/ticketservice/ticket")
public interface TicketClient {

    @GetMapping("/role-employee/find-ticket")
    List<MovieTotal> getMovieTotal();

    @GetMapping("/role-employee/count-ticket")
    CountDashboard countDashboardApi();

}
