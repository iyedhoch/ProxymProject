package project.Dto;

import lombok.Data;

@Data
public class NameEmailResponse {
    private String name;
    private String email;

    public NameEmailResponse() {
    }

    public NameEmailResponse(String name, String email) {
        this.name = name;
        this.email = email;
    }
}
