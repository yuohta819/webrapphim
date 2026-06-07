package vn.edu.fpt.ticketservice.client;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import vn.edu.fpt.ticketservice.dto.RoomDTO;



@Component
@FeignClient(name = "room-service", path = "/roomservice/room")
public interface RoomClient {
    @GetMapping("/infor/{roomId}")
    RoomDTO getRoomSeats(@PathVariable("roomId") Integer id);
}
