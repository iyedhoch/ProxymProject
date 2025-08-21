package project.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import project.Entity.ProjectPlanEntity;

public interface ProjectPlanRepository extends JpaRepository<ProjectPlanEntity, Long> {
}
