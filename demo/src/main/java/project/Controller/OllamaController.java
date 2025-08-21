package project.Controller;

import org.springframework.web.bind.annotation.*;
import project.Service.Ollama.OllamaService;


@RestController
@RequestMapping("/api/ollama")
public class OllamaController {

    private final OllamaService ollamaService;

    public OllamaController(OllamaService ollamaService) {
        this.ollamaService = ollamaService;
    }

    @GetMapping("/ask")
    public String ask(@RequestParam String q) {
        return ollamaService.askOllama(q);
    }
}