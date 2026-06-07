package vn.edu.fpt.apigateway.config;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.core.io.buffer.DataBufferFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.web.server.ServerAuthenticationEntryPoint;
import org.springframework.security.web.server.authorization.ServerAccessDeniedHandler;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CustomSecurityExceptionHandler {

    private final ObjectMapper objectMapper = new ObjectMapper();

    // Xử lý lỗi 401 Unauthorized (Chưa đăng nhập, token sai, không có token)
    @Bean
    public ServerAuthenticationEntryPoint authenticationEntryPoint() {
        return (exchange, e) -> handleException(exchange, HttpStatus.UNAUTHORIZED, 
                "Token không hợp lệ, hết hạn hoặc không tìm thấy. Vui lòng đăng nhập lại!");
    }

    // Xử lý lỗi 403 Forbidden (Đã có token nhưng sai Role, không đủ quyền hạn)
    @Bean
    public ServerAccessDeniedHandler accessDeniedHandler() {
        return (exchange, e) -> handleException(exchange, HttpStatus.FORBIDDEN, 
                "Bạn không có quyền truy cập vào tài nguyên này!");
    }

    // --- HÀM TRỢ GIÚP DÙNG CHUNG: Đảm bảo luồng JSON luôn được write và flush thành công ---
    private Mono<Void> handleException(ServerWebExchange exchange, HttpStatus status, String message) {
        return Mono.defer(() -> {
            System.out.println("=======> ĐÃ CHẠY VÀO CUSTOM HANDLER: " + status.value()); // Thêm dòng này để debug log

            exchange.getResponse().setStatusCode(status);
            exchange.getResponse().getHeaders().setContentType(MediaType.APPLICATION_JSON);

            // Tạo Map dữ liệu để Jackson tự động convert sang JSON chuẩn, không lo lỗi format chuỗi
            Map<String, Object> errorDetails = new HashMap<>();
            errorDetails.put("status", status.value());
            errorDetails.put("error", status.getReasonPhrase());
            errorDetails.put("message", message);

            try {
                byte[] bytes = objectMapper.writeValueAsBytes(errorDetails);
                
                // Cập nhật Content-Length chính xác để Postman/Browser không bị nuốt mất Body
                exchange.getResponse().getHeaders().setContentLength(bytes.length);
                
                DataBufferFactory bufferFactory = exchange.getResponse().bufferFactory();
                DataBuffer buffer = bufferFactory.wrap(bytes);
                
                // Sử dụng flatMap để ép luồng writeWith chạy đúng tiến trình Reactive
                return exchange.getResponse().writeWith(Mono.just(buffer));
            } catch (JsonProcessingException ex) {
                return Mono.error(ex);
            }
        });
    }
}