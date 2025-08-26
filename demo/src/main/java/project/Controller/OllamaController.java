package project.Controller;

import org.springframework.web.bind.annotation.*;
import project.Dto.NameEmailResponse;
import project.Service.NameExtraction.NameExtractionService;
import project.Service.Ollama.OllamaService;

import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/ollama")
public class OllamaController {

    private final NameExtractionService nameExtractionService;
    private final OllamaService ollamaService;

    // ✅ One constructor injection
    public OllamaController(NameExtractionService nameExtractionService,
                            OllamaService ollamaService) {
        this.nameExtractionService = nameExtractionService;
        this.ollamaService = ollamaService;
    }

    @GetMapping("/ask")
    public String ask(@RequestParam String q) {
        return ollamaService.askOllama(q);
    }

    @GetMapping("/extract")
    public NameEmailResponse extract(@RequestParam String cvFilename) {
        Path cvPath = Paths.get("uploads").resolve(cvFilename).toAbsolutePath();
        return nameExtractionService.extractAndSaveNameAndEmail(cvPath.toString());
    }
}
