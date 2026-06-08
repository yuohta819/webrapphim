package vn.edu.fpt.movieservice.client;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import vn.edu.fpt.movieservice.dto.SeatDTO;


@FeignClient(name = "room-service", path = "/roomservice/room")
public interface RoomClient {
    @GetMapping("/find/{roomId}")
    List<SeatDTO> getRoomSeats(@PathVariable("roomId") Long id);
}