package project.Dto.ProjectPlanResponseComponents;

import lombok.Data;
import java.util.List;

@Data
public class WeekPlan {
    private String weekLabel;
    private String summary;
    private List<String> frameworks;
    private List<String> checklist;
}
