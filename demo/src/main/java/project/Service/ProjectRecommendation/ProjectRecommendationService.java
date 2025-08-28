package project.Service.ProjectRecommendation;

import project.Dto.ProjectIdea;

import java.util.List;

public interface ProjectRecommendationService {

    List<ProjectIdea> recommendProjects(String cvFilePath,int retryCount);
    List<ProjectIdea> recommendProjects(List<String> cvFilePaths, int retryCount);
}