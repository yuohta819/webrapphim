package vn.edu.fpt.notificationservice.consumer;

import java.math.BigInteger;
import java.text.NumberFormat;
import java.util.Locale;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import vn.edu.fpt.notificationservice.client.AuthClient;
import vn.edu.fpt.notificationservice.client.BookingClient;
import vn.edu.fpt.notificationservice.client.MovieClient;
import vn.edu.fpt.notificationservice.client.PaymentClient;
import vn.edu.fpt.notificationservice.client.RoomClient;
import vn.edu.fpt.notificationservice.client.UserClient;
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
public class SendMailBooking {
    @Autowired
    private EmailService emailService;
    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;
    @Autowired
    private BookingClient bookingClient;
    @Autowired
    private UserClient userClient;
    @Autowired
    private MovieClient movieClient;
    @Autowired
    private RoomClient roomClient;
    @Autowired
    private AuthClient authClient;
    @Autowired
    private PaymentClient paymentClient;

    // Lắng nghe topic tên là "booking-success-topic"
    @KafkaListener(topics = "notification-topic", groupId = "notification-group")
    public void consumeBookingMessage(String message) {
        System.out.println(
                "📥 [Kafka - Notification Service] Nhận được tin nhắn từ Topic, Mã Booking: " + message);
        BookingDTO bookingDTO = bookingClient.getBooking(message);
        UserDTO userDTO = userClient.getUser(bookingDTO.getUserId());
        MovieDTO movieDTO = movieClient.getMovie(bookingDTO.getMovieId());
        RoomDTO roomDTO = roomClient.getRoomSeats(bookingDTO.getRoomId());
        AccountDTO accountDTO = authClient.getAccount(bookingDTO.getUserId());
        PaymentDTO paymentDTO = paymentClient.getPayment(bookingDTO.getBookingId());
        ShowTimeDTO showTimeDTO = movieClient.findShowTime(bookingDTO.getMovieId(), bookingDTO.getRoomId(), bookingDTO.getShowTimeId());
        // Gọi tầng EmailService xử lý gửi mail giống như cũ (Không cần sửa gì ở
        // EmailService cả)
        String formattedPrice = String.format("%,d", bookingDTO.getTotalPrice()).replace(',', '.');
        BookingMessage bookingMessage = new BookingMessage();
        bookingMessage.setBookingId(message);
        bookingMessage.setCustomerName(userDTO.getFullName());
        bookingMessage.setMovieTitle(movieDTO.getMovieNameVn());
        bookingMessage.setSeats(bookingDTO.getSeats());
        bookingMessage.setTotalPrice(formattedPrice);
        bookingMessage.setNameRoom(roomDTO.getRoomName());
        bookingMessage.setCustomerEmail(accountDTO.getEmail());
        bookingMessage.setCreateAt(paymentDTO.getCreatedAt());
        bookingMessage.setShowTime(showTimeDTO.getFormattedShowTime());
        emailService.sendBookingEmail(bookingMessage);
    }

}
