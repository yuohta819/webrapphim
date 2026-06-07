package vn.edu.fpt.dashboardservice.model;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Dashboard {
    private Long totalRevenue;
    private Long totalMovies;
    private Long totalUsers;
    private Long totalBookings;
    List<MovieTotal> topMovies;
}
