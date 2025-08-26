package project.Service.NameExtraction;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import project.Service.Ollama.OllamaService;
import project.Dto.NameEmailResponse;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class NameExtractionServiceImpl implements NameExtractionService {

    private final OllamaService ollamaService;

    // Store results keyed by CV filename
    private final Map<String, NameEmailResponse> extractionResults = new ConcurrentHashMap<>();

    public NameExtractionServiceImpl(OllamaService ollamaService) {
        this.ollamaService = ollamaService;
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

    @Async
    @Override
    public void extractAndSaveNameAndEmail(String cvFilePath) {
        try {
            String cvText = extractTextFromPDF(cvFilePath);

            String prompt = String.format("""
                From the following CV:
                %s
                
                Extract only:
                - Full Name
                - Email Address
                
                Respond in the format: NAME;EMAIL
                """, cvText);

            String aiResponse = ollamaService.askOllama(prompt);

            // Parse the response
            String[] parts = aiResponse.split(";");
            NameEmailResponse response;
            if (parts.length == 2) {
                response = new NameEmailResponse(parts[0].trim(), parts[1].trim());
            } else {
                response = new NameEmailResponse("", "");
            }

            extractionResults.put(Path.of(cvFilePath).getFileName().toString(), response);

        } catch (Exception e) {
            e.printStackTrace();
            extractionResults.put(Path.of(cvFilePath).getFileName().toString(), new NameEmailResponse("", ""));
        }
    }

    @Override
    public NameEmailResponse getNameAndEmail(String cvFilename) {
        return extractionResults.getOrDefault(cvFilename, new NameEmailResponse("", ""));
    }
}
