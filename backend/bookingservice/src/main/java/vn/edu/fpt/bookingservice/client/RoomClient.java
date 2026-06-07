package vn.edu.fpt.bookingservice.client;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import vn.edu.fpt.bookingservice.dto.RoomSeatDTO;
import vn.edu.fpt.bookingservice.dto.MovieScheduleWrapperDTO;

@Component
@FeignClient(name = "room-service", path = "/roomservice/room")
public interface RoomClient {
    @GetMapping("/find/{roomId}")
    List<RoomSeatDTO> getRoomSeats(@PathVariable("roomId") Long id);
}
