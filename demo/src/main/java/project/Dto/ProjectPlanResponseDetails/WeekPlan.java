package project.Dto.ProjectPlanResponseDetails;

import java.util.List;

public class WeekPlan {
    private String week;
    private List<String> goals;
    private List<String> frameworks;
    private List<String> recommendedReading;

    // Getters & Setters
    public String getWeek() {
        return week;
    }
    public void setWeek(String week) {
        this.week = week;
    }
    public List<String> getGoals() {
        return goals;
    }
    public void setGoals(List<String> goals) {
        this.goals = goals;
    }
    public List<String> getFrameworks() {
        return frameworks;
    }
    public void setFrameworks(List<String> frameworks) {
        this.frameworks = frameworks;
    }
    public List<String> getRecommendedReading() {
        return recommendedReading;
    }
    public void setRecommendedReading(List<String> recommendedReading) {
        this.recommendedReading = recommendedReading;
    }
}
