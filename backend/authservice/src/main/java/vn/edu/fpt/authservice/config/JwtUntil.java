package vn.edu.fpt.authservice.config;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct; // Thêm import này (hoặc javax.annotation.PostConstruct tùy phiên bản Java)

@Component
public class JwtUntil {

    @Value("${jwt.secret}")
    private String SECRET_KEY;

    // XÓA từ khóa 'final' ở đây vì chúng ta sẽ khởi tạo nó trong hàm init()
    private Key key;

    // --- GIẢI PHÁP: Hàm này tự động chạy NGAY SAU KHI Spring @Value nạp xong dữ
    // liệu ---
    @PostConstruct
    public void init() {
        if (this.SECRET_KEY == null || this.SECRET_KEY.trim().isEmpty()) {
            throw new IllegalStateException("Không thể đọc thuộc tính 'jwt.secret' từ file cấu hình!");
        }
        // Ép rõ ràng sang mã hóa UTF-8
        this.key = Keys.hmacShaKeyFor(this.SECRET_KEY.getBytes(java.nio.charset.StandardCharsets.UTF_8));
    }

    // Tạo token client
    public String generateToken(String account, Integer accountId, String username, String role, String userId) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("accountid", accountId);
        claims.put("account", account);
        claims.put("name", username);
        claims.put("role", role);
        claims.put("userId", userId);
        System.out.println(SECRET_KEY + " 43");
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(account)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // Tạo token client Google
    public String generateTokenGoogle(String account, Long accountId, String username) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("accountid", accountId);
        claims.put("account", account);
        claims.put("name", username);
        claims.put("provider", "Google");
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(account)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // Tạo token Admin
    public String generateTokenAdmin(String account, Long accountId, String username, boolean canAdd, boolean canEdit,
            boolean canDelete) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("accountid", accountId);
        claims.put("account", account);
        claims.put("name", username);
        claims.put("add", canAdd);
        claims.put("edit", canEdit);
        claims.put("delete", canDelete);
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(account)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // Lấy username từ token
    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    public Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // Kiểm tra hết hạn
    public Boolean isTokenExpired(String token) {
        return extractAllClaims(token).getExpiration().before(new Date());
    }

    // Kiểm tra token hợp lệ kèm username
    public Boolean validateToken(String token, String username) {
        return (username.equals(extractUsername(token)) && !isTokenExpired(token));
    }

    public boolean isValidTokenFormat(String token) {
        if (token == null || token.trim().isEmpty()) {
            return false;
        }
        long dotCount = token.chars().filter(ch -> ch == '.').count();
        return dotCount == 2;
    }

    // Kiểm tra token hợp lệ chung
    public boolean validateToken(String token) {
        if (!isValidTokenFormat(token)) {
            return false;
        }
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}