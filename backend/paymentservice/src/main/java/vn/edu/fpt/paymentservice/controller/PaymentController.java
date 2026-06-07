package vn.edu.fpt.paymentservice.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import vn.edu.fpt.paymentservice.dto.CountPayment;
import vn.edu.fpt.paymentservice.dto.PaymentZaloRequestDTO;
import vn.edu.fpt.paymentservice.model.Payment;
import vn.edu.fpt.paymentservice.service.MomoPaymentService;
import vn.edu.fpt.paymentservice.service.PaymentService;
import vn.edu.fpt.paymentservice.service.ZaloPaymentService;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/payment")
public class PaymentController {
    @Autowired
    private PaymentService paymentService;
    @Autowired
    private MomoPaymentService momoPaymentService;
    @Autowired
    private ZaloPaymentService zaloPaymentService;

    @PostMapping("/create")
    public ResponseEntity<?> getMethodName(@RequestBody Payment payment) {
        return paymentService.create(payment);
    }

    @PostMapping("/momo")
    public ResponseEntity<?> initMomoPayment(@RequestBody Map<String, Object> requestData) {
        if (requestData == null || requestData.get("amount") == null || requestData.get("bookingId") == null) {
            return ResponseEntity.badRequest().body("Thiếu giá tiền");
        }
        String orderId = "RAPPHIM_" + System.currentTimeMillis();
        long amount = Long.parseLong(requestData.get("amount").toString());
        String orderInfo = "Thanh toan hoa don rap phim";

        // Đường dẫn Client nhận kết quả sau khi User trả tiền xong
        String returnUrl = "http://localhost:3000/payment-success";
        // Đường dẫn Webhook Backend nhận trạng thái thanh toán từ MoMo (IPN)
        String notifyUrl = "https://your-domain.com/api/payment/momo-ipn";

        Map<String, Object> momoResponse = momoPaymentService.createPayment(
                orderId, amount, orderInfo, returnUrl, notifyUrl);

        return ResponseEntity.ok(momoResponse);
    }

    @PostMapping("/role-employee/zalo/check")
    public ResponseEntity<?> postMethodName(@RequestBody Map<String, Object> requestData) {
        if (requestData == null || requestData.get("appId") == null || requestData.get("bookingId") == null) {
            return ResponseEntity.badRequest().body("Thiếu thông tin appId hoặc bookingId");
        }

        String appId = requestData.get("appId").toString();
        String bookingId = requestData.get("bookingId").toString();
        String showTimeId = requestData.get("showTimeId").toString();
        if (appId.trim().isEmpty() || bookingId.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("appId hoặc bookingId không được để trống");
        }

        return zaloPaymentService.checkOrderStatus(appId, bookingId, showTimeId);

    }

    @GetMapping("/find/{bookingId}")
    public Payment getMethodName(@PathVariable("bookingId") String id) {
        return paymentService.findPayment(id);
    }
    @GetMapping("/role-employee/find-all")
    public List<Payment> getMethodName() {
        return paymentService.findAllPayment();
    }
    
    @GetMapping("/role-employee/total-price")
    public CountPayment getMethodNamee() {
        return paymentService.totalPrice();
    }
    @GetMapping("/role-employee/count")
    public CountPayment getMethodNameee(@RequestParam("month") Integer month, @RequestParam("year") Integer year) {
        return paymentService.countPayment(month, year);
    }
    
    

}
