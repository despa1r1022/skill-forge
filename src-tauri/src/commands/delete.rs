/// Delete a skill by path
#[tauri::command]
pub fn delete_skill(path: String) -> Result<(), String> {
    skill_fs::writer::delete_skill_dir(&path)
}
