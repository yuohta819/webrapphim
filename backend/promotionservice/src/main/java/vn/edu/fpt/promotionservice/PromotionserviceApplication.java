package vn.edu.fpt.promotionservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@ComponentScan({"vn.edu.fpt.commonservice", "vn.edu.fpt.promotionservice"})
@EnableScheduling
public class PromotionserviceApplication {

	public static void main(String[] args) {
		SpringApplication.run(PromotionserviceApplication.class, args);
	}

}
