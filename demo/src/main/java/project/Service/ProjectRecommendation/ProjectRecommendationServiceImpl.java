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
        // Extract text from the CV PDF
        String cvText = extractTextFromPDF(cvFilePath);

        // Build the prompt for AI
        String prompt = String.format("""
                Based on this CV,and based on the retry attempt give diffrent responses so don't always give what first come to mind,
                recommend exactly 3 software project ideas.
                Each in one line, in this exact format with no deviation with no introduction:
                1. Project Name - One short line functionality
                2. Project Name - One short line functionality
                3. Project Name - One short line functionality
                
                Retry attempt: %d
                Random token: %d
                """, retryCount, (int)(Math.random() * 100000));

        // Return plain AI response as string
        String randomToken = "RetryToken-" + System.currentTimeMillis();
        String Response = ollamaService.askOllama(prompt + "\n\nCV CONTENT:\n" + cvText + "\n" + randomToken);
        return AiResponseParser.parseProjectIdeas(Response);
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
