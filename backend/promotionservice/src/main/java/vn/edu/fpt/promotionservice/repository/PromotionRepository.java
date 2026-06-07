package vn.edu.fpt.promotionservice.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Update;
import org.springframework.stereotype.Repository;

import vn.edu.fpt.promotionservice.model.Promotion;
import java.util.List;

@Repository
public interface PromotionRepository extends MongoRepository<Promotion, String> {
    Optional<Promotion> findByPromotionIdAndIsDeleted(String promotionId, Boolean isDeleted);

    Promotion findByPromotionIdAndIsDeletedAndStatus(String promotionId, Boolean isDeleted, String status);

    @Query("{ '_id': ?0 }")
    @Update("{ '$set': { 'status': ?1 } }")
    void updateStatus(String id, String status);

    List<Promotion> findByIsDeleted(Boolean isDeleted);

}
