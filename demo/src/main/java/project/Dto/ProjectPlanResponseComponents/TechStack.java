package project.Dto.ProjectPlanResponseComponents;

import lombok.Data;
import java.util.List;

@Data
public class TechStack {
    private String frontend;
    private String backend;
    private String database;
    private List<String> other;
}