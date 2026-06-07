package vn.edu.fpt.bookingservice;

import java.util.TimeZone;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@ComponentScan({"vn.edu.fpt.commonservice", "vn.edu.fpt.bookingservice"})
@EnableFeignClients(basePackages = "vn.edu.fpt.bookingservice.client")
@EnableScheduling
public class BookingserviceApplication {

	public static void main(String[] args) {
		TimeZone.setDefault(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
		SpringApplication.run(BookingserviceApplication.class, args);
	}
   // test
}
