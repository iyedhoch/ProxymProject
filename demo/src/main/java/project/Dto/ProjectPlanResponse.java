package project.Dto;

import project.Dto.ProjectPlanResponseDetails.ProjectOverview;
import project.Dto.ProjectPlanResponseDetails.WeekPlan;

import java.util.List;

public class ProjectPlanResponse {
    private ProjectOverview projectOverview;
    private List<WeekPlan> timeline;
    private List<String> additionalRecommendations;

    // Getters & Setters
    public ProjectOverview getProjectOverview() {
        return projectOverview;
    }
    public void setProjectOverview(ProjectOverview projectOverview) {
        this.projectOverview = projectOverview;
    }
    public List<WeekPlan> getTimeline() {
        return timeline;
    }
    public void setTimeline(List<WeekPlan> timeline) {
        this.timeline = timeline;
    }
    public List<String> getAdditionalRecommendations() {
        return additionalRecommendations;
    }
    public void setAdditionalRecommendations(List<String> additionalRecommendations) {
        this.additionalRecommendations = additionalRecommendations;
    }
}

