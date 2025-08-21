package project.Service.ProjectPlan;

import project.Dto.ProjectPlanResponse;

public interface ProjectPlanService {
    String generateProjectPlan(String projectName, String cvFilePath, int internshipDays);
}