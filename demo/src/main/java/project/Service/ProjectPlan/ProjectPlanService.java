package project.Service.ProjectPlan;

import project.Dto.ProjectPlanResponse;

public interface ProjectPlanService {
    ProjectPlanResponse generateProjectPlan(String projectName, String cvFilePath, int internshipDays);
}