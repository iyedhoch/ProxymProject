package project.Service.ProjectRecommendation;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import project.Dto.ProjectIdea;
import project.Service.Ollama.OllamaService;
import project.config.AiResponseParser;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.util.List;

@Service
public class ProjectRecommendationServiceImpl implements ProjectRecommendationService {

    private final OllamaService ollamaService;

    public ProjectRecommendationServiceImpl(OllamaService ollamaService) {
        this.ollamaService = ollamaService;
    }

    @Override
    public List<ProjectIdea> recommendProjects(String cvFilePath, int retryCount) {
        // delegate to multi-CV version
        return recommendProjects(List.of(cvFilePath), retryCount);
    }

    @Override
    public List<ProjectIdea> recommendProjects(List<String> cvFilePaths, int retryCount) {
        // Combine all CV texts
        StringBuilder combinedCvText = new StringBuilder();
        for (String path : cvFilePaths) {
            combinedCvText.append(extractTextFromPDF(path)).append("\n\n");
        }

        // Build the prompt for AI
        String prompt = String.format("""
                Based on these CVs, and based on the retry attempt give different responses so you don’t always give the same ideas.
                Recommend exactly 3 software project ideas.
                Each in one line, in this exact format with no deviation and no introduction:
                1. Project Name - One short line functionality
                2. Project Name - One short line functionality
                3. Project Name - One short line functionality

                Retry attempt: %d
                Random token: %d
                """, retryCount, (int)(Math.random() * 100000));

        String randomToken = "RetryToken-" + System.currentTimeMillis();
        String response = ollamaService.askOllama(
                prompt + "\n\nCV CONTENTS:\n" + combinedCvText + "\n" + randomToken
        );

        return AiResponseParser.parseProjectIdeas(response);
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
