package project.Service.ProjectPlan;

import project.Dto.ProjectPlanResponse;

import java.util.List;

public interface ProjectPlanService {
    ProjectPlanResponse generateProjectPlan(String projectName, String cvFilePath, int internshipDays);
}