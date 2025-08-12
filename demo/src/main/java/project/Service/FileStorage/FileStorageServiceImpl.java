package project.Service.FileStorage;



import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class FileStorageServiceImpl implements FileStorageService {

    private Path storageLocation;

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
        String originalFileName = file.getOriginalFilename();
        Path targetLocation = storageLocation.resolve(originalFileName);
        Files.copy(file.getInputStream(), targetLocation);
        return originalFileName;
    }
}

