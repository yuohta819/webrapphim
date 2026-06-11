package vn.edu.fpt.movieservice.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
@Configuration
public class CloudinaryConfig {
    @Value("${CLOUDINARY_CLOUD_NAME}")
    private String cloudname;

    @Value("${CLOUDINARY_API_KEY}")
    private String apikey;

    @Value("${CLOUDINARY_API_SECRET}")
    private String secretkey;

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudname,
                "api_key", apikey,
                "api_secret", secretkey,
                "secure", true));
    }
}