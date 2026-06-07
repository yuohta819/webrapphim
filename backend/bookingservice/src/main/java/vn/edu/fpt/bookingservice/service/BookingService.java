package vn.edu.fpt.bookingservice.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import vn.edu.fpt.bookingservice.client.AuthClient;
import vn.edu.fpt.bookingservice.client.RoomClient;
import vn.edu.fpt.bookingservice.client.MovieClient;
import vn.edu.fpt.bookingservice.client.PromotionClient;
import vn.edu.fpt.bookingservice.dto.RoomSeatDTO;
import vn.edu.fpt.bookingservice.dto.CountBookingDTO;
import vn.edu.fpt.bookingservice.dto.MovieScheduleResponseDTO;
import vn.edu.fpt.bookingservice.dto.MovieScheduleWrapperDTO;
import vn.edu.fpt.bookingservice.dto.PromotionDTO;
import vn.edu.fpt.bookingservice.dto.ScoreDTO;
import vn.edu.fpt.bookingservice.dto.SeatResponseDTO;
import vn.edu.fpt.bookingservice.dto.ShowTimeResponseDTO;
import vn.edu.fpt.bookingservice.model.Booking;
import vn.edu.fpt.bookingservice.model.BookingSeat;
import vn.edu.fpt.bookingservice.repository.BookingRepository;
import vn.edu.fpt.commonservice.model.ErrorMessage;
import vn.edu.fpt.commonservice.model.SuccessMessage;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class BookingService {
    @Autowired
    private BookingRepository bookingRepository;
    private static final String TOPIC_SEAT_STATUS = "seat-status-topic";
    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;
    @Autowired
    private MovieClient movieClient;
    @Autowired
    private RoomClient roomClient;
    @Autowired
    private AuthClient authClient;
    @Autowired
    private PromotionClient promotionClient;
    private static final String TOPIC_UPDATE_BEFORE_SCORE = "score-update-before-topic";
    private static final String TOPIC_UPDATE_PROMOTION = "promotion-update-topic";
    private static final String TOPIC_UPDATE_SEAT_PROMOTION = "expired-seats-topic";
    @Autowired
    private ObjectMapper objectMapper; // Dùng để biến List thành chuỗi JSON
    @Autowired
    private MongoTemplate mongoTemplate;
    private static final String TOPIC_NOTIFICATION = "notification-topic";

    public ResponseEntity<?> createBooking(Booking booking,String userId) {
        // 1. Gọi API sang Movie Service qua Feign Client cực kỳ ngắn gọn
        MovieScheduleWrapperDTO wrapper = movieClient.getMovieSchedules(booking.getMovieId());
        List<MovieScheduleResponseDTO> movieSchedules = wrapper.getMovieSchedules();
        List<RoomSeatDTO> roomClients = roomClient.getRoomSeats(booking.getRoomId());
        PromotionDTO promotionDTO = new PromotionDTO();
        if (movieClient.checkBookingValid(booking.getMovieId(), booking.getRoomId(), booking.getShowTimeId())) {
            return ResponseEntity
                    .ok(new ErrorMessage("404", "Không tìm thấy khung giờ phù hợp!!!", HttpStatus.NOT_FOUND));
        }

        // 5. Truyền danh sách đã bóc tách vào hàm validate như bình thường
        validateBooking(movieSchedules, booking.getRoomId(), booking.getSeats(), roomClients);
        booking.setCreatedAt(LocalDateTime.now());
        booking.setIsDeleted(false);
        String bookingId = getBookingId();
        if (bookingId.equals("error")) {
            return ResponseEntity
                    .ok(new ErrorMessage("500", "Lỗi Server. Vui lòng thử lại sau!!!", HttpStatus.BAD_REQUEST));
        }
        booking.setBookingId(bookingId);
        booking.setStatus("PENDING");
        double calculatedTotalPrice = 0.0;
        for (BookingSeat seatDto : booking.getSeats()) {
            calculatedTotalPrice += seatDto.getPrice();
        }

        // Lúc này calculatedTotalPrice là giá chính xác nhất
        System.out.println("Tổng tiền thực tế: " + calculatedTotalPrice);
        ScoreDTO scoreDTO = authClient.getScoreAccount(userId);
        if (scoreDTO == null) {
            return ResponseEntity.ok(new ErrorMessage("404", "Không tìm thấy tài khoản hợp lệ!!!",
                    HttpStatus.NOT_FOUND));
        }
        Double score = 0.0;
        Double resultTotalPrice = calculatedTotalPrice;
        if (booking.getScore() != null) {
            if (booking.getScore() != null) {
                score += new java.math.BigDecimal(scoreDTO.getMember().getScore()).intValue();
            } else {
                resultTotalPrice = calculatedTotalPrice;
            }
            if (calculatedTotalPrice >= score) {
                resultTotalPrice = calculatedTotalPrice - score;
                kafkaTemplate.send(TOPIC_UPDATE_BEFORE_SCORE, booking.getUserId() + ":" + 0);
            } else {
                resultTotalPrice = score - calculatedTotalPrice;
                kafkaTemplate.send(TOPIC_UPDATE_BEFORE_SCORE, booking.getUserId() + ":" + resultTotalPrice);
                resultTotalPrice = 0.0;
            }
        }
        if (booking.getPromotionId() != null) {
            promotionDTO = promotionClient.getPromotion(booking.getPromotionId());
            if (promotionDTO == null) {
                return ResponseEntity.ok(new ErrorMessage("500", "Dữ liệu bị thay đổi. Vui lòng tải lại trang",
                        HttpStatus.INTERNAL_SERVER_ERROR));
            }
            if (promotionDTO.getDiscountLevel() > 0 && resultTotalPrice > 0) {
                kafkaTemplate.send(TOPIC_UPDATE_PROMOTION, promotionDTO.getPromotionId());
                resultTotalPrice *= (1 - (promotionDTO.getDiscountLevel() / 100.0));
            }
        }
        booking.setScore(scoreDTO.getMember().getScore().intValue());
        booking.setTotalPrice(resultTotalPrice);
        booking.setShowTimeId(booking.getShowTimeId());
        booking.setPromotionId(booking.getPromotionId());
        Booking saved = bookingRepository.save(booking);

        if (saved != null) {
            kafkaTemplate.send(TOPIC_SEAT_STATUS, saved.getBookingId() + ":" +
                    "success" + ":" + saved.getShowTimeId());

            return ResponseEntity
                    .ok(new SuccessMessage("200", "Tạo đơn thành công",
                            HttpStatus.ACCEPTED.name(), LocalDate.now()));
        }
        return ResponseEntity
                .ok(new ErrorMessage("500", "Lỗi tạo đơn hàng. Vui lòng thử lại sau!!!", HttpStatus.BAD_REQUEST));
    }

    public ResponseEntity<?> findBookingId(String bookingId) {
        Optional<Booking> booking = bookingRepository.findById(bookingId);
        if (booking.isEmpty()) {
            return ResponseEntity
                    .ok(new ErrorMessage("404", "Không tìm thấy đơn Booking", HttpStatus.NOT_FOUND));
        }
        return ResponseEntity.ok(booking.get());
    }

    public String generateCustomBookingId() {
        // Sinh một số ngẫu nhiên từ 0 đến 99 (100 là giới hạn trên, không bao gồm)
        int randomNumber = ThreadLocalRandom.current().nextInt(100000, 1000000);

        // String.format("%02d", ...) giúp biến số thành chuỗi có 2 chữ số (ví dụ: 5
        // thành "05", 12 thành "12")
        return "BK" + String.format("%02d", randomNumber);
    }

    public String getBookingId() {
        String bookingId = "";
        Boolean isCheck = false;
        int loopCount = 0;
        while (!isCheck) {
            String bookingIdRandom = generateCustomBookingId();
            Optional<Booking> booking = bookingRepository.findByBookingIdAndIsDeleted(bookingIdRandom, false);
            System.out.println(booking);
            if (booking.isEmpty()) {
                bookingId = bookingIdRandom;
                isCheck = true;
            }
            loopCount++;
            if (loopCount >= 1000) {
                isCheck = true;
            }
        }
        if (bookingId.isEmpty()) {
            return "Error";
        }
        return bookingId;
    }

    public void validateBooking(
            List<MovieScheduleResponseDTO> movieSchedulesList,
            Long requestedRoomId,
            List<BookingSeat> requestedSeatCodes,
            List<RoomSeatDTO> roomSeatDTOs) {

        if (movieSchedulesList == null || movieSchedulesList.isEmpty()) {
            throw new RuntimeException("Phim hiện tại không có lịch chiếu phù hợp hoặc đã bị hủy.");
        }

        ShowTimeResponseDTO showTime = movieSchedulesList.get(0).getShowTime();
        if (showTime == null) {
            throw new RuntimeException("Không tìm thấy thông tin lịch chiếu (ShowTime) của phim.");
        }

        if (!showTime.getRoomId().equals(requestedRoomId)) {
            throw new RuntimeException("Sai thông tin rạp chiếu! Suất chiếu này không thuộc rạp bạn chọn.");
        }

        List<SeatResponseDTO> systemSeats = showTime.getScheduleSeats();

        // === BƯỚC CHUẨN BỊ: Chuyển List cấu hình rạp thành Map tra cứu theo SeatId để
        // tránh lồng Stream ===
        Map<String, RoomSeatDTO> roomSeatMap = roomSeatDTOs.stream()
                .collect(Collectors.toMap(
                        seat -> seat.getSeatRow() + "_" + seat.getSeatColumn().trim().toUpperCase(),
                        seat -> seat,
                        (existing, replacement) -> existing));
        System.out.println("\n======= CAU TRUC MAP SAU KHI GOM DU LIEU =======");
        roomSeatMap.forEach((key, value) -> {
            // Thêm %d (hoặc %s) cho SeatId và truyền value.getSeatId() vào cuối
            System.out.println(String.format("Key (Toa do): \"%s\" \n   Value (Object): Row=%d, Col=%s, SeatId=%d",
                    key, value.getSeatRow(), value.getSeatColumn(), value.getSeatId()));
            System.out.println("----------------------------------------------");
        });
        LocalDate showDate = LocalDate.parse(showTime.getShowDate().trim()); // "2026-06-01"
        LocalTime startTime = LocalTime.parse(showTime.getStartTime().trim()); // "07:00:00"
        LocalDateTime showDateTime = LocalDateTime.of(showDate, startTime);
        LocalDateTime currentDateTime = LocalDateTime.now();
        System.out.println("==================================================\n");
        for (BookingSeat clientSeat : requestedSeatCodes) {
            System.out.println("\n👉 Đang kiểm tra toàn diện ghế ID: " + clientSeat.getSeatId());
            System.out.println("\n👉 Dang kiem tra seatRow: " + clientSeat.getSeatRow());
            // 1. Tìm ghế tương ứng trong danh sách Suất Chiếu (systemSeats) bằng ID
            SeatResponseDTO matchSeat = systemSeats.stream()
                    .filter(s -> {
                        String sysCodeStr = String.valueOf(s.getSeatCode()).trim();
                        String clientSeatIdStr = clientSeat.getSeatId().toString();

                        // So sánh mã định danh
                        boolean isIdMatch = sysCodeStr.equalsIgnoreCase(clientSeatIdStr);

                        // 1. SOUT TRONG VÒNG LỌC: Để nhìn thấy hệ thống đang bốc từng ghế nào ra so
                        // sánh
                        System.out.println(String.format(
                                "   -> Stream dang loc: Ghe He thong Code=\"%s\" vs Ghe Khach ID=\"%s\" -> Ket qua: %b",
                                sysCodeStr, clientSeatIdStr, isIdMatch));

                        return isIdMatch;
                    })
                    .findFirst()
                    .orElse(null);

            // 2. SOUT SAU KHI LỌC XONG: Để biết kết quả tìm kiếm cuối cùng là gì trước khi
            // check null
            System.out.println(
                    "==> Ket qua tim kiem matchSeat: " + (matchSeat != null ? "TIM THAY" : "NOT FOUND (NULL)"));

            if (matchSeat == null) {
                // In thêm log lỗi chi tiết ra console trước khi ném ngoại lệ làm dừng chương
                // trình
                System.out.println("--- LOI NGHIEPM TRONG: Khong tim thay Ghe ID " + clientSeat.getSeatId()
                        + " trong danh sach systemSeats ---");
                throw new RuntimeException("Ghe so " + clientSeat.getSeatId() + " khong ton tai trong suat chieu nay!");
            }
            if (showDateTime.isBefore(currentDateTime)) {
                System.out.println("--- LOI: Khach hang co tinh dat suat chieu da dien ra trong qua khu! ---");
                throw new RuntimeException(
                        "Suất chiếu này đã diễn ra hoặc đã kết thúc. Vui lòng chọn suất chiếu khác!");
            }
            // Nếu vượt qua câu lệnh if (tức là tìm thấy ghế), in ra trạng thái trống để
            // kiểm tra tiếp
            System.out.println(String.format("   [Check status] -> Trang thai ghe tren he thong hien tai: %s",
                    matchSeat.getSeatStatus()));

            String clientSeatKey = clientSeat.getSeatRow() + "_" + clientSeat.getSeatColumn().trim().toUpperCase();

            // 2. TRUYỀN CHÍNH XÁC clientSeatKey VÀO ĐÂY (Thay vì truyền getSeatId())
            RoomSeatDTO originalroomSeat = roomSeatMap.get(clientSeatKey);
            System.out.println(clientSeatKey + " 193");
            if (originalroomSeat == null) {
                throw new RuntimeException("Không tìm thấy cấu hình rạp cho ghế ID: " + clientSeat.getSeatId());
            }

            // === BƯỚC KIỂM TRA CHÉO (VALIDATE DỮ LIỆU KHÁCH GỬI VỚI CƠ SỞ DỮ LIỆU GỐC) ===

            // Kiểm tra hàng (seatRow)
            boolean isRowMatch = originalroomSeat.getSeatRow() != null && clientSeat.getSeatRow() != null
                    && originalroomSeat.getSeatId().equals(clientSeat.getSeatId().intValue());

            // Kiểm tra cột (seatColumn)
            boolean isColumnMatch = originalroomSeat.getSeatColumn() != null && clientSeat.getSeatColumn() != null
                    && originalroomSeat.getSeatColumn().trim().equalsIgnoreCase(clientSeat.getSeatColumn().trim());

            // Kiểm tra giá tiền (price) đối chiếu với thông tin trên Suất chiếu hệ thống
            boolean isPriceMatch = matchSeat.getPrice() != null && clientSeat.getPrice() != null
                    && Double.compare(matchSeat.getPrice(), clientSeat.getPrice()) == 0;

            // Log chi tiết trạng thái đối chiếu ra terminal để bạn kiểm soát
            System.out.println(
                    String.format("   [Doi chieu Rap goc] -> Hang khop: %b (%d vs %d) | Cot khop: %b (%s vs %s)",
                            isRowMatch, originalroomSeat.getSeatId(), clientSeat.getSeatId(),
                            isColumnMatch, originalroomSeat.getSeatColumn(), clientSeat.getSeatColumn()));
            System.out.println(String.format("   [Doi chieu Suat chieu] -> Gia tien khop: %b (%s vs %s)",
                    isPriceMatch, matchSeat.getPrice(), clientSeat.getPrice()));

            // Nếu bất kỳ thông tin cấu trúc nào sai lệch, lập tức chặn đứng để chống gian
            // lận dữ liệu
            if (!isRowMatch || !isColumnMatch || !isPriceMatch) {
                System.out.println("LOI: Thong tin ghe gui len bi sai lech hoan toan so voi cau hinh he thong!");
                throw new RuntimeException("Cấu trúc thông tin ghế đặt không hợp lệ. Vui lòng tải lại trang!");
            }

            // 3. Kiểm tra trạng thái trống (AVAILABLE)
            if (!"AVAILABLE".equalsIgnoreCase(matchSeat.getSeatStatus())) {
                System.out.println("LOI: Ghe hop le nhung trang thai hien tai la: " + matchSeat.getSeatStatus());
                throw new RuntimeException("Ghế " + originalroomSeat.getSeatColumn() + originalroomSeat.getSeatRow()
                        + " đã có người đặt trước mất rồi!");
            }

            System.out.println("Ghe " + originalroomSeat.getSeatColumn() + originalroomSeat.getSeatRow()
                    + " hop le hoan toan.");
        }
        validateNoSingleSeatGap(requestedSeatCodes, systemSeats, roomSeatDTOs);

    }

    public ResponseEntity<?> countBooking(String month, String year) {
        try {
            Integer monthInteger = Integer.parseInt(month);
            Integer yearInteger = Integer.parseInt(year);
            CountBookingDTO CountBookingDTO = new CountBookingDTO();
            Long count = bookingRepository.countBookingByMonthAndYear(monthInteger, yearInteger);

            CountBookingDTO.setCount(count != null ? count : 0L);
            return ResponseEntity.ok(CountBookingDTO);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity
                    .ok(new ErrorMessage("500", "Lỗi dữ liệu vui lòng tải lại trang!!!!", HttpStatus.NOT_FOUND));
        }
    }

    private void validateNoSingleSeatGap(
            List<BookingSeat> requestedSeats,
            List<SeatResponseDTO> systemSeats,
            List<RoomSeatDTO> roomSeats) {

        Set<Long> selectedSeatIds = requestedSeats.stream()
                .map(BookingSeat::getSeatId)
                .collect(Collectors.toSet());

        // TOI UU: Chuyen systemSeats thanh Map de tim kiem nhanh O(1) thay vi dung
        // .stream().filter() long nhau
        // Luu y: Ban can dam bao kieu du lieu cua getSeatCode va getSeatId trung khop
        // (o day ep ve String lam Key)
        Map<String, String> systemSeatStatusMap = systemSeats.stream()
                .collect(Collectors.toMap(
                        s -> String.valueOf(s.getSeatCode()),
                        SeatResponseDTO::getSeatStatus,
                        (existing, replacement) -> existing // Tranh trung lap key
                ));

        // Gom ghe theo hang
        Map<Integer, List<RoomSeatDTO>> seatsByRow = roomSeats.stream()
                .collect(Collectors.groupingBy(RoomSeatDTO::getSeatRow));

        System.out.println("========== BAT DAU VALIDATE GHE TRONG LE (DA FIX LOI) ==========");
        System.out.println("Ghe khach dang chon (IDs): " + selectedSeatIds);

        for (Map.Entry<Integer, List<RoomSeatDTO>> entry : seatsByRow.entrySet()) {
            Integer rowNum = entry.getKey();
            List<RoomSeatDTO> rowSeats = entry.getValue();

            // FIX LOI 1: Sap xep thong minh. Neu cot la chu so (1,2..10) thi xep theo so,
            // neu la chu (A,B) thi xep theo chu
            rowSeats.sort((s1, s2) -> {
                try {
                    int col1 = Integer.parseInt(s1.getSeatColumn());
                    int col2 = Integer.parseInt(s2.getSeatColumn());
                    return Integer.compare(col1, col2);
                } catch (NumberFormatException e) {
                    return s1.getSeatColumn().compareTo(s2.getSeatColumn());
                }
            });

            System.out.println("\n--------------------------------------------------");
            System.out
                    .println("👉 DANG KIEM TRA HANG: " + rowNum + " (Tong so ghe trong hang: " + rowSeats.size() + ")");

            // Tao danh sach trang thai theo tung ghe de phan tich tinh huong
            // Dung kieu String de biet ro: "TRONG", "KHACH_CHON", "DA_BAN"
            List<String> statusList = new ArrayList<>();
            List<String> seatLogs = new ArrayList<>();

            for (RoomSeatDTO roomSeat : rowSeats) {
                String currentStatus = "TRONG";

                if (selectedSeatIds.contains(roomSeat.getSeatId().longValue())) {
                    currentStatus = "KHACH_CHON";
                } else {
                    // FIX LOI 3: Lay truc tiep tu Map, khong dung stream filter nua
                    String sysStatus = systemSeatStatusMap.get(String.valueOf(roomSeat.getSeatId()));
                    if (sysStatus != null && !"AVAILABLE".equalsIgnoreCase(sysStatus)) {
                        currentStatus = "DA_BAN";
                    }
                }
                statusList.add(currentStatus);
                seatLogs.add("[" + roomSeat.getSeatColumn() + roomSeat.getSeatRow() + ": " + currentStatus + "]");
            }

            System.out.println("So do hang " + rowNum + ": " + String.join(" -> ", seatLogs));

            // FIX LOI 2: Thuat toan quet ghe trong le chuan chi
            int size = statusList.size();
            for (int i = 0; i < size; i++) {
                // Chung ta chi xet neu ghe hien tai dang "TRONG"
                if ("TRONG".equals(statusList.get(i))) {

                    // Kiem tra ghe ben trai va ben phai cua ghe trong nay
                    boolean leftIsOccupied = (i == 0) || !"TRONG".equals(statusList.get(i - 1));
                    boolean rightIsOccupied = (i == size - 1) || !"TRONG".equals(statusList.get(i + 1));

                    // Neu ca 2 ben deu bi chiem -> day dung la 1 ghe trong don doc!
                    if (leftIsOccupied && rightIsOccupied) {

                        boolean leftIsKhach = (i > 0) && "KHACH_CHON".equals(statusList.get(i - 1));
                        boolean rightIsKhach = (i < size - 1) && "KHACH_CHON".equals(statusList.get(i + 1));

                        if (leftIsKhach || rightIsKhach || (i == 0 && rightIsKhach) || (i == size - 1 && leftIsKhach)) {
                            RoomSeatDTO currentSeat = rowSeats.get(i);
                            System.out.println("❌ THAT BAI: Hanh dong dat ghe tao ra ghe trong le tai: "
                                    + currentSeat.getSeatColumn() + currentSeat.getSeatRow());
                            throw new RuntimeException("Khong duoc de lai ghe trong don le trong hang hoac cuoi hang.");
                        }
                    }
                }
            }
            System.out.println("✅ Hang " + rowNum + " HOP LE.");
        }
        System.out.println("\n========== VALIDATE THANH CONG: TAT CA HANG DEU HOP LE ==========");
    }

    public List<Booking> findAllBooking() {
        return bookingRepository.findByIsDeleted(false);
    }

    @Scheduled(fixedRate = 60000) // 10 phút quét 1 lần
    public void autoCheckAndCancelBookings() {
        LocalDateTime limitTimeDate = LocalDateTime.now().minusMinutes(6);
        List<String> targetStatuses = Arrays.asList("PENDING", "UNPAID");
        java.util.Date limitTime = java.util.Date
                .from(limitTimeDate.atZone(java.time.ZoneId.systemDefault()).toInstant());
        // 1. Tìm các đơn hàng chuẩn bị bị hủy
        List<Booking> expiredBookings = bookingRepository.findByStatusInAndCreatedAtLessThanEqual(targetStatuses,
                limitTime);
        List<Map<String, Object>> expiredSeatIds = expiredBookings.stream()
                .filter(booking -> booking.getSeats() != null)

                // Giữ nguyên flatMap trải phẳng danh sách ghế
                .flatMap(booking -> booking.getSeats().stream().map(bookingSeat -> {
                    // TẠO MAP ĐỂ HỨNG CẢ 2 TRƯỜNG CÙNG LÚC
                    Map<String, Object> seatInfo = new HashMap<>();
                    seatInfo.put("seatId", String.valueOf(bookingSeat.getSeatId()));

                    // Lấy thêm showTimeId (hoặc scheduleTimeId tùy biến bạn đặt trong class
                    // Booking)
                    seatInfo.put("showTimeId", booking.getShowTimeId());

                    return seatInfo;
                }))

                // Giữ nguyên distinct (Java sẽ tự động lọc trùng các Map có cặp seatId và
                // showTimeId giống y hệt nhau)
                .distinct()

                .collect(Collectors.toList());

        // 3. Tiến hành hủy hàng loạt dưới Database
        Query query = new Query();
        query.addCriteria(Criteria.where("status").in(targetStatuses)
                .and("createdAt").lte(limitTime)); // Hoặc "createdAt" tùy DB của bạn

        Update update = new Update().set("status", "CANCELLED");

        // Chạy lệnh update và lấy số lượng bản ghi thành công
        long updateResult = mongoTemplate.updateMulti(query, update, Booking.class).getModifiedCount();
        if (updateResult > 0 && !expiredSeatIds.isEmpty()) {
            System.out.println("[HE THONG] Da tu dong quet va huy " + updateResult + " don hang.");
            try {
                // Hàm này vẫn biến List<Map> thành chuỗi JSON dạng mẫu ở trên cực chuẩn để bắn
                // qua Kafka
                String jsonMessage = objectMapper.writeValueAsString(expiredSeatIds);

                // kafkaTemplate.send(TOPIC_UPDATE_SEAT_PROMOTION, jsonMessage);
                System.out.println("[KAFKA] Da ban danh sach ghe trong sang BookingService: " + jsonMessage);

            } catch (Exception e) {
                System.err.println("[LOI KAFKA] Khong the gui tin nhan: " + e.getMessage());
            }
        }
    }
}
