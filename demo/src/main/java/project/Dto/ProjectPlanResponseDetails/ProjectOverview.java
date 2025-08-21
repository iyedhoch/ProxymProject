package project.Dto.ProjectPlanResponseDetails;

import java.util.List;

public class ProjectOverview {
    private String projectName;
    private String detailedDescription;
    private Frameworks generalFrameworks;
    private List<String> generalRecommendations;

    // Getters & Setters
    public String getProjectName() {
        return projectName;
    }
    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }
    public String getDetailedDescription() {
        return detailedDescription;
    }
    public void setDetailedDescription(String detailedDescription) {
        this.detailedDescription = detailedDescription;
    }
    public Frameworks getGeneralFrameworks() {
        return generalFrameworks;
    }
    public void setGeneralFrameworks(Frameworks generalFrameworks) {
        this.generalFrameworks = generalFrameworks;
    }
    public List<String> getGeneralRecommendations() {
        return generalRecommendations;
    }
    public void setGeneralRecommendations(List<String> generalRecommendations) {
        this.generalRecommendations = generalRecommendations;
    }
}
