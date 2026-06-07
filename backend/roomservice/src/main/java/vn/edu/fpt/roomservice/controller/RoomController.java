package vn.edu.fpt.roomservice.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.websocket.server.PathParam;
import vn.edu.fpt.roomservice.model.Room;
import vn.edu.fpt.roomservice.model.Seat;
import vn.edu.fpt.roomservice.service.RoomService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;



@RestController
@RequestMapping("/room")
public class RoomController {
    @Autowired
    private RoomService roomService;
    @PostMapping("/role-employee/create")
    public ResponseEntity<?> postMethodName(@RequestBody Room roomRoom) {
       return roomService.create(roomRoom);
    }
    @GetMapping("/find/{id}")
    public List<Seat> getMethodName(@PathVariable("id") Integer idroom) {
        return roomService.findSeat(idroom);
    }
    @GetMapping("/infor/{id}")
    public Room getMethodName(@PathVariable("id") Long roomId) {
        return roomService.findInfor(roomId);
    }
    
    @GetMapping("/role-employee/find-all")
    public List<Room> getMethodName() {
        return roomService.findAllRoom();
    }
    @PostMapping("/role-employee/update")
    public ResponseEntity<?> postMethodNamee(@RequestBody Room room ) {
        
        return roomService.update(room);
    }
    
    
    
}
