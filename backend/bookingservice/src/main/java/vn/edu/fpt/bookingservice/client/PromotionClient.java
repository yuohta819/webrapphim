package vn.edu.fpt.bookingservice.client;


import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import vn.edu.fpt.bookingservice.dto.PromotionDTO;

@Component
@FeignClient(name = "promotion-service", url = "/promotionservice/promotion")
public interface PromotionClient {
   @GetMapping("/find/{promotionId}")
    PromotionDTO getPromotion(@PathVariable("promotionId") String id);
}
