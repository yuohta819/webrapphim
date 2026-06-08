package vn.edu.fpt.authservice;

import java.util.TimeZone;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.WebApplicationType;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages ={"vn.edu.fpt.commonservice","vn.edu.fpt.authservice"})
@EnableFeignClients
public class AuthserviceApplication {

	public static void main(String[] args) {
		SpringApplication app = new SpringApplication(AuthserviceApplication.class);
		
        app.setWebApplicationType(WebApplicationType.SERVLET); // Ép ứng dụng giữ luồng chạy web không tự tắt
		TimeZone.setDefault(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
		System.out.println(TimeZone.getDefault().getID());
        app.run(args);
		// rers dddd
	}

}
