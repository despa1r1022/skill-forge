use tool_core::detect;
use serde::Serialize;

#[derive(Serialize)]
pub struct ToolInfo {
    pub id: String,
    pub name: String,
    pub description: String,
    pub installed: bool,
    pub has_skills: bool,
    pub has_rules: bool,
    pub skill_count: usize,
}

#[tauri::command]
pub fn list_tools() -> Vec<ToolInfo> {
    let detections = detect::detect_all();

    detections
        .into_iter()
        .map(|d| {
            let skills = d.tool.has_skills.then(|| {
                skill_fs::scanner::scan_tool_skills(&d.tool).len()
            }).unwrap_or(0);

            ToolInfo {
                id: d.tool.id,
                name: d.tool.name,
                description: d.tool.description,
                installed: d.installed,
                has_skills: d.tool.has_skills,
                has_rules: d.tool.has_rules,
                skill_count: skills,
            }
        })
        .collect()
}

#[tauri::command]
pub fn detect_tools() -> Vec<tool_core::detect::ToolDetection> {
    detect::detect_all()
}
