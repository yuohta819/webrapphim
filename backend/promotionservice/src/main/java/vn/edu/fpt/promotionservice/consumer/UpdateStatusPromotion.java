package vn.edu.fpt.promotionservice.consumer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import vn.edu.fpt.promotionservice.repository.PromotionRepository;

@Component
public class UpdateStatusPromotion {
    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;
    @Autowired
    private PromotionRepository promotionRepository;
    @KafkaListener(topics = "promotion-update-topic", groupId = "promotion-service-group")
    @Transactional
    public void consumerCallback(String result) {
       promotionRepository.updateStatus(result, "INACTIVE");
    }
}
