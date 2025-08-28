package project.Service.TestProjectPlanService;

import project.Dto.ProjectPlanResponse;

import java.util.List;

public interface TestProjectPlanService {
    ProjectPlanResponse testgenerateProjectPlan(String projectName, List<String> cvFilePaths, int internshipDays);
}
