package project.Controller;

import org.springframework.web.bind.annotation.*;
import project.Dto.NameEmailResponse;
import project.Service.ProjectPlan.ProjectPlanService;
import project.Service.NameExtraction.NameExtractionService;
import project.Dto.ProjectPlanResponse;

import java.nio.file.Path;
import java.nio.file.Paths;

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
                                            @RequestParam String cvFilename) {
        try {
            // Build path to existing CV in the uploads folder
            Path cvPath = Paths.get("uploads").resolve(cvFilename).toAbsolutePath();

            // Generate detailed plan
            ProjectPlanResponse planResponse = projectPlanService.generateProjectPlan(
                    projectName,
                    cvPath.toString(),
                    internshipDays
            );

            // Start name/email extraction asynchronously
            nameExtractionService.extractAndSaveNameAndEmail(cvPath.toString());

            // Immediately return plan to frontend
            return planResponse;

        } catch (Exception e) {
            e.printStackTrace();
            return new ProjectPlanResponse(); // fallback empty response
        }
    }
    @GetMapping("/get")
    public NameEmailResponse getNameAndEmail(@RequestParam String cvFilename) {
        return nameExtractionService.getNameAndEmail(cvFilename);
    }
}

