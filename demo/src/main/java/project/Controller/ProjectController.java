package project.Controller;

import org.springframework.web.bind.annotation.*;
import project.Dto.ProjectIdea;
import project.Service.FileStorage.FileStorageService;
import project.Service.ProjectRecommendation.ProjectRecommendationService;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collections;
import java.util.List;

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
    public List<ProjectIdea> getProjectRecommendation(@RequestParam String filename) {
        try {
            Path cvPath = Paths.get("uploads").resolve(filename).toAbsolutePath();
            // Call service to generate DTO list
            return recommendationService.recommendProjects(cvPath.toString());
        } catch (Exception e) {
            e.printStackTrace();
            // Return a fallback list with a single ProjectIdea containing the error
            return Collections.singletonList(
                    new ProjectIdea("Error", "Failed to generate projects: " + e.getMessage())
            );
        }
    }
}
