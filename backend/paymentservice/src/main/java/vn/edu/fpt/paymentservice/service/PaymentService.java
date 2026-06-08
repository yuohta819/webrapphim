package vn.edu.fpt.paymentservice.service;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import vn.edu.fpt.commonservice.model.ErrorMessage;
import vn.edu.fpt.commonservice.model.SuccessMessage;
import vn.edu.fpt.paymentservice.dto.BookingDTO;
import vn.edu.fpt.paymentservice.dto.CountPayment;
import vn.edu.fpt.paymentservice.dto.PaymentZaloRequestDTO;
import vn.edu.fpt.paymentservice.dto.RevenueResult;
import vn.edu.fpt.paymentservice.model.Payment;
import vn.edu.fpt.paymentservice.repository.PaymentRepository;

@Service
public class PaymentService {
    @Autowired
    private PaymentRepository paymentRepository;
    @Autowired
    private RestClient restClient;
    @Autowired
    private ZaloPaymentService zaloPaymentService;

    public ResponseEntity<?> create(Payment payment) {
        BookingDTO bookingDTO = getBookingTotalPrice(payment.getBookingId());
        if (bookingDTO == null) {
            return ResponseEntity
                    .ok(new ErrorMessage("404", "Không tìm thấy mã booking phù hợp", "null", HttpStatus.NOT_FOUND));
        }
        System.out.println(paymentRepository.findByBookingIdAndIsDeleted(payment.getBookingId(), false));
        if (!paymentRepository.findByBookingIdAndIsDeleted(payment.getBookingId(), false).isEmpty()) {
            return ResponseEntity.ok(new ErrorMessage("409", "Đơn thanh toán đã tồn tại!!!", "null", HttpStatus.CONFLICT));

        }
        payment.setCreatedAt(LocalDateTime.now());
        payment.setIsDeleted(false);
        payment.setAmount(bookingDTO.getTotalPrice().longValue());
        Payment paymentSave = paymentRepository.save(payment);
        if (bookingDTO.getTotalPrice().intValue() != 0) {
            PaymentZaloRequestDTO response = zaloPaymentService.createOrder(bookingDTO.getTotalPrice().longValue(),
                    paymentSave.getPaymentId());
            return ResponseEntity.ok(response);
        }
        return ResponseEntity
                .ok(new SuccessMessage("200", "Đơn thanh toán đã được tạo!!!", HttpStatus.OK.name(), LocalDate.now()));

    }

    public BookingDTO getBookingTotalPrice(String bookingId) {
        try {
            String url = "http://localhost:8086/booking/find/" + bookingId;

            BookingDTO bookingDTO = restClient.get()
                    .uri(url)
                    .retrieve()
                    .body(BookingDTO.class);

            if (bookingDTO != null && bookingDTO.getTotalPrice() != null) {
                return bookingDTO;
            }
            return null;

        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi lấy giá tiền từ BookingService: " + e.getMessage());
        }
    }

    public String generateCustomPaymentId() {
        // Sinh một số ngẫu nhiên từ 0 đến 99 (100 là giới hạn trên, không bao gồm)
        int randomNumber = ThreadLocalRandom.current().nextInt(100000, 1000000);

        // String.format("%02d", ...) giúp biến số thành chuỗi có 2 chữ số (ví dụ: 5
        // thành "05", 12 thành "12")
        return "PM" + String.format("%02d", randomNumber);
    }

    public String getPaymentId() {
        String paymentId = "";
        Boolean isCheck = false;
        int loopCount = 0;
        while (!isCheck) {
            String bookingIdRandom = generateCustomPaymentId();
            Optional<Payment> booking = paymentRepository.findByPaymentIdAndIsDeleted(bookingIdRandom, false);
            System.out.println(booking);
            if (booking.isEmpty()) {
                paymentId = bookingIdRandom;
                isCheck = true;
            }
            loopCount++;
            if (loopCount >= 1000) {
                isCheck = true;
            }
        }
        if (paymentId.isEmpty()) {
            return "Error";
        }
        return paymentId;
    }

    public Payment findPayment(String bookingId) {
        return paymentRepository.findByBookingIdAndIsDeleted(bookingId, false).orElse(null);
    }

    public List<Payment> findAllPayment() {
        return paymentRepository.findByIsDeleted(false);
    }

    public CountPayment countPayment(Integer month, Integer year) {
        CountPayment countPayment = paymentRepository.countAllPayments(month, year);
        return countPayment;

    }

    public CountPayment totalPrice() {
        RevenueResult result = paymentRepository.getTotalRevenue();

        BigInteger totalRevenue = result != null
                ? new BigInteger(result.getTotalAmount().toString())
                : BigInteger.ZERO;
                System.out.println(totalRevenue + "130");
        CountPayment countPayment = new CountPayment();
        countPayment.setCount(
                totalRevenue != null ? totalRevenue.longValue() : 0L);
        return countPayment;
    }
}
