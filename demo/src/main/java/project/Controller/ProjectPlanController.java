package project.Controller;

import org.springframework.web.bind.annotation.*;
import project.Dto.NameEmailResponse;
import project.Service.ProjectPlan.ProjectPlanService;
import project.Service.NameExtraction.NameExtractionService;
import project.Dto.ProjectPlanResponse;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/project/plan")
public class ProjectPlanController {

    private final ProjectPlanService projectPlanService;
    private final NameExtractionService nameExtractionService;

    public ProjectPlanController(ProjectPlanService projectPlanService,
                                 NameExtractionService nameExtractionService) {
        this.projectPlanService = projectPlanService;
        this.nameExtractionService = nameExtractionService;
    }

    @GetMapping("/generate")
    public ProjectPlanResponse generatePlan(@RequestParam String projectName,
                                            @RequestParam int internshipDays,
                                            @RequestParam("cvFilename") List<String> cvFilenames) {
        try {
            // Resolve all CV paths
            List<String> cvPaths = cvFilenames.stream()
                    .map(f -> Paths.get("uploads").resolve(f).toAbsolutePath().toString())
                    .collect(Collectors.toList());

            // Generate detailed plan with multiple CVs
            ProjectPlanResponse planResponse = projectPlanService.generateProjectPlan(
                    projectName,
                    cvPaths,
                    internshipDays
            );

            // Start name/email extraction asynchronously for all CVs
            nameExtractionService.extractAndSaveNameAndEmail(cvPaths);

            // Immediately return plan to frontend
            return planResponse;

        } catch (Exception e) {
            e.printStackTrace();
            return new ProjectPlanResponse(); // fallback empty response
        }
    }

    // New endpoint to get multiple name/email results
    @GetMapping("/get-multiple")
    public Map<String, NameEmailResponse> getNamesAndEmails(@RequestParam("cvFilename") List<String> cvFilenames) {
        return nameExtractionService.getNamesAndEmails(cvFilenames);
    }

    // Keep the single endpoint for backward compatibility
    @GetMapping("/get")
    public NameEmailResponse getNameAndEmail(@RequestParam String cvFilename) {
        return nameExtractionService.getNameAndEmail(cvFilename);
    }
}