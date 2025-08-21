package project.Service.Ollama;


import org.springframework.web.client.RestTemplate;

public interface OllamaService {
        String askOllama(String prompt);
    }

