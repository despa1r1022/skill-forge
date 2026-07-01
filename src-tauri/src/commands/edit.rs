/// Save (edit) a skill's SKILL.md content
#[tauri::command]
pub fn save_skill(tool_id: String, name: String, content: String) -> Result<(), String> {
    let tools = tool_core::registry::all_tools();
    let tool = tools
        .iter()
        .find(|t| t.id == tool_id)
        .ok_or(format!("Tool not found: {}", tool_id))?;

    let skills_dir = tool
        .skills_dirs
        .first()
        .ok_or("No skills directory configured")?;

    let resolved_dir = skill_fs::reader::expand_path(skills_dir);
    let file_path = resolved_dir
        .join(&name)
        .join(&tool.skill_filename);

    skill_fs::writer::atomic_write(&file_path.to_string_lossy(), &content)
}
