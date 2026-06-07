package vn.edu.fpt.apigateway.config;

import org.springdoc.core.properties.SwaggerUiConfigProperties;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;

import java.util.LinkedHashSet;
import java.util.Set;

@Configuration
public class SwaggerConfig {

    @Bean
    @Lazy(false)
    public String configureSwaggerUrls(
            RouteLocator routeLocator, 
            SwaggerUiConfigProperties swaggerUiConfigProperties) {
        
        Set<SwaggerUiConfigProperties.SwaggerUrl> urls = new LinkedHashSet<>();
        
        routeLocator.getRoutes()
                .filter(route -> route.getId() != null && !route.getId().equals("api-gateway"))
                .subscribe(route -> {
                    String serviceName = route.getId(); // Ví dụ: user-service
                    
                    // Khởi tạo trực tiếp từ static inner class của ConfigProperties
                    SwaggerUiConfigProperties.SwaggerUrl swaggerUrl = new SwaggerUiConfigProperties.SwaggerUrl();
                    swaggerUrl.setName(serviceName.toUpperCase());
                    
                    // Định dạng lại tên trùng với context-path / discovery locator của bạn
                    String cleanServiceName = serviceName.replaceAll("-service", "service").toLowerCase();
                    swaggerUrl.setUrl("/" + cleanServiceName + "/v3/api-docs");
                    
                    urls.add(swaggerUrl);
                });
                
        swaggerUiConfigProperties.setUrls(urls);
        return "Swagger URLs Configured";
    }
}