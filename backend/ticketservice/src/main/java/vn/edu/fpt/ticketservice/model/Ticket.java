package vn.edu.fpt.ticketservice.model;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.edu.fpt.ticketservice.dto.SeatDTO;

@Document(collection = "tickets")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Ticket {

    @Id
    private String ticketId;


    // Thông tin đơn hàng
    private String bookingId;

    // Khách hàng
    private String customerName;

    // Thông tin phim
    private Long movieId;
    private String movieTitle;

    // Thông tin rạp
    private Long roomId;
    private String roomName;

    // Suất chiếu
    private  Integer showTimeId;

    // Ghế đã đặt
    private List<SeatDTO> seats;

    // Giá tiền
    private Double totalAmount;

    // Thanh toán
    private String paymentMethod;
    // Trạng thái vé
    private String status = "Active"; // ACTIVE, USED, CANCELLED

    // Thời gian tạo vé
    private LocalDateTime issuedAt;
    private Boolean isDeleted = false;
    // Getter Setter
}