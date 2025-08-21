package project.Controller;

import org.springframework.web.bind.annotation.*;
import project.Service.FileStorage.FileStorageService;
import project.Service.ProjectRecommendation.ProjectRecommendationService;

import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/project")
public class ProjectController {

    private final FileStorageService fileStorageService;
    private final ProjectRecommendationService recommendationService;

    public ProjectController(FileStorageService fileStorageService,
                             ProjectRecommendationService recommendationService) {
        this.fileStorageService = fileStorageService;
        this.recommendationService = recommendationService;
    }

    @GetMapping("/recommendation")
    public String getProjectRecommendation(@RequestParam String filename) {
        try {
            Path cvPath = Paths.get("uploads").resolve(filename).toAbsolutePath();
            // Returns plain text directly
            return recommendationService.recommendProjects(cvPath.toString());
        } catch (Exception e) {
            e.printStackTrace();
            return "Error: Failed to generate projects: " + e.getMessage();
        }
    }
}
