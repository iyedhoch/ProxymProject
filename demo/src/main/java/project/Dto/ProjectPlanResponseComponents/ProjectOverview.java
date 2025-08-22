package project.Dto.ProjectPlanResponseComponents;

import lombok.Data;
import java.util.List;

@Data
public class ProjectOverview {
    private String projectTitle;
    private String coreObjective;
    private List<String> keyFeatures;
    private TechStack techStack;
    private String finalDeliverable;
    private List<String> helpfulResources;
}