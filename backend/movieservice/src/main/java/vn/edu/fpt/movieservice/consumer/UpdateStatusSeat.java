package vn.edu.fpt.movieservice.consumer;

import java.math.BigInteger;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

import vn.edu.fpt.movieservice.dto.BookingResponseDTO;
import vn.edu.fpt.movieservice.dto.SeatDTO;
import vn.edu.fpt.movieservice.model.ScheduleSeat;
import vn.edu.fpt.movieservice.repository.ScheduleSeatRepository;

@Component
public class UpdateStatusSeat {
    @Autowired
    private ScheduleSeatRepository scheduleSeatRepository;
    @Autowired
    private RestClient restClient;

    @KafkaListener(topics = "seat-status-topic", groupId = "seat-group")
    @Transactional
    public void consumerCallback(String result) {
        System.out.println(result + " dong 34");
        String scheduleSeatId = result.split(":")[0];
        String status = result.split(":")[1];
        Long showTimeId = Long.parseLong(result.split(":")[2]);
        BookingResponseDTO bookingResponseDTO = findSeat(scheduleSeatId);
        
        if (bookingResponseDTO != null && status.equalsIgnoreCase("SUCCESS")) {
            bookingResponseDTO.getSeats().forEach(seat -> {
                scheduleSeatRepository.updateStatusSeat(
                        seat.getSeatId().intValue(),
                        "UNAVAILABLE",
                        LocalDateTime.now(),
                        showTimeId);

            });
        }
        if (bookingResponseDTO != null && status.equalsIgnoreCase("FAILED")) {
            bookingResponseDTO.getSeats().forEach(seat -> scheduleSeatRepository
                    .updateStatusSeat(seat.getSeatId().intValue(), "AVAILABLE", LocalDateTime.now(), showTimeId));
        }
    }

    public BookingResponseDTO findSeat(String bookingId) {
        try {
            String url = "http://localhost:8086/booking/find/" + bookingId;
            BookingResponseDTO reponse = restClient.get().uri(url).retrieve().body(BookingResponseDTO.class);
            return reponse;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
