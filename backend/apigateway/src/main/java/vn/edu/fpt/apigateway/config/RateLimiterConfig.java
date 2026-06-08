package vn.edu.fpt.apigateway.config;

import org.springframework.cloud.gateway.filter.ratelimit.KeyResolver;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import reactor.core.publisher.Mono;

@Configuration
public class RateLimiterConfig {

    @Bean
    public KeyResolver ipKeyResolver() {
        return exchange -> Mono.just(
                exchange.getRequest().getHeaders().getFirst("X-Forwarded-For") != null
                        ? exchange.getRequest().getHeaders().getFirst("X-Forwarded-For").split(",")[0]
                        : exchange.getRequest().getRemoteAddress().getAddress().getHostAddress());
    }
}