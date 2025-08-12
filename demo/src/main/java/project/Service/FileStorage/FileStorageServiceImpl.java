package project.Service.FileStorage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Set;

@Service
public class FileStorageServiceImpl implements FileStorageService {

    private Path storageLocation;
    private final long MAX_FILE_SIZE = 5 * 1024 * 1024;
    private final Set<String> ALLOWED_EXTENSIONS = Set.of("pdf");

    @Value("${file.upload-dir}")
    private String uploadDir;

    @PostConstruct
    public void init() throws IOException {
        storageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        if (!Files.exists(storageLocation)) {
            Files.createDirectories(storageLocation);
        }
    }

    @Override
    public String saveFile(MultipartFile file) throws IOException {
        validateFile(file);

        String originalFileName = file.getOriginalFilename();
        Path targetLocation = storageLocation.resolve(originalFileName);

        Files.copy(file.getInputStream(), targetLocation);

        return originalFileName;
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty!");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File size exceeds maximum allowed size of 10MB!");
        }

        String extension = getFileExtension(file.getOriginalFilename());
        if (!ALLOWED_EXTENSIONS.contains(extension.toLowerCase())) {
            throw new IllegalArgumentException("Invalid file type! Only PDF files are allowed.");
        }

        if (!"application/pdf".equalsIgnoreCase(file.getContentType())) {
            throw new IllegalArgumentException("Invalid content type! Must be application/pdf.");
        }
    }

    private String getFileExtension(String fileName) {
        if (fileName == null || !fileName.contains(".")) {
            return "";
        }
        return fileName.substring(fileName.lastIndexOf('.') + 1);
    }
}
