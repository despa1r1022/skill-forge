/// Delete a skill by path
#[tauri::command]
pub fn delete_skill(path: String) -> Result<(), String> {
    log::info!("delete_skill called with path: {}", path);
    let result = skill_fs::writer::delete_skill_dir(&path);
    match &result {
        Ok(()) => log::info!("delete_skill succeeded for: {}", path),
        Err(e) => log::error!("delete_skill failed for {}: {}", path, e),
    }
    result
}
