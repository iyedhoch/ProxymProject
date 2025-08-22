package project.Dto.ProjectPlanResponseComponents;

import lombok.Data;
import java.util.List;

@Data
public class SuccessSection {
    private String method;
    private List<String> talkingPoints;
}
