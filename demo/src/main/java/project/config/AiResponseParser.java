package project.config;

import project.Dto.ProjectIdea;

import java.util.ArrayList;
import java.util.List;

public class AiResponseParser {

    private AiResponseParser() {}

    public static List<ProjectIdea> parse(String raw) {
        List<ProjectIdea> ideas = new ArrayList<>();
        if (raw == null || raw.isEmpty()) return ideas;

        String[] lines = raw.split("\\r?\\n");
        for (String line : lines) {
            line = line.trim();
            if (line.isEmpty()) continue;

            // Remove leading number and dot if present (e.g., "1.")
            line = line.replaceFirst("^\\d+\\s*[\\.)-]?\\s*", "");

            String[] parts = line.split(" - ", 2);
            String name = parts[0].trim();
            String desc = parts.length > 1 ? parts[1].trim() : "";

            ideas.add(new ProjectIdea(name, desc));
        }

        return ideas;
    }
}
