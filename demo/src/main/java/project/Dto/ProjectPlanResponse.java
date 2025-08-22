package project.Dto;

import lombok.Data;
import project.Dto.ProjectPlanResponseComponents.ProjectOverview;
import project.Dto.ProjectPlanResponseComponents.WeekPlan;
import project.Dto.ProjectPlanResponseComponents.SuccessSection;
import project.Dto.ProjectPlanResponseComponents.NextStepsSection;

import java.util.List;

@Data
public class ProjectPlanResponse {
    private ProjectOverview projectOverview;
    private List<WeekPlan> timeline;
    private SuccessSection success;
    private NextStepsSection nextSteps;
}