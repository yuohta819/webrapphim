package vn.edu.fpt.ticketservice.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import vn.edu.fpt.ticketservice.dto.CountTicket;
import vn.edu.fpt.ticketservice.dto.MovieTicketSalesDTO;
import vn.edu.fpt.ticketservice.model.Ticket;
import vn.edu.fpt.ticketservice.service.TicketService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;



@RestController
@RequestMapping("/ticket")
public class TicketController {
    @Autowired
    private TicketService ticketService;
    @GetMapping("/find/{id}")
    public ResponseEntity<?> postMethodName(@PathVariable("id") String ticketId) {
        return ticketService.findTicket(ticketId);
    }
    @GetMapping("/role-employee/find-all")
    public List<Ticket> getMethodName() {
        return ticketService.findAllTicket();
    }
    @GetMapping("/role-employee/find-ticket")
    public List<MovieTicketSalesDTO> getMethodNamee() {
        return ticketService.getMovieTicketCounts();
    }

    @GetMapping("/role-employee/count-ticket")
    public CountTicket getMethodNameeeee() {
        return ticketService.countTicket();
    }
    
    
    
    
}
