package vn.edu.fpt.notificationservice.consumer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import vn.edu.fpt.notificationservice.dto.AccountDTO;
import vn.edu.fpt.notificationservice.dto.BookingDTO;
import vn.edu.fpt.notificationservice.dto.RoomDTO;
import vn.edu.fpt.notificationservice.dto.MovieDTO;
import vn.edu.fpt.notificationservice.dto.PaymentDTO;
import vn.edu.fpt.notificationservice.dto.ShowTimeDTO;
import vn.edu.fpt.notificationservice.dto.UserDTO;
import vn.edu.fpt.notificationservice.model.BookingMessage;
import vn.edu.fpt.notificationservice.service.EmailService;
@Service
public class SendMailCode {
    @Autowired
    private EmailService emailService;

    // Lắng nghe topic tên là "booking-success-topic"
    @KafkaListener(topics = "email-code-topic", groupId = "email-code-group")
    public void consumeBookingMessage(String message) {
        System.out.println(
                "📥 [Kafka - Notification Service] Nhận được tin nhắn từ Topic, Mã Booking: " + message);
                emailService.sendOtpEmail(message);
       
    }
}
