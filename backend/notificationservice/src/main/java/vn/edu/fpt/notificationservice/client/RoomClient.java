package vn.edu.fpt.notificationservice.client;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import vn.edu.fpt.notificationservice.dto.RoomDTO;



@Component
@FeignClient(name = "roomservice",path = "/room")
public interface RoomClient {
    @GetMapping("/infor/{roomId}")
    RoomDTO getRoomSeats(@PathVariable("roomId") Integer id);
}
