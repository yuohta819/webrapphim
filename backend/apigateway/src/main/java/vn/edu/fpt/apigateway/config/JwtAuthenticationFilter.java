package vn.edu.fpt.apigateway.config;

import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import reactor.core.publisher.Mono;

@Component
public class JwtAuthenticationFilter implements WebFilter {

    // Regex khớp với /account/find/{userId} (Không cần token)
    @Value("${jwt.secret}")
    private String SECRET_KEY;
    private java.security.Key key;

    @jakarta.annotation.PostConstruct
    public void init() {
        if (this.SECRET_KEY == null || this.SECRET_KEY.trim().isEmpty()) {
            throw new IllegalStateException("Không thể đọc thuộc tính 'jwt.secret' từ file cấu hình!");
        }
        // Ép sang UTF-8 đúng chuẩn mã hóa
        this.key = io.jsonwebtoken.security.Keys
                .hmacShaKeyFor(this.SECRET_KEY.getBytes(java.nio.charset.StandardCharsets.UTF_8));
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                // SỬA TẠI ĐÂY: Sử dụng biến 'this.key' đã được cấu hình chuẩn hóa ở hàm init()
                Claims claims = Jwts.parserBuilder() // Trả về JwtParserBuilder
                        .setSigningKey(this.key)
                        .build() // <--- PHẢI CÓ DÒNG NÀY để trả về JwtParser chính thức
                        .parseClaimsJws(token) // Bây giờ hàm này đã tồn tại và hết lỗi đỏ
                        .getBody();

                String email = claims.getSubject(); // Lấy "sub"
                String role = claims.get("role", String.class); // Lấy "role"
                String userId = claims.get("userId", String.class);
                if (email != null && role != null) {
                    List<SimpleGrantedAuthority> authorities = Collections
                            .singletonList(new SimpleGrantedAuthority("ROLE_" + role));

                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            email, null, authorities);

                    ServerWebExchange mutatedExchange = exchange.mutate()
                            .request(exchange.getRequest().mutate()
                                    .header("email", email) // Bắn email xuống dạng header thô
                                    .header("role", role) // Bắn role xuống (nếu cần)
                                    .header("userId", userId)
                                    .build())
                            .build();
                    return chain.filter(mutatedExchange)
                            .contextWrite(ReactiveSecurityContextHolder.withAuthentication(authentication));
                }

                return chain.filter(exchange);

            } catch (Exception e) {
                System.out.println("Token bi loi hoac sai dinh dang: " + e.getMessage());

                // KHÔNG DÙNG: exchange.getResponse().setComplete() nữa!
                // Ghi log xong, cho qua filter luôn với tư cách là "Request không có xác thực
                // hợp lệ"
                return chain.filter(exchange);
            }
        }

        return chain.filter(exchange);
    }
}