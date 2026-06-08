package vn.edu.fpt.roomservice;

import java.util.TimeZone;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan({"vn.edu.fpt.commonservice", "vn.edu.fpt.roomservice"})
public class RoomserviceApplication {

	public static void main(String[] args) {
		TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
		SpringApplication.run(RoomserviceApplication.class, args);
	}
	// tétt

}
