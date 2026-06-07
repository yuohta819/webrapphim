package vn.edu.fpt.promotionservice.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import vn.edu.fpt.promotionservice.model.Promotion;
import vn.edu.fpt.promotionservice.service.PromotionService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/promotion")
public class PromotionControler {
    @Autowired
    private PromotionService promotionService;

    @PostMapping("/role-employee/create")
    public ResponseEntity<?> postMethodName(@RequestBody Promotion promotion) {
        return promotionService.create(promotion);
    }

    @GetMapping("/find/{id}")
    public Promotion getMethodName(@PathVariable("id") String promotionId) {
        return promotionService.findPromotion(promotionId);
    }
    @GetMapping("/find-all")
    public List<Promotion> getMethodName() {
        return promotionService.findAllPromotion();
    }
    

}
