/// Toggle skill enabled/disabled
#[tauri::command]
pub fn toggle_skill(path: String) -> Result<bool, String> {
    skill_fs::writer::toggle_skill_dir(&path)
}
