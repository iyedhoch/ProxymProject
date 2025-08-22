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
    public List<ProjectIdea> recommendProjects(String cvFilePath) {
        // Extract text from the CV PDF
        String cvText = extractTextFromPDF(cvFilePath);

        // Build the prompt for AI
        String prompt = """
                Based on this CV,
                recommend exactly 3 software project ideas.
                Each in one line, in this exact format with no introduction:
                1. Project Name - One short line functionality
                2. Project Name - One short line functionality
                3. Project Name - One short line functionality
                """;

        // Return plain AI response as string
        String Response = ollamaService.askOllama(prompt + "\n\nCV CONTENT:\n" + cvText);
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
