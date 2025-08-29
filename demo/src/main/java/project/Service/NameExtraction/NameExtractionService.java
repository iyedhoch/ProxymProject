package project.Service.NameExtraction;

import project.Dto.NameEmailResponse;

import java.util.List;
import java.util.Map;

public interface NameExtractionService {
    void extractAndSaveNameAndEmail(List<String> cvFilePaths);
    Map<String, NameEmailResponse> getNamesAndEmails(List<String> cvFilenames);
    NameEmailResponse getNameAndEmail(String cvFilename);
}

