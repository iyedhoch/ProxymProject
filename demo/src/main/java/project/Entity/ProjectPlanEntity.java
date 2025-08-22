package project.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "project_plans")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectPlanEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String projectName;

    private int internshipDays;

    // Store full ProjectPlanResponse as JSON
    @Lob
    @Column(columnDefinition = "CLOB")
    private String planJson;
}
