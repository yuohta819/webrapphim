package vn.edu.fpt.promotionservice.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.mongodb.client.result.UpdateResult;

import vn.edu.fpt.commonservice.model.SuccessMessage;
import vn.edu.fpt.promotionservice.model.Promotion;
import vn.edu.fpt.promotionservice.repository.PromotionRepository;

@Service
public class PromotionService {
    @Autowired
    private PromotionRepository promotionRepository;
    @Autowired
    private MongoTemplate mongoTemplate;

    public ResponseEntity<?> create(Promotion promotion) {
        promotion.setPromotionId(getPromotionId());
        promotion.setCreatedAt(LocalDateTime.now());
        promotionRepository.save(promotion);
        return ResponseEntity.ok(
                new SuccessMessage("200", "Tạo Voucher thành công!!!", HttpStatus.ACCEPTED.name(), LocalDate.now()));
    }

    public Promotion findPromotion(String promotionId) {
        return promotionRepository.findByPromotionIdAndIsDeletedAndStatus(promotionId, false, "ACTIVE");
    }

    public String generateCustomPromotionId() {
        // Sinh một số ngẫu nhiên từ 0 đến 99 (100 là giới hạn trên, không bao gồm)
        int randomNumber = ThreadLocalRandom.current().nextInt(100000, 1000000);

        // String.format("%02d", ...) giúp biến số thành chuỗi có 2 chữ số (ví dụ: 5
        // thành "05", 12 thành "12")
        return "PR" + String.format("%02d", randomNumber);
    }

    public String getPromotionId() {
        String bookingId = "";
        Boolean isCheck = false;
        int loopCount = 0;
        while (!isCheck) {
            String bookingIdRandom = generateCustomPromotionId();
            Optional<Promotion> booking = promotionRepository.findByPromotionIdAndIsDeleted(bookingIdRandom, false);
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

    public List<Promotion> findAllPromotion() {
        return promotionRepository.findByIsDeleted(false);
    }

    public long deactivateExpiredPromotions() {
        // Dùng Date sẽ đại diện cho một mốc thời gian tuyệt đối (Timestamp),
        // Spring Data Mongo sẽ tự động hiểu và map chuẩn với dạng ISODate(+00:00) trong
        // DB
        Date now = new Date();

        // Điều kiện chuẩn: end_time nhỏ hơn hiện tại AND status bằng ACTIVE AND
        // isDeleted bằng false
        Query query = new Query(
                Criteria.where("end_time").lt(now)
                        .and("status").is("ACTIVE")
                        .and("isDeleted").is(false));

        Update update = new Update().set("status", "INACTIVE");

        UpdateResult result = mongoTemplate.updateMulti(query, update, "promotion");

        return result.getModifiedCount();
    }

    @Scheduled(cron = "*/3 * * * * *")
    public void checkAndDeactivatePromotions() {
        System.out.println("Bat dau tien trinh kiem tra va cap nhat cac khuyen mai het han...");

        try {
            long updatedCount = deactivateExpiredPromotions();
            if (updatedCount > 0) {
                System.out.println("Da chuyen doi trang thai thanh INACTIVE thanh cong cho " + updatedCount
                        + " chuong trinh khuyen mai.");
            } else {
                System.out.println("Khong co chuong trinh khuyen mai nao het han trong lan quet nay.");
            }
        } catch (Exception e) {
            System.out.println("Co loi xay ra khi tu dong cap nhat trang thai khuyen mai: " + e.getMessage());
            e.printStackTrace(); // In ra stack trace de de dang debug khi co loi
        }
    }
}
