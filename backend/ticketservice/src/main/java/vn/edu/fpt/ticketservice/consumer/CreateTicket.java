package vn.edu.fpt.ticketservice.consumer;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import vn.edu.fpt.ticketservice.client.BookingClient;
import vn.edu.fpt.ticketservice.client.RoomClient;
import vn.edu.fpt.ticketservice.client.MovieClient;
import vn.edu.fpt.ticketservice.client.UserClient;
import vn.edu.fpt.ticketservice.dto.BookingDTO;
import vn.edu.fpt.ticketservice.dto.RoomDTO;
import vn.edu.fpt.ticketservice.dto.MovieDTO;
import vn.edu.fpt.ticketservice.dto.UserDTO;
import vn.edu.fpt.ticketservice.model.Ticket;
import vn.edu.fpt.ticketservice.repository.TicketRepository;

@Service
public class CreateTicket {
    @Autowired
    private TicketRepository ticketRepository;
    private static final String TOPIC_UPDATE_SCORE = "ticket-create-topic";
    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;
    @Autowired
    private BookingClient bookingClient;
    @Autowired
    private UserClient userClient;
    @Autowired
    private MovieClient movieClient;
    @Autowired
    private RoomClient roomClient;

    @KafkaListener(topics = "ticket-create-topic", groupId = "ticker-service-group")
    @Transactional
    public void consumerCreateTicket(String result) {
        BookingDTO bookingDTO = bookingClient.getBooking(result);
        UserDTO userDTO = userClient.getUser(bookingDTO.getUserId());
        MovieDTO movieDTO = movieClient.getMovie(bookingDTO.getMovieId());
        RoomDTO RoomDTO = roomClient.getRoomSeats(bookingDTO.getRoomId());
        Ticket ticket = new Ticket();
        ticket.setBookingId(bookingDTO.getBookingId());
        ticket.setCustomerName(userDTO.getFullName());
        ticket.setMovieTitle(movieDTO.getMovieNameVn());
        ticket.setTotalAmount(bookingDTO.getTotalPrice());
        ticket.setSeats(bookingDTO.getSeats());
        ticket.setRoomId(RoomDTO.getRoomId());
        ticket.setRoomName(RoomDTO.getRoomName());
        ticket.setShowTimeId(bookingDTO.getScheduleId());
        ticket.setMovieId(movieDTO.getMovieId());
        ticket.setTicketId(getticketId());
        ticket.setIssuedAt(LocalDateTime.now());
        ticket.setShowTimeId(bookingDTO.getShowTimeId());
        ticketRepository.save(ticket);
    }

    public String generateCustomTicketId() {
        // Sinh một số ngẫu nhiên từ 0 đến 99 (100 là giới hạn trên, không bao gồm)
        int randomNumber = ThreadLocalRandom.current().nextInt(100000, 1000000);

        // String.format("%02d", ...) giúp biến số thành chuỗi có 2 chữ số (ví dụ: 5
        // thành "05", 12 thành "12")
        return "TK" + String.format("%02d", randomNumber);
    }

    public String getticketId() {
        String ticketId = "";
        Boolean isCheck = false;
        int loopCount = 0;
        while (!isCheck) {
            String ticketIdRandom = generateCustomTicketId();
            Ticket ticket = ticketRepository.findByTicketIdAndIsDeleted(ticketIdRandom, false);
            System.out.println(ticket);
            if (ticket == null) {
                ticketId = ticketIdRandom;
                isCheck = true;
            }
            loopCount++;
            if (loopCount >= 1000) {
                isCheck = true;
            }
        }
        if (ticketId.isEmpty()) {
            return "Error";
        }
        return ticketId;
    }
}
