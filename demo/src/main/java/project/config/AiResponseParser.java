package project.config;

import org.springframework.stereotype.Component;
import project.Dto.ProjectIdea;

import java.util.ArrayList;
import java.util.List;

import project.Dto.ProjectPlanResponse;
import project.Dto.ProjectPlanResponseComponents.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class AiResponseParser {

    /**
     * Parses an AI response text into a list of ProjectIdea DTOs.
     * Expected format:
     * 1. Project Name - Description
     * 2. Another Project - Description
     */
    public static List<ProjectIdea> parseProjectIdeas(String aiResponse) {
        List<ProjectIdea> ideas = new ArrayList<>();

        if (aiResponse == null || aiResponse.isBlank()) {
            return ideas;
        }

        String[] lines = aiResponse.split("\n");

        for (String line : lines) {
            // Match numbered items like "1. Expense Tracker - A mobile app..."
            if (line.matches("^\\d+\\.\\s+.*-.*")) {
                String[] parts = line.split("-", 2);
                if (parts.length == 2) {
                    String name = parts[0].replaceFirst("^\\d+\\.\\s*", "").trim();
                    String description = parts[1].trim();
                    ideas.add(new ProjectIdea(name, description));
                }
            }
        }

        // Fallback: if parsing failed, store the raw response as one project idea
        if (ideas.isEmpty()) {
            ideas.add(new ProjectIdea("AI Response", aiResponse));
        }

        return ideas;
    }

    public ProjectPlanResponse parse(String aiResponse) {
        ProjectPlanResponse response = new ProjectPlanResponse();

        // Clean the response - remove markdown formatting
        String cleanedResponse = aiResponse.replace("**", "").replace("*", "").trim();

        response.setProjectOverview(parseOverview(cleanedResponse));
        response.setTimeline(parseWeeklyPlan(cleanedResponse));
        response.setSuccess(parseSuccess(cleanedResponse));
        response.setNextSteps(parseNextSteps(cleanedResponse));

        return response;
    }

    private ProjectOverview parseOverview(String text) {
        ProjectOverview overview = new ProjectOverview();
        TechStack techStack = new TechStack();

        // Extract project title
        overview.setProjectTitle(extractByPattern(text, "Project Title:\\s*([^\n]+)"));

        // Extract core objective
        overview.setCoreObjective(extractMultiLine(text, "Core Objective:", "Key Features:|Tech Stack:"));

        // Extract key features - limit to 4-5 items max
        List<String> features = extractListItems(text, "Key Features:");
        if (features.size() > 5) {
            overview.setKeyFeatures(features.subList(0, 5)); // Limit to first 5 features
        } else {
            overview.setKeyFeatures(features);
        }

        // Extract tech stack
        String techStackText = extractMultiLine(text, "Tech Stack:", "Final Deliverable:|Helpful Resources:");
        if (techStackText != null) {
            parseTechStack(techStackText, techStack);
        }
        overview.setTechStack(techStack);

        // Extract final deliverable
        overview.setFinalDeliverable(extractMultiLine(text, "Final Deliverable:", "Helpful Resources:|Weekly Breakdown"));

        // Extract helpful resources - be more strict about what constitutes a resource
        List<String> resources = extractHelpfulResources(text);
        overview.setHelpfulResources(resources);

        return overview;
    }

    private List<String> extractHelpfulResources(String text) {
        List<String> resources = new ArrayList<>();
        String resourcesSection = extractMultiLine(text, "Helpful Resources:", "Weekly Breakdown");

        if (resourcesSection != null) {
            // Only take lines that look like actual resources, not section headers
            String[] lines = resourcesSection.split("\n");
            for (String line : lines) {
                String trimmed = line.trim();
                if (!trimmed.isEmpty() &&
                        !trimmed.startsWith("Week") &&
                        !trimmed.startsWith("Success Metrics") &&
                        !trimmed.startsWith("Next Steps") &&
                        !trimmed.matches("^[A-Z][a-z]+\\s+[A-Z][a-z]+.*")) {
                    resources.add(trimmed);
                }
            }
        }

        // If no valid resources found, return empty list
        return resources.isEmpty() ? List.of("None specified") : resources;
    }

    private void parseTechStack(String techStackText, TechStack techStack) {
        // Parse frontend
        techStack.setFrontend(extractByPattern(techStackText, "Frontend[\\s:\\-]*([^,\n]+)"));

        // Parse backend
        techStack.setBackend(extractByPattern(techStackText, "Backend[\\s:\\-]*([^,\n]+)"));

        // Parse database
        techStack.setDatabase(extractByPattern(techStackText, "Database[\\s:\\-]*([^,\n]+)"));

        // Parse other technologies
        String otherText = extractByPattern(techStackText, "Other[\\s:\\-]*([^\n]+)");
        if (otherText != null) {
            techStack.setOther(List.of(otherText.split("\\s*,\\s*")));
        } else {
            techStack.setOther(List.of());
        }
    }

    private List<WeekPlan> parseWeeklyPlan(String text) {
        List<WeekPlan> weeks = new ArrayList<>();

        // Find the weekly breakdown section
        String weeklySection = extractSection(text, "Weekly Breakdown & Timeline", "Success Metrics|Next Steps");
        if (weeklySection == null) return weeks;

        // Split by week markers using a pattern that matches "Week X (Days Y-Z):"
        Pattern weekPattern = Pattern.compile("Week\\s+(\\d+)\\s*\\([^)]+\\):", Pattern.CASE_INSENSITIVE);
        Matcher weekMatcher = weekPattern.matcher(weeklySection);

        List<Integer> weekStarts = new ArrayList<>();
        List<Integer> weekEnds = new ArrayList<>();
        List<String> weekLabels = new ArrayList<>();

        // Find all week markers and their positions
        while (weekMatcher.find()) {
            weekStarts.add(weekMatcher.start());
            weekLabels.add("Week " + weekMatcher.group(1));
            if (weekStarts.size() > 1) {
                weekEnds.add(weekMatcher.start() - 1);
            }
        }

        // Add final end position
        if (!weekStarts.isEmpty()) {
            weekEnds.add(weeklySection.length());
        }

        // Extract each week's content
        for (int i = 0; i < weekStarts.size(); i++) {
            int start = weekStarts.get(i);
            int end = weekEnds.get(i);

            if (start < end) {
                String weekContent = weeklySection.substring(start, end).trim();

                // Remove the week label from the content
                weekContent = weekContent.replaceFirst("Week\\s+\\d+\\s*\\([^)]+\\):", "").trim();

                WeekPlan week = new WeekPlan();
                week.setWeekLabel(weekLabels.get(i));
                week.setSummary(weekContent);
                weeks.add(week);
            }
        }

        return weeks;
    }

    private SuccessSection parseSuccess(String text) {
        SuccessSection success = new SuccessSection();
        String successSection = extractSection(text, "Success Metrics & How to Present It", "Next Steps");

        if (successSection != null) {
            success.setMethod("STAR");
            // Clean up the success section - remove any accidental week content
            String cleanedContent = successSection.replaceAll("Week\\s+\\d+.*", "").trim();
            success.setTalkingPoints(List.of(cleanedContent));
        }

        return success;
    }

    private NextStepsSection parseNextSteps(String text) {
        NextStepsSection nextSteps = new NextStepsSection();
        String nextStepsSection = extractSection(text, "Next Steps & Support", null);

        if (nextStepsSection != null) {
            // Clean up next steps - remove any accidental week content
            String cleanedContent = nextStepsSection.replaceAll("Week\\s+\\d+.*", "").trim();
            nextSteps.setActions(List.of(cleanedContent));
        }

        return nextSteps;
    }

    // --- Utility Methods ---

    private String extractSection(String text, String startMarker, String endMarker) {
        Pattern pattern = Pattern.compile("(?i)" + startMarker + "\\s*(.*?)(?=" +
                (endMarker != null ? endMarker : "$") + ")", Pattern.DOTALL);
        Matcher matcher = pattern.matcher(text);
        return matcher.find() ? matcher.group(1).trim() : null;
    }

    private String extractByPattern(String text, String regex) {
        Pattern pattern = Pattern.compile("(?i)" + regex);
        Matcher matcher = pattern.matcher(text);
        return matcher.find() ? matcher.group(1).trim() : null;
    }

    private String extractMultiLine(String text, String startKey, String endKey) {
        Pattern pattern = Pattern.compile("(?i)" + startKey + "\\s*(.*?)(?=" +
                (endKey != null ? endKey : "$") + ")", Pattern.DOTALL);
        Matcher matcher = pattern.matcher(text);
        return matcher.find() ? matcher.group(1).trim() : null;
    }

    private List<String> extractListItems(String text, String sectionKey) {
        List<String> items = new ArrayList<>();
        String content = sectionKey != null ? extractMultiLine(text, sectionKey, null) : text;

        if (content != null) {
            // Match numbered lists (1., 2., etc.) or bullet points (+, -, *)
            Pattern pattern = Pattern.compile("(?m)^(?:\\s*\\d+\\.|\\s*[+\\-*])\\s*(.+)$");
            Matcher matcher = pattern.matcher(content);

            while (matcher.find()) {
                String item = matcher.group(1).trim();
                // Don't include items that look like section headers
                if (!item.matches(".*[Ww]eek\\s+\\d+.*") &&
                        !item.matches(".*[Ss]uccess.*") &&
                        !item.matches(".*[Nn]ext.*")) {
                    items.add(item);
                }
            }
        }

        return items;
    }

}
