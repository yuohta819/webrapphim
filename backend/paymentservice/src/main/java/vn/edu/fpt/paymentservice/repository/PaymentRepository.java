package vn.edu.fpt.paymentservice.repository;

import java.util.List;
import java.util.Optional;

import org.bson.Document;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import vn.edu.fpt.paymentservice.dto.CountPayment;
import vn.edu.fpt.paymentservice.dto.RevenueResult;
import vn.edu.fpt.paymentservice.model.Payment;

public interface PaymentRepository extends MongoRepository<Payment, String> {
    Optional<Payment> findByPaymentIdAndIsDeleted(String id, boolean isDeleted);

    // Tìm kiếm payment dựa trên mã app_trans_id gửi sang ZaloPay
    Optional<Payment> findByAppTransIdAndIsDeleted(String appTransId, Boolean isDeleted);

    Optional<Payment> findByBookingIdAndIsDeleted(String bookingId, Boolean isDeleted);

    List<Payment> findByIsDeleted(Boolean isDeleted);

    @Aggregation(pipeline = {
            "{ $match: { paymentStatus: 'SUCCESS', isDeleted: false } }",
            "{ $group: { _id: null, totalAmount: { $sum: '$amount' } } }"
    })
    RevenueResult getTotalRevenue();

    @Aggregation(pipeline = {
            "{ $match: { " +
                    "isDeleted: false, " +
                    "$expr: { " +
                    "$and: [" +
                    "{ $eq: [ { $month: '$createdAt' }, ?0 ] }, " +
                    "{ $eq: [ { $year: '$createdAt' }, ?1 ] } " +
                    "] " +
                    "} " +
                    "} }",
            "{ $count: 'count' }"
    })
    CountPayment countAllPayments(Integer month, Integer year);
}
