/// Export a skill directory to a zip file
#[tauri::command]
pub async fn export_skill(skill_path: String) -> Result<String, String> {
    let home = std::env::var("HOME")
        .or_else(|_| std::env::var("USERPROFILE"))
        .unwrap_or_default();

    let skill_name = std::path::Path::new(&skill_path)
        .file_name()
        .unwrap_or_default()
        .to_string_lossy()
        .to_string();

    let output_path = format!("{}/Desktop/{}.zip", home, skill_name);

    skill_pack::export::export_to_zip(&skill_path, &output_path)?;

    Ok(output_path)
}

/// Import a skill from a zip file into a tool's skills directory
#[tauri::command]
pub async fn import_skill(tool_id: String, zip_path: String) -> Result<(), String> {
    let tools = tool_core::registry::all_tools();
    let tool = tools
        .iter()
        .find(|t| t.id == tool_id)
        .ok_or(format!("Tool not found: {}", tool_id))?;

    let skills_dir = tool
        .skills_dirs
        .first()
        .ok_or("Target tool has no skills directory")?;

    let resolved_dir = skill_fs::reader::expand_path(skills_dir);
    skill_pack::import::import_from_zip(&zip_path, &resolved_dir.to_string_lossy())?;

    Ok(())
}
