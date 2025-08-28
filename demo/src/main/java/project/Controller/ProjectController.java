package project.Controller;

import org.springframework.web.bind.annotation.*;
import project.Dto.ProjectIdea;
import project.Service.FileStorage.FileStorageService;
import project.Service.ProjectRecommendation.ProjectRecommendationService;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

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

    // ✅ changed filename → List<String> filenames
    @GetMapping("/recommendation")
    public List<ProjectIdea> getProjectRecommendation(@RequestParam("filename") List<String> filenames,
                                                      @RequestParam(defaultValue = "0") int retry) {
        try {
            // Resolve all CVs
            List<String> cvPaths = filenames.stream()
                    .map(f -> Paths.get("uploads").resolve(f).toAbsolutePath().toString())
                    .collect(Collectors.toList());

            // Call service (multi-CV overload)
            return recommendationService.recommendProjects(cvPaths, retry);
        } catch (Exception e) {
            e.printStackTrace();
            return Collections.singletonList(
                    new ProjectIdea("Error", "Failed to generate projects: " + e.getMessage())
            );
        }
    }
}
