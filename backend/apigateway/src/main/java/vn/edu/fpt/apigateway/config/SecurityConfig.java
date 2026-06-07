package vn.edu.fpt.apigateway.config;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.ServerAuthenticationEntryPoint;
import org.springframework.security.web.server.authorization.ServerAccessDeniedHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import reactor.core.publisher.Mono;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Autowired
    private CustomAuthenticationEntryPoint customAuthenticationEntryPoint;
    private JwtAuthenticationFilter jwtAuthenticationFilter;
    private final ServerAuthenticationEntryPoint authenticationEntryPoint;
    private final ServerAccessDeniedHandler accessDeniedHandler;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter,
            ServerAuthenticationEntryPoint authenticationEntryPoint,
            ServerAccessDeniedHandler accessDeniedHandler) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.authenticationEntryPoint = authenticationEntryPoint;
        this.accessDeniedHandler = accessDeniedHandler;
    }

    @Bean
    public ReactiveAuthenticationManager authenticationManager() {
        return authentication -> Mono.empty();
    }

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        http
                // 1. Tắt CSRF
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .addFilterAt(jwtAuthenticationFilter, SecurityWebFiltersOrder.AUTHENTICATION)
                // 2. Cấu hình phân quyền đường dẫn
                .authorizeExchange(exchanges -> exchanges
                        // Nhóm URL Swagger / Hệ thống (Giữ nguyên)
                        .pathMatchers("/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs", "/v3/api-docs/**",
                                "/webjars/**")
                        .permitAll()
                        .pathMatchers("/*/v3/api-docs", "/*/v3/api-docs/**").permitAll()
                        .pathMatchers("/*/*/v3/api-docs", "/*/*/v3/api-docs/**").permitAll()
                        .pathMatchers("/swagger-resources", "/swagger-resources/**").permitAll()

                        // Controller: authservice
                        .pathMatchers("/authservice/account/update-password").hasRole("Member")
                        .pathMatchers("/authservice/account/role-admin/**").hasRole("Admin")
                        .pathMatchers("/authservice/account/role-not-member/find/**").hasAnyRole("Admin", "Employee")
                        .pathMatchers("/authservice/account/role-member/**").hasRole("Member")

                        // Controller: userservice
                        .pathMatchers("/userservice/account/members/role-not-member/**").hasAnyRole("Admin", "Employee")
                        .pathMatchers("/userservice/account/members/role-member/**").hasRole("Member")

                        // Controller: bankaccountservice
                        .pathMatchers("/bankaccountservice/bankaccount/role-member/**").hasRole("Member")
                        .pathMatchers("/bankaccountservice/bankaccount/role-not-member/**")
                        .hasAnyRole("Admin", "Employee")

                        // Controller: bookingservice
                        .pathMatchers("/bookingservice/booking/role-member/**").hasRole("Member")
                        .pathMatchers("/bookingservice/booking/role-all/**").hasAnyRole("Member", "Admin","Employee")
                        .pathMatchers("/bookingservice/booking/role-not-member/**").hasAnyRole("Admin","Employee")


                        // Controller: movieservice
                        .pathMatchers("/movieservice/movie/role-not-member/**").hasAnyRole("Admin","Employee")
                        .pathMatchers("/movieservice/movie/role-employee/**").hasRole("Employee")

                        // Controller: promotionservice
                        .pathMatchers("/promotionservice/promotion/role-employee/**").hasRole("Employee")

                        // Controller: roomservice
                        .pathMatchers("/roomservice/room/role-employee/**").hasRole("Employee")
                        
                        // Controller: ticketservice
                        .pathMatchers("/ticketservice/ticket/role-employee/**").hasRole("Employee")
                         
                        // Controller: paymentservice
                        .pathMatchers("/paymentservice/payment/role-employee/**").hasRole("Employee")

                        // Controller: dashboardservice
                        .pathMatchers("/dashboardservice/dashboard/role-employee/**").hasRole("Employee")
                        // Các request còn lại phải đăng nhập
                        .anyExchange().permitAll())

                .httpBasic(Customizer.withDefaults())
                .exceptionHandling(exceptionHandlingSpec -> exceptionHandlingSpec
                        .authenticationEntryPoint(customAuthenticationEntryPoint))
                .exceptionHandling(exceptionHandlingSpec -> exceptionHandlingSpec
                        .authenticationEntryPoint(this.authenticationEntryPoint)
                        .accessDeniedHandler(this.accessDeniedHandler));

        return http.build();
    }

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        corsConfig.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        corsConfig.setMaxAge(3600L);
        corsConfig.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        corsConfig.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Cache-Control"));
        corsConfig.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);

        return new CorsWebFilter(source);
    }
}