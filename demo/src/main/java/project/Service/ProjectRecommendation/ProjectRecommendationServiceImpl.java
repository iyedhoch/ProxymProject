package project.Service.ProjectRecommendation;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import project.Service.Ollama.OllamaService;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;

@Service
public class ProjectRecommendationServiceImpl implements ProjectRecommendationService {

    private final OllamaService ollamaService;

    public ProjectRecommendationServiceImpl(OllamaService ollamaService) {
        this.ollamaService = ollamaService;
    }

    @Override
    public String generateRecommendation(String cvFilePath, String prompt) {
        String cvText = extractTextFromPDF(cvFilePath);

        String fullPrompt = prompt + "\n\nCV CONTENT:\n" + cvText;

        return ollamaService.askOllama(fullPrompt);
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


