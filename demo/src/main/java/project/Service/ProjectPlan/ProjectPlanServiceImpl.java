package project.Service.ProjectPlan;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import project.Service.Ollama.OllamaService;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;

@Service
public class ProjectPlanServiceImpl implements ProjectPlanService{
    private final OllamaService ollamaService;

    public ProjectPlanServiceImpl(OllamaService ollamaService) {
        this.ollamaService = ollamaService;
    }

    @Override
    public String generateProjectPlan(String projectName, String cvFilePath, int internshipDays) {
        String cvText = extractTextFromPDF(cvFilePath);

        String prompt = String.format("""
                Based on this CV:
                %s

                Generate a detailed internship roadmap personalized to the cv for the project "%s" 
                for %d days. Include frameworks, weekly checklists, and any 
                additional recommendations. Make it concise but clear.dont add any introduction get straight to the point
                """, cvText, projectName, internshipDays);

        return ollamaService.askOllama(prompt);
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
