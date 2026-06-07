package vn.edu.fpt.bookingservice.repository;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Update;

import vn.edu.fpt.bookingservice.model.Booking;

public interface BookingRepository extends MongoRepository<Booking, String> {
    Optional<Booking> findByBookingIdAndIsDeleted(String id, boolean isDeleted);

    @Query("{ 'status': 'ACTIVE', 'expiryDate': { $lte: ?0 } }")
    @Update("{ '$set': { 'status': 'EXPIRED' } }")
    long updateExpiredUsers(LocalDateTime now);

    List<Booking> findByStatusInAndCreatedAtLessThanEqual(List<String> statuses, Date limitTime);

    List<Booking> findByIsDeleted(Boolean isDeleted);

    @Aggregation(pipeline = {
            "{ $project: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } } }",
            "{ $match: { month: ?0, year: ?1 } }",
            "{ $group: { _id: null, total: { $sum: 1 } } }", // Gom tất cả lại và đếm
            "{ $project: { _id: 0, total: 1 } }"
    })
    Long countBookingByMonthAndYear(int month, int year);
}
