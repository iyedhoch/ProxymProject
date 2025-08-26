package project.Service.NameExtraction;

import project.Dto.NameEmailResponse;

public interface NameExtractionService {
    void extractAndSaveNameAndEmail(String cvFilePath); // Async background
    NameEmailResponse getNameAndEmail(String cvFilename);
}

