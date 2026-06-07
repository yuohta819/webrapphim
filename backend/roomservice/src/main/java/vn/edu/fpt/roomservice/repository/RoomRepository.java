package vn.edu.fpt.roomservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.transaction.Transactional;
import vn.edu.fpt.roomservice.model.Room;

public interface RoomRepository extends JpaRepository<Room, Long> {
    Room findByRoomId(Long roomId);

    List<Room> findByIsDeleted(Boolean isDeleted);

    @Modifying
    @Transactional
    @Query("UPDATE Room r SET r.isDeleted = true WHERE r.roomId = :roomId")
    int softDeleteRoom(@Param("roomId") Long roomId);
}
