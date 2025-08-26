package project;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@EnableAsync
@SpringBootApplication
public class ProxymProjectApplication {

	public static void main(String[] args) {
		SpringApplication.run(ProxymProjectApplication.class, args);
	}

}
