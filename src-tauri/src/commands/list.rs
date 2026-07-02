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

    log::info!("list_skills: tool={}, skills_dirs={:?}, skill_filename={}", tool.id, tool.skills_dirs, tool.skill_filename);
    
    let mut skills = skill_fs::scanner::scan_tool_skills(tool);
    let rules = skill_fs::scanner::scan_tool_rules(tool);
    
    log::info!("list_skills result: {} skills, {} rules", skills.len(), rules.len());
    for s in &skills {
        log::info!("  skill: name={}, path={}, enabled={}", s.name, s.path, s.enabled);
    }
    
    skills.extend(rules);
    Ok(skills)
}

/// Get file tree for a skill directory
#[tauri::command]
pub fn get_file_tree(dir: String) -> Vec<skill_core::model::SubDir> {
    skill_fs::tree::get_file_tree(&dir)
}
