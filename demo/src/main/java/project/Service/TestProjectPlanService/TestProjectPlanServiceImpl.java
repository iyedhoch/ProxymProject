package project.Service.TestProjectPlanService;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import project.Service.Ollama.OllamaService;
import project.config.AiResponseParser;
import project.Dto.ProjectPlanResponse;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.util.List;

@Service
public class TestProjectPlanServiceImpl implements TestProjectPlanService {

    private final OllamaService ollamaService;
    private final AiResponseParser aiResponseParser;

    public TestProjectPlanServiceImpl(OllamaService ollamaService, AiResponseParser aiResponseParser) {
        this.ollamaService = ollamaService;
        this.aiResponseParser = aiResponseParser;
    }

    @Override
    public ProjectPlanResponse testgenerateProjectPlan(String projectName, List<String> cvFilePaths, int internshipDays) {
        // Combine all CV texts
        StringBuilder combinedCvText = new StringBuilder();
        for (String path : cvFilePaths) {
            combinedCvText.append(extractTextFromPDF(path)).append("\n\n");
        }

        String prompt = String.format("""
            Based on these CVs:
            %s
            Use the following information to generate a detailed project plan. Structure your output exactly according to the specified format. The total project duration is %d days; you must calculate the number of weeks and create a corresponding weekly breakdown. Do not include any introductory or concluding text outside of this structure.
            
            Project Title: %s
            Core Objective: [Insert one or two sentences describing the main goal of the project.]
            Key Features: [List the 3-4 main features to be built, e.g., 1. User authentication, 2. Data dashboard, 3. Search functionality.]
            Tech Stack: [Frontend: e.g., React], [Backend: e.g., Node.js/Express], [Database: e.g., MongoDB], [Other: e.g., AWS S3]
            Final Deliverable: [e.g., A public GitHub repo, a live website URL, and a detailed README.md]
            Helpful Resources: [Optional: Suggest relevant documentation, APIs, or datasets, e.g., "Chart.js docs, Google Maps API, Sample JSON dataset for weather data."]
            Total Project Duration: %d Days
            
            Generate the plan according to this structure:
            
            Project Overview & Objectives
            Project Title: %s
            Core Objective: [Core Objective]
            Key Features: [Key Features]
            Tech Stack: [Tech Stack]
            Final Deliverable: [Final Deliverable]
            Helpful Resources: [Helpful Resources]
            
            Weekly Breakdown & Timeline
            [Based on the total duration of %d days, generate a sequential list of weeks. For each week, write a single paragraph describing the primary goal and the key activities to be completed that week. The number of weeks should be calculated from the total days.]
            
            Success Metrics & How to Present It
            [Provide brief advice on how to present this project in a portfolio or interview, suggesting the use of the STAR method.]
            
            Next Steps & Support
            [Provide a short concluding note about maintaining the GitHub repository, writing a blog post, and adjusting the plan's scope.]
            """, combinedCvText.toString(), projectName, internshipDays);

        String aiResponse = ollamaService.askOllama(prompt);

        return aiResponseParser.parse(aiResponse);
    }

    private String extractTextFromPDF(String filePath) {
        File file = Path.of(filePath).toFile();
        try (PDDocument document = PDDocument.load(file)) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        } catch (IOException e) {
            throw new RuntimeException("Failed to read PDF file: " + filePath, e);
        }
    }
}
