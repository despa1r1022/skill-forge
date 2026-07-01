use skill_core::model::SkillEntry;
use skill_core::parser;
use skill_fs::reader;
use tool_core::registry;

/// Get detailed info for a specific skill
#[tauri::command]
pub fn get_skill(tool_id: String, name: String) -> Result<SkillEntry, String> {
    let tools = registry::all_tools();
    let tool = tools
        .iter()
        .find(|t| t.id == tool_id)
        .ok_or(format!("Tool not found: {}", tool_id))?;

    let mut all_skills = skill_fs::scanner::scan_tool_skills(tool);
    let all_rules = skill_fs::scanner::scan_tool_rules(tool);
    all_skills.extend(all_rules);

    let mut skill = all_skills
        .into_iter()
        .find(|s| s.name == name)
        .ok_or(format!("Skill not found: {}", name))?;

    // Read full content
    let file_path = format!("{}/{}", skill.path, tool.skill_filename);
    if reader::path_exists(&file_path) {
        skill.raw_content = reader::read_skill_file(&skill.path, &tool.skill_filename).ok();
    }

    // Re-parse with full content
    if let Some(ref content) = skill.raw_content {
        let parsed = parser::parse_frontmatter(content);
        skill.meta = parsed.meta;
        if !parsed.name.is_empty() {
            skill.name = parsed.name;
        }
        if !parsed.description.is_empty() {
            skill.description = parsed.description;
        }
        skill.version = parsed.version;
    }

    Ok(skill)
}
