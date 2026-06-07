package vn.edu.fpt.dashboardservice.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import vn.edu.fpt.dashboardservice.client.BookingClient;
import vn.edu.fpt.dashboardservice.client.MovieClient;
import vn.edu.fpt.dashboardservice.client.PaymentClient;
import vn.edu.fpt.dashboardservice.client.TicketClient;
import vn.edu.fpt.dashboardservice.client.UserClient;
import vn.edu.fpt.dashboardservice.dto.CountDashboard;
import vn.edu.fpt.dashboardservice.model.Dashboard;
import vn.edu.fpt.dashboardservice.model.MovieTotal;

@Service
public class DashboardService {
    @Autowired
    private BookingClient bookingClient;
    @Autowired
    private MovieClient movieClient;
    @Autowired
    private TicketClient ticketClient;
    @Autowired 
    private UserClient userClient;
    @Autowired
    private PaymentClient paymentClient;
    public ResponseEntity<?> countDashboard(String monthClient, String yearClient) {
        try {
            Integer month = Integer.parseInt(monthClient);
            Integer year = Integer.parseInt(yearClient);
            Dashboard dashboard = new Dashboard();
            CountDashboard countBooking = bookingClient.getCountBooking(month, year);
            CountDashboard countMovie = movieClient.getCountMovie(month, year);
            List<MovieTotal> movieTotal = ticketClient.getMovieTotal();
            CountDashboard countPayment = paymentClient.getCountPayment(month, year);
            CountDashboard countUser = userClient.getCountUser(month, year);
            System.out.println(countUser.getCount() + " 4000");
            dashboard.setTotalBookings(countBooking.getCount());
            dashboard.setTotalMovies(countMovie.getCount());
            dashboard.setTopMovies(movieTotal);
            dashboard.setTotalRevenue(countPayment.getCount());
            dashboard.setTotalUsers(countUser.getCount());
            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            return ResponseEntity.ok(e.getMessage());
        }
    }
}
