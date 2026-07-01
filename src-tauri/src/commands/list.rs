use skill_core::model::SkillEntry;
use tool_core::registry;

/// List all skills for a specific tool
#[tauri::command]
pub fn list_skills(tool_id: String) -> Result<Vec<SkillEntry>, String> {
    let tools = registry::all_tools();
    let tool = tools
        .iter()
        .find(|t| t.id == tool_id)
        .ok_or(format!("Tool not found: {}", tool_id))?;

    let mut skills = skill_fs::scanner::scan_tool_skills(tool);
    let rules = skill_fs::scanner::scan_tool_rules(tool);
    skills.extend(rules);

    Ok(skills)
}

/// Get file tree for a skill directory
#[tauri::command]
pub fn get_file_tree(dir: String) -> Vec<skill_core::model::SubDir> {
    skill_fs::tree::get_file_tree(&dir)
}
