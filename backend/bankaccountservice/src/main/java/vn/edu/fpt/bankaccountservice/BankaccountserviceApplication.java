package vn.edu.fpt.bankaccountservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@ComponentScan({"vn.edu.fpt.commonservice", "vn.edu.fpt.bankaccountservice"})
@EnableFeignClients(basePackages = "vn.edu.fpt.bankaccountservice.client")
@EnableScheduling
public class BankaccountserviceApplication {

	public static void main(String[] args) {
		SpringApplication.run(BankaccountserviceApplication.class, args);
	}
	// test

}
