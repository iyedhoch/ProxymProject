package project.Service.Ollama;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class OllamaServiceImpl implements OllamaService {

    private final ChatClient chatClient;

    public OllamaServiceImpl(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    @Override
    public String askOllama(String prompt) {
        return chatClient.prompt()
                .user(prompt)
                .call()
                .content(); // returns plain text
    }
}
