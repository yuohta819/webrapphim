package vn.edu.fpt.bookingservice.consumer;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import vn.edu.fpt.bookingservice.repository.BookingRepository;

@Component
public class UpdateStatusBooking {
    @Autowired
    private BookingRepository bookingRepository;
    private static final String TOPIC_UPDATE_SCORE = "score-update-topic";
    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    @KafkaListener(topics = "booking-status-topic", groupId = "booking-service-group")
    @Transactional
    public void consumerCallback(String result) {
        // 1. Kiem tra va validate format chuoi tranh loi sup he thong
        if (result == null || !result.contains(":")) {
            System.out.println("❌ Message sai dinh dang: " + result);
            return;
        }

        String[] parts = result.split(":");
        if (parts.length < 2) {
            System.out.println("❌ Thieu thong tin status trong message: " + result);
            return;
        }

        String bookingId = parts[0];
        String status = parts[1];
        bookingRepository.findByBookingIdAndIsDeleted(bookingId, false).ifPresent(booking -> {
            // 1. Cap nhat trang thai
            booking.setStatus(status);

            // 2. Ép JPA luu va commit ngay lap tuc xuong Database (Flush)
            bookingRepository.save(booking);
            System.out.println("✅ Da cap nhat DB cho BookingId: " + bookingId);

            // 3. DOAN NAY: Chay an toan, khong can registerSynchronization nua
            String message = booking.getUserId() + ":" + booking.getTotalPrice().intValue();
            // SỬA LẠI: Đổi nháy đơn thành nháy kép ":"
            kafkaTemplate.send(TOPIC_UPDATE_SCORE, booking.getUserId() + ":" + booking.getTotalPrice().intValue());

            System.out.println("🚀 Da ban tin nhan sang score-update-topic: " + message);
        });
    }
}
