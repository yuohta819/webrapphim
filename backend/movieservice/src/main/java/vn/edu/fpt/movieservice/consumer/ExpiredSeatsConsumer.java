package vn.edu.fpt.movieservice.consumer;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.transaction.Transactional;
import vn.edu.fpt.movieservice.repository.ScheduleSeatRepository;

@Service
public class ExpiredSeatsConsumer {
    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ScheduleSeatRepository scheduleSeatRepository;

    // Lắng nghe riêng biệt ở topic mới, đặt tên groupId khác để không bị xung đột
    @KafkaListener(topics = "expired-seats-topic", groupId = "expired-seats-group")
    @Transactional
    public void consumeExpiredSeats(String message) {
        try {
            // 1. Thay doi TypeReference de parse tu JSON sang List<Map<String, Object>>
            List<Map<String, Object>> expiredSeats = objectMapper.readValue(message,
                    new TypeReference<List<Map<String, Object>>>() {
                    });

            if (expiredSeats != null && !expiredSeats.isEmpty()) {
                System.out
                        .println("[KAFKA NEW TOPIC] Nhan danh sach ghe va showTimeId can giai phong: " + expiredSeats);

                // 2. Duyet qua tung phan tu de update
                expiredSeats.forEach(seatMap -> {
                    try {
                        // Ep kieu du lieu an toan tu Map ra
                        Integer seatCode = Integer.parseInt(String.valueOf(seatMap.get("seatId")));
                        Long showTimeId = Long.parseLong(String.valueOf(seatMap.get("showTimeId")));

                        // 3. Goi ham update voi day du cac tham so moi (gồm ca seatCode va showTimeId)
                        scheduleSeatRepository.updateStatusSeat(seatCode, "AVAILABLE", LocalDateTime.now(), showTimeId);

                    } catch (NumberFormatException e) {
                        System.err.println("[LOI KAFKA] Dinh dang ID ghe hoac showTimeId khong hop le: " + seatMap);
                    } catch (Exception e) {
                        System.err.println(
                                "[LOI UPDATE] Khong the cap nhat ghe: " + seatMap + " | Loi: " + e.getMessage());
                    }
                });

                System.out.println("[KAFKA NEW TOPIC] Da giai phong thanh cong " + expiredSeats.size() + " ghe.");
            }
        } catch (Exception e) {
            System.err.println("[LOI KAFKA CONSUMER] Xu ly tin nhan qua han that bai: " + e.getMessage());
        }
    }
}
