package project.Controller;

import org.springframework.web.bind.annotation.*;
import project.Dto.ProjectPlanResponse;
import project.Service.Ollama.OllamaService;
import project.Service.TestProjectPlanService.TestProjectPlanService;

import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/ollama")
public class OllamaController {

    private final TestProjectPlanService testProjectPlanService;
    private final OllamaService ollamaService;

    // ✅ One constructor injection
    public OllamaController(OllamaService ollamaService, TestProjectPlanService testProjectPlanService) {
        this.testProjectPlanService = testProjectPlanService;
        this.ollamaService = ollamaService;
    }

    @GetMapping("/ask")
    public String ask(@RequestParam String q) {
        return ollamaService.askOllama(q);
    }

    @GetMapping("/project-plan")
    public ProjectPlanResponse generateProjectPlan(
            @RequestParam String projectName,
            @RequestParam String cvFilenames,
            @RequestParam int durationDays) {

        String[] filenames = cvFilenames.split(",");
        List<String> cvPaths = Arrays.stream(filenames)
                .map(f -> Paths.get("uploads").resolve(f).toAbsolutePath().toString())
                .toList();

        return testProjectPlanService.testgenerateProjectPlan(projectName, cvPaths, durationDays);
    }

}
