package vn.edu.fpt.dashboardservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@EnableFeignClients
@ComponentScan({"vn.edu.fpt.commonservice", "vn.edu.fpt.dashboardservice"})
public class DashboardserviceApplication {

	public static void main(String[] args) {
		SpringApplication.run(DashboardserviceApplication.class, args);
	}

}
