mod commands;

use commands::*;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            list_tools,
            detect_tools,
            list_skills,
            get_skill,
            get_file_tree,
            create_skill,
            save_skill,
            delete_skill,
            toggle_skill,
            copy_skill,
            export_skill,
            import_skill,
        ])
        .run(tauri::generate_context!())
        .expect("error while running SkillForge");
}
