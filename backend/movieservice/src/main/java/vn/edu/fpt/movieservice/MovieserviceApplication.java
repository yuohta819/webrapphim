package vn.edu.fpt.movieservice;

import java.util.TimeZone;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling;

import jakarta.annotation.PostConstruct;

@SpringBootApplication
@ComponentScan({ "vn.edu.fpt.movieservice", "vn.edu.fpt.commonservice" })
@EnableScheduling
@EnableFeignClients
public class MovieserviceApplication {

	public static void main(String[] args) {
		TimeZone.setDefault(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
		SpringApplication.run(MovieserviceApplication.class, args);
	}

	@Value("${spring.application.name}")
	private String appName;

	@PostConstruct
	public void test() {
		System.out.println("APP NAME = " + appName);
	}
}
