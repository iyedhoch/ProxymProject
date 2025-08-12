package project.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UploadResponse {
    private String fileName;
    private String fileDownloadUri;
    private String message;
}
