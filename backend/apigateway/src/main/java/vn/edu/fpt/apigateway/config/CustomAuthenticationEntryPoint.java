package vn.edu.fpt.apigateway.config;

import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.server.ServerAuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;

@Component
public class CustomAuthenticationEntryPoint implements ServerAuthenticationEntryPoint {

    @Override
    public Mono<Void> commence(ServerWebExchange exchange, AuthenticationException ex) { // ĐỔI TÊN HÀM THÀNH COMMENCE
        ServerHttpResponse response = exchange.getResponse();
        
        // 1. Thiết lập Status Code và Header trả về dạng JSON
        response.setStatusCode(HttpStatus.UNAUTHORIZED);
        response.getHeaders().setContentType(MediaType.APPLICATION_JSON);

        // 2. Định nghĩa nội dung chuỗi JSON báo lỗi
        String path = exchange.getRequest().getURI().getPath();
        String jsonResponse = String.format(
            "{\n" +
            "  \"status\": 401,\n" +
            "  \"error\": \"Unauthorized\",\n" +
            "  \"message\": \"Bạn không có quyền truy cập. Vui lòng cung cấp token hợp lệ!\",\n" +
            "  \"path\": \"%s\"\n" +
            "}", path
        );

        // 3. Chuyển chuỗi JSON thành DataBuffer để ghi vào Stream
        byte[] bytes = jsonResponse.getBytes(StandardCharsets.UTF_8);
        DataBuffer buffer = response.bufferFactory().wrap(bytes);

        return response.writeWith(Mono.just(buffer));
    }
}