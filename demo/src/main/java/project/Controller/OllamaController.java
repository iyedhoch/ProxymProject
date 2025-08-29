package project.Controller;

import org.springframework.web.bind.annotation.*;
import project.Dto.ProjectPlanResponse;
import project.Service.Ollama.OllamaService;

import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/ollama")
public class OllamaController {

    private final OllamaService ollamaService;

    // ✅ One constructor injection
    public OllamaController(OllamaService ollamaService) {
        this.ollamaService = ollamaService;
    }

    @GetMapping("/ask")
    public String ask(@RequestParam String q) {
        return ollamaService.askOllama(q);
    }
}
