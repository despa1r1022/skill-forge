use crate::model::SkillFormat;

/// Convert skill content between different tool formats
pub fn convert(content: &str, from: &SkillFormat, to: &SkillFormat) -> String {
    match (from, to) {
        // SKILL.md YAML -> Plain Markdown (drop frontmatter)
        (SkillFormat::SkillMdYaml, SkillFormat::PlainMd) => {
            strip_frontmatter(content)
        }
        // SKILL.md YAML -> Context File (extract body as instructions)
        (SkillFormat::SkillMdYaml, SkillFormat::ContextFile) => {
            let body = strip_frontmatter(content);
            format!("# Custom Instructions\n\n{}", body)
        }
        // SKILL.md YAML -> Rules File (keep body, add paths frontmatter)
        (SkillFormat::SkillMdYaml, SkillFormat::RulesFile) => {
            let body = strip_frontmatter(content);
            format!("---\npaths:\n  - \"**/*\"\n---\n\n{}", body)
        }
        // Plain MD -> SKILL.md YAML (add minimal frontmatter)
        (SkillFormat::PlainMd, SkillFormat::SkillMdYaml) => {
            let first_line = content.lines().next().unwrap_or("skill");
            format!(
                "---\nname: {}\ndescription: \"{}\"\n---\n\n{}",
                slugify(first_line),
                first_line,
                content
            )
        }
        // Context File -> SKILL.md YAML
        (SkillFormat::ContextFile, SkillFormat::SkillMdYaml) => {
            format!(
                "---\nname: context-instructions\ndescription: \"Converted context file\"\n---\n\n{}",
                content
            )
        }
        // Rules File -> SKILL.md YAML
        (SkillFormat::RulesFile, SkillFormat::SkillMdYaml) => {
            let body = strip_frontmatter(content);
            format!(
                "---\nname: project-rules\ndescription: \"Converted rules\"\n---\n\n{}",
                body
            )
        }
        // Same format, no conversion needed
        _ => content.to_string(),
    }
}

fn strip_frontmatter(content: &str) -> String {
    let lines: Vec<&str> = content.lines().collect();
    if lines.first().map_or(false, |l| l.trim() == "---") {
        let mut end_idx = None;
        for (i, line) in lines.iter().enumerate().skip(1) {
            if line.trim() == "---" {
                end_idx = Some(i);
                break;
            }
        }
        if let Some(idx) = end_idx {
            return lines[idx + 1..].join("\n");
        }
    }
    content.to_string()
}

fn slugify(s: &str) -> String {
    s.to_lowercase()
        .chars()
        .map(|c| if c.is_alphanumeric() { c } else { '-' })
        .collect::<String>()
        .split('-')
        .filter(|s| !s.is_empty())
        .collect::<Vec<_>>()
        .join("-")
}
