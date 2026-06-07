package vn.edu.fpt.dashboardservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import vn.edu.fpt.dashboardservice.service.DashboardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/dashboard")
public class DashboardController {
    @Autowired
    private DashboardService dashboardService;
    @GetMapping("/role-employee/count")
    public ResponseEntity<?> getMethodName(@RequestParam("month") String monthClient, @RequestParam("year") String yearClient) {
        return dashboardService.countDashboard(monthClient, yearClient);
    }
    
}
