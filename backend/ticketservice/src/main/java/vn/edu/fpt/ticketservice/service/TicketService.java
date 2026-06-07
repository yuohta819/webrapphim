package vn.edu.fpt.ticketservice.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.management.Query;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import vn.edu.fpt.commonservice.model.ErrorMessage;
import vn.edu.fpt.ticketservice.client.MovieClient;
import vn.edu.fpt.ticketservice.dto.CountTicket;
import vn.edu.fpt.ticketservice.dto.MovieTicketSalesDTO;
import vn.edu.fpt.ticketservice.dto.ShowTimeDTO;
import vn.edu.fpt.ticketservice.dto.ShowtimeLookupRequest;
import vn.edu.fpt.ticketservice.model.Ticket;
import vn.edu.fpt.ticketservice.repository.TicketRepository;

@Service
public class TicketService {
    @Autowired
    private TicketRepository ticketRepository;
    @Autowired
    private MongoTemplate mongoTemplate;
    @Autowired
    private MovieClient movieClient;

    public ResponseEntity<?> findTicket(String ticketId) {
        Ticket ticket = ticketRepository.findByTicketIdAndIsDeleted(ticketId, false);
        if (ticket == null) {
            return ResponseEntity.ok(new ErrorMessage("404", "Vé không tồn tại", HttpStatus.NOT_FOUND));
        }
        return ResponseEntity.ok(ticket);
    }

    @Scheduled(fixedRate = 50000)
    public void cleanExpiredTickets() {
        // 1. Lay tat ca ve chua xoa
        List<Ticket> activeTickets = ticketRepository.findByIsDeletedFalse();
        if (activeTickets.isEmpty()) {
            System.out.println("=== [SCHEDULER] Khong co ve nao can kiem tra (danh sach trong). ===");
            return;
        }
        System.out.println("=== [SCHEDULER] Tim thay " + activeTickets.size() + " ve dang hoat dong can kiem tra. ===");

        // 2. Gom tat ca cac ID tu list ve thanh cac List rieng biet
        List<Long> movieIds = activeTickets.stream().map(Ticket::getMovieId).distinct().toList();
        List<Long> roomIds = activeTickets.stream().map(Ticket::getRoomId).distinct().toList();
        List<Integer> showTimeIds = activeTickets.stream().map(Ticket::getShowTimeId).distinct().toList();

        System.out.println(
                String.format(">>> Dang chuan bi gui request quet cheo - Movies: %s, Rooms: %s, ShowTimes: %s",
                        movieIds.size(), roomIds.size(), showTimeIds.size()));

        // 3. Dong goi vao Request Object
        ShowtimeLookupRequest request = new ShowtimeLookupRequest();
        request.setMovieIds(movieIds);
        request.setRoomIds(roomIds);
        request.setShowTimeIds(showTimeIds);

        try {
            // 4. Goi API lay toan bo danh sach suat chieu
            System.out.println(">>> Dang goi movieClient de lay danh sach suat chieu chi tiet...");
            List<ShowTimeDTO> showTimeDTOs = movieClient.getShowTimesByLists(request);
            System.out.println("<<< Da nhan ve " + (showTimeDTOs != null ? showTimeDTOs.size() : 0)
                    + " suat chieu tu movie-service.");

            LocalDateTime now = LocalDateTime.now();
            System.out.println("-> Thoi gian he thong hien tai: " + now);

            int countExpired = 0; // Bien dem so ve bi huy trong luot nay

            if (showTimeDTOs != null && !showTimeDTOs.isEmpty()) {
                // 5. Duyet qua tung ve de so sanh voi danh sach suat chieu vua lay ve
                for (Ticket ticket : activeTickets) {
                    // Tim suat chieu tuong ung cua ve nay trong danh sach tra ve
                    ShowTimeDTO matchingShowTime = showTimeDTOs.stream()
                            .filter(st -> {
                                System.out.println(st.getFormattedShowTime() + " dong 85");
                                // Kiểm tra an toàn tránh NullPointerException nếu 1 trong 2 bên bị null dữ liệu
                                if (st.getShowTimeId() == null || ticket.getShowTimeId() == null) {

                                    return false;
                                }
                                // Ép toán bộ về chuỗi String để so sánh giá trị thuần túy
                                return String.valueOf(st.getShowTimeId()).trim()
                                        .equals(String.valueOf(ticket.getShowTimeId()).trim());
                            })
                            .findFirst()
                            .orElse(null);
                    if (matchingShowTime != null) {
                        // === DONG LOG THEM VAO THEO YEU CAU CUA BAN ===
                        System.out.println(String.format(
                                "-> [GIO GOC MOVIE-SERVICE] TicketID: %s | ShowDate tu Movie: %s | EndTime tu Movie: %s",
                                ticket.getTicketId(), matchingShowTime.getShowDate(), matchingShowTime.getEndTime()));
                        // ==============================================

                        try {
                            // 1. Chuyển đổi an toàn giá trị từ DTO thành chuỗi String (Tránh lỗi nếu DTO đã
                            // là kiểu Date/Time)
                            String dateStr = matchingShowTime.getShowDate().toString(); // Kết quả: "2026-01-11"
                            String timeStr = matchingShowTime.getEndTime().toString(); // Kết quả: "08:21:00"

                            // 2. Ép kiểu về LocalDate và LocalTime thuần túy của Java
                            java.time.LocalDate date = java.time.LocalDate.parse(dateStr);
                            java.time.LocalTime time = java.time.LocalTime.parse(timeStr);

                            // 3. KẾT HỢP: Ghép ngày và giờ lại thành một mốc LocalDateTime hoàn chỉnh
                            LocalDateTime endDateTime = LocalDateTime.of(date, time); // Kết quả: 2026-01-11T08:21:00

                            // 4. So sánh mốc kết thúc phim với thời gian thực tế hiện tại
                            boolean isExpired = now.isAfter(endDateTime);
                            System.out.println(String.format(
                                    "[SO SANH] Ve ID: %s | Gio phim ket thuc: %s | Gio hien tai: %s | Het han: %s",
                                    ticket.getTicketId(), endDateTime, now, isExpired));

                            // Nếu thời gian hiện tại (năm 2026) vượt quá ngày chiếu phim (11/01/2026) ->
                            // Chắc chắn hết hạn!
                            if (isExpired) {
                                ticket.setIsDeleted(true);
                                ticketRepository.save(ticket);
                                countExpired++;
                                System.out.println(
                                        "❌ -> Da chuyen trang thai isDeleted = true cho ve ID: "
                                                + ticket.getTicketId());
                            }
                        } catch (Exception ex) {
                            System.out.println(
                                    "-> Loi khi ghep showDate va endTime cho ve ID " + ticket.getTicketId() + ": "
                                            + ex.getMessage());
                        }
                    } else {
                        System.out.println("⚠️ Khong khop ShowTimeId giua Ticket (" + ticket.getShowTimeId()
                                + ") va Movie-Service!");
                    }
                }
            }

            System.out.println(
                    "=== [SCHEDULER HOAN THANH] Dot quet ket thuc. So ve het han da xu ly: " + countExpired + " ===");
        } catch (Exception e) {
            System.err.println("-> LOI HE THONG KHI QUET VE:");
            e.printStackTrace();
        }
    }

    public List<Ticket> findAllTicket() {
        return ticketRepository.findByIsDeletedFalse();
    }

    public List<MovieTicketSalesDTO> getMovieTicketCounts() {
        // 1. Lấy tất cả vé từ database
        List<Ticket> tickets = ticketRepository.findAll();

        // 2. SỬA TẠI ĐÂY: Collectors.counting() bắt buộc phải trả về Long
        Map<Integer, Long> ticketCounts = tickets.stream()
                .collect(Collectors.groupingBy(
                        ticket -> ticket.getMovieId().intValue(), // Ép kiểu từ Long sang Integer ở đây
                        Collectors.counting()));

        // 3. Gom tất cả unique movieId lại gửi sang MovieService một lần duy nhất
        List<Integer> movieIds = new ArrayList<>(ticketCounts.keySet());
        Map<Long, String> movieIdToNameMap = movieClient.getMovieNamesByIds(movieIds);

       return ticketCounts.entrySet().stream()
        // 1. In ra du lieu ban dau tu ticketCounts
        .peek(entry -> System.out.println(
                "DEBUG - Entry ban dau: MovieID = " + entry.getKey() + ", So luong = " + entry.getValue()))
        
        .map(entry -> {
            // 2. Ép key của entry về kiểu Long chuẩn trước khi tim kiem
            Long searchId = Long.valueOf(entry.getKey().toString());

            // 3. Tim ten phim tuong ung trong movieIdToNameMap bang cach ep moi key ve Long de so sanh
            String movieName = movieIdToNameMap.entrySet().stream()
                    .filter(e -> Long.valueOf(e.getKey().toString()).equals(searchId))
                    .map(Map.Entry::getValue)
                    .findFirst()
                    .orElse("Khong ro ten phim");

            System.out.println("DEBUG - Map key: ID " + entry.getKey() + " -> Ten phim: " + movieName);
            
            // 4. Khoi tao DTO moi va thiet lap cac gia tri (ticketsSold chuyen ve String)
            MovieTicketSalesDTO dto = new MovieTicketSalesDTO();
            dto.setMovieNames(movieName);
            dto.setTicketsSold(entry.getValue().toString());
            
            return dto;
        })
        .collect(Collectors.toList());
    }
    public CountTicket countTicket() {
        CountTicket ticket = new CountTicket();
        Long countTicketInDB = ticketRepository.countActiveTickets();
        ticket.setCount(countTicketInDB);
        return ticket;
    }
}
