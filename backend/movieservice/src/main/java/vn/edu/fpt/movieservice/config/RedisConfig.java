package vn.edu.fpt.movieservice.config;

import com.fasterxml.jackson.databind.MapperFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule; // 1. THÊM IMPORT NÀY
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;

@Configuration
@EnableCaching
public class RedisConfig {

    // 2. Định nghĩa Serializer chứa cấu hình Jackson trước để tái sử dụng
    @Bean
    public GenericJackson2JsonRedisSerializer jacksonRedisSerializer() {
        ObjectMapper mapper = JsonMapper.builder()
                .disable(MapperFeature.DEFAULT_VIEW_INCLUSION)
                .build();
        
        // SỬA LỖI: Đăng ký JavaTimeModule để parse được LocalDateTime/LocalDate
        mapper.registerModule(new JavaTimeModule()); 

        return new GenericJackson2JsonRedisSerializer(mapper);
    }

    @Bean
    public RedisTemplate<String, Object> redisTemplate(
            RedisConnectionFactory factory, 
            GenericJackson2JsonRedisSerializer serializer) { // Đưa serializer vào đây làm tham số
        
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(factory);
        template.setKeySerializer(new StringRedisSerializer());
        
        // SỬA LỖI: Dùng đúng serializer đã cấu hình ở trên thay vì 'new' mới
        template.setValueSerializer(serializer); 
        template.setHashValueSerializer(serializer);
        return template;
    }

    @Bean
    public RedisCacheManager cacheManager(
            RedisConnectionFactory factory, 
            GenericJackson2JsonRedisSerializer serializer) { // Đưa serializer vào đây làm tham số
        
        RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
                .computePrefixWith(cacheName -> cacheName + ":")
                .entryTtl(Duration.ZERO)
                .serializeValuesWith(
                        RedisSerializationContext.SerializationPair
                                .fromSerializer(serializer) // SỬA LỖI: Dùng đúng serializer đã cấu hình ở trên
                );
        return RedisCacheManager.builder(factory).cacheDefaults(config).build();
    }
}