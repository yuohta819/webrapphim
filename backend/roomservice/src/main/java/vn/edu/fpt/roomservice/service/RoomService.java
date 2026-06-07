package vn.edu.fpt.roomservice.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import vn.edu.fpt.commonservice.model.ErrorMessage;
import vn.edu.fpt.commonservice.model.SuccessMessage;
import vn.edu.fpt.roomservice.dto.TrackingEvent;
import vn.edu.fpt.roomservice.model.Room;
import vn.edu.fpt.roomservice.model.Seat;
import vn.edu.fpt.roomservice.repository.RoomRepository;
import vn.edu.fpt.roomservice.repository.SeatRepository;

@Service
public class RoomService {
    @Autowired
    private RoomRepository roomRepository;
    @Autowired
    private SeatRepository seatRepository;
    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;
    private final String TOPIC_TRACKING_USER = "user-tracking-events";

    public ResponseEntity<?> create(Room roomRoom) {
        Room savedRoom = roomRepository.save(roomRoom);
        int totalSeat = roomRoom.getSeatQuantity();
        int seatsPerRow = 14;
        int totalsRow = (int) Math.ceil((double) totalSeat / seatsPerRow);
        List<Seat> seats = new ArrayList<>();

        int currentSeat = 1;

        for (int row = 1; row <= totalsRow; row++) {

            for (int col = 0; col < seatsPerRow; col++) {

                if (currentSeat > totalSeat) {
                    break;
                }

                char colChar = (char) ('A' + col);

                Seat seat = new Seat();
                seat.setRoom(savedRoom);

                seat.setSeatRow(row); // Lưu Row là SỐ (1, 2, 3...)
                seat.setSeatColumn(String.valueOf(colChar)); // Lưu Column là CHỮ (A, B, C...)
                seat.setSeatStatus("ACTIVE");

                seats.add(seat);
                currentSeat++;
            }
        }
        seatRepository.saveAll(seats);
        return ResponseEntity
                .ok(new SuccessMessage("200", "Tạo phòng thành công", HttpStatus.OK + "", LocalDate.now()));
    }

    public List<Seat> findSeat(Integer idRoom) {
        return seatRepository.findSeat(idRoom);
    }

    public Room findInfor(Long roomId) {
        return roomRepository.findByRoomId(roomId);
    }

    public List<Room> findAllRoom() {
        return roomRepository.findByIsDeleted(false);
    }

    @Transactional
    public ResponseEntity<?> update(Room room) {
        try {
            Room oldRoom = roomRepository.findById(room.getRoomId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy phòng"));

            boolean seatQuantityChanged = !Objects.equals(oldRoom.getSeatQuantity(), room.getSeatQuantity());

            room.setUpdateAt(LocalDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh")));

            Room savedRoom = roomRepository.save(room);

            if (seatQuantityChanged) {

                // Xóa ghế cũ
                seatRepository.deleteByRoomId(savedRoom.getRoomId());

                List<Seat> seats = new ArrayList<>();

                int totalSeat = savedRoom.getSeatQuantity();
                int seatsPerRow = 10; // Ví dụ mỗi hàng 10 ghế

                int totalsRow = (int) Math.ceil((double) totalSeat / seatsPerRow);

                int currentSeat = 1;

                for (int row = 1; row <= totalsRow; row++) {

                    for (int col = 0; col < seatsPerRow; col++) {

                        if (currentSeat > totalSeat) {
                            break;
                        }

                        char colChar = (char) ('A' + col);

                        Seat seat = new Seat();
                        seat.setRoom(savedRoom);

                        seat.setSeatRow(row);
                        seat.setSeatColumn(String.valueOf(colChar));
                        seat.setSeatStatus("ACTIVE");

                        seats.add(seat);
                        currentSeat++;
                    }
                }

                seatRepository.saveAll(seats);
            }
            TrackingEvent event = new TrackingEvent();
            event.setEventId(UUID.randomUUID().toString());
            event.setEventType("UPDATE_ROOM");
            event.setUserId("ANONYMOUS");
            event.setSource("movie-service");

            Map<String, Object> props = new HashMap<>();
            props.put("room_id", room.getRoomId());
            event.setProperties(props);

            kafkaTemplate.send(
                    TOPIC_TRACKING_USER,
                    String.valueOf(room.getRoomId()),
                    event);

            return ResponseEntity.ok(
                    new SuccessMessage(
                            "200",
                            "Cập nhật phòng thành công!",
                            HttpStatus.ACCEPTED.name(),
                            LocalDate.now()));

        } catch (Exception e) {
            return ResponseEntity.ok(
                    new ErrorMessage(
                            "500",
                            e.getMessage(),
                            HttpStatus.INTERNAL_SERVER_ERROR));
        }
    }

    public ResponseEntity<?> deleteRoom(String roomId) {
        try {
            Integer.parseInt(roomId);
        } catch (Exception e) {
            return ResponseEntity.ok(new ErrorMessage("500", "Dữ liệu bị lỗi. Vui lòng tải lại trang!!!",
                    HttpStatus.INTERNAL_SERVER_ERROR));
        }
        int result = roomRepository.softDeleteRoom(Long.parseLong(roomId));
        if (result == 0) {
            return ResponseEntity.ok(new ErrorMessage("500", "Dữ liệu bị lỗi. Vui lòng tải lại trang!!!",
                    HttpStatus.INTERNAL_SERVER_ERROR));
        }
        return ResponseEntity.ok(
                new SuccessMessage("200", "Dữ liệu bị lỗi. Vui lòng tải lại trang!!!", HttpStatus.ACCEPTED.name(), LocalDate.now()));

    }
}
