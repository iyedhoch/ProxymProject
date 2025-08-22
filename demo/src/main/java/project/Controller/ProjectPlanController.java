package project.Controller;

import org.springframework.web.bind.annotation.*;
import project.Service.ProjectPlan.ProjectPlanService;
import project.Dto.ProjectPlanResponse;

import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/project/plan")
public class ProjectPlanController {

    private final ProjectPlanService projectPlanService;

    public ProjectPlanController(ProjectPlanService projectPlanService) {
        this.projectPlanService = projectPlanService;
    }

    @GetMapping("/generate")
    public ProjectPlanResponse generatePlan(@RequestParam String projectName,
                                            @RequestParam int internshipDays,
                                            @RequestParam String cvFilename) {
        try {
            // Build path to existing CV in the uploads folder
            Path cvPath = Paths.get("uploads").resolve(cvFilename).toAbsolutePath();

            // Generate detailed plan and return structured response
            return projectPlanService.generateProjectPlan(
                    projectName,
                    cvPath.toString(),
                    internshipDays
            );
        } catch (Exception e) {
            e.printStackTrace();
            // Return an empty response with error handling (consider proper error response DTO)
            ProjectPlanResponse errorResponse = new ProjectPlanResponse();
            // You might want to add error fields to your ProjectPlanResponse or create a separate error DTO
            return errorResponse;
        }
    }
}