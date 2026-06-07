package vn.edu.fpt.notificationservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import vn.edu.fpt.notificationservice.dto.SeatDTO;
import vn.edu.fpt.notificationservice.model.BookingMessage;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private TemplateEngine templateEngine;
    @Autowired
    private StringRedisTemplate redisTemplate;

    public void sendBookingEmail(BookingMessage message) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setSubject("[FPT Ticket] Xác nhận đặt vé thành công - Mã #" + message.getBookingId());
            helper.setTo(message.getCustomerEmail());
            // Đổ dữ liệu từ Object Message vào file HTML của Thymeleaf
            Context context = new Context();
            context.setVariable("customerName", message.getCustomerName());
            context.setVariable("bookingId", message.getBookingId());
            context.setVariable("showTime", message.getShowTime());
            String seatNames = "";
            if (message.getSeats() != null && !message.getSeats().isEmpty()) {
                seatNames = message.getSeats().stream()
                        .map(seat -> {
                            // Ghép Cột (Ví dụ: "A") với Hàng (Ví dụ: 12) để thành tên ghế "A12"
                            return seat.getSeatColumn() + seat.getSeatRow();
                        })
                        .collect(java.util.stream.Collectors.joining(", "));
            }
            context.setVariable("seats", seatNames.toUpperCase());
            context.setVariable("totalPrice", message.getTotalPrice());
            context.setVariable("nameRoom", message.getNameRoom());
            context.setVariable("createAt", message.getCreateAt());
            // Link QR Code mẫu, truyền mã Booking vào để sinh ảnh trực tiếp
            String qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data="
                    + message.getBookingId();
            context.setVariable("qrCodeUrl", qrCodeUrl);

            // "booking-email" chính là tên file HTML đặt trong
            // src/main/resources/templates/
            String htmlContent = templateEngine.process("booking-email", context);
            helper.setText(htmlContent, true); // true = chế độ gửi HTML

            mailSender.send(mimeMessage);
            System.out.println("👉 [Email Service] Đã gửi mail thành công cho: ");

        } catch (Exception e) {
            System.err.println("❌ Lỗi gửi email: " + e.getMessage());
        }
    }

    public void sendOtpEmail(String toEmail) {
        try {
            String key = "otp:" + toEmail;
            String otpCode = redisTemplate.opsForValue().get(key);
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("Mã xác thực OTP của bạn");

            // Định dạng HTML cho email nhìn chuyên nghiệp hơn
            String htmlContent = "<h3>Mã xác thực của bạn là: <b style='color:red;'>" + otpCode + "</b></h3>"
                    + "<p>Mã này có hiệu lực trong 5 phút. Vui lòng không chia sẻ cho bất kỳ ai.</p>";

            helper.setText(htmlContent, true);

            // mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Lỗi khi gửi email: " + e.getMessage());
        }
    }
}
