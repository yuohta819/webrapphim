package vn.edu.fpt.roomservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.transaction.Transactional;
import vn.edu.fpt.roomservice.model.Seat;

public interface SeatRepository extends JpaRepository<Seat, Long> {
    @Query("SELECT a FROM Seat a WHERE a.room.roomId = :roomId")
    List<Seat> findSeat(@Param("roomId") Integer id);

    @Modifying
    @Transactional
    @Query("DELETE FROM Seat s WHERE s.room.roomId = :roomId")
    void deleteByRoomId(@Param("roomId") Long roomId);
}
