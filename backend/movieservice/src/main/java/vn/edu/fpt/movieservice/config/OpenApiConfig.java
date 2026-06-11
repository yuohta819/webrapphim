package vn.edu.fpt.movieservice.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Movie Service API")
                        .version("1.0")
                        .description("API Documentation for Movie Service in the Cinema Management System.")
                        .contact(new Contact().name("Developer").email("developer@fpt.edu.vn"))
                        .license(new License().name("Apache 2.0").url("http://springdoc.org")));
    }
}
