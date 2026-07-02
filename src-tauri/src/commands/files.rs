use std::fs;
use std::path::Path;

/// Create a new empty file in a skill's subdirectory
#[tauri::command]
pub fn create_file(skill_path: String, subdir: String, filename: String) -> Result<(), String> {
    let dir = Path::new(&skill_path).join(&subdir);
    fs::create_dir_all(&dir)
        .map_err(|e| format!("Failed to create directory: {}", e))?;
    let file_path = dir.join(&filename);
    fs::write(&file_path, "")
        .map_err(|e| format!("Failed to create file: {}", e))?;
    Ok(())
}

/// Create a new subdirectory in a skill's directory
#[tauri::command]
pub fn create_directory(skill_path: String, dirname: String) -> Result<(), String> {
    let target = Path::new(&skill_path).join(&dirname);
    fs::create_dir_all(&target)
        .map_err(|e| format!("Failed to create directory: {}", e))?;
    Ok(())
}

/// Save content to a file
#[tauri::command]
pub fn save_file_content(path: String, content: String) -> Result<(), String> {
    skill_fs::writer::atomic_write(&path, &content)
}

/// Delete a file
#[tauri::command]
pub fn delete_file(path: String) -> Result<(), String> {
    fs::remove_file(&path)
        .map_err(|e| format!("Failed to delete file: {}", e))
}

/// Read file content
#[tauri::command]
pub fn read_file_content(path: String) -> Result<String, String> {
    fs::read_to_string(&path)
        .map_err(|e| format!("Failed to read file: {}", e))
}

/// Import a local skill folder: validate and copy to tool's skills directory
#[tauri::command]
pub fn import_local_skill(tool_id: String, source_path: String) -> Result<String, String> {
    let src = Path::new(&source_path);
    if !src.is_dir() {
        return Err("Source path is not a directory".into());
    }

    // Validate: must contain SKILL.md
    let skill_file = src.join("SKILL.md");
    if !skill_file.exists() {
        return Err("Folder must contain SKILL.md file".into());
    }

    // Try to parse frontmatter
    let content = fs::read_to_string(&skill_file)
        .map_err(|e| format!("Cannot read SKILL.md: {}", e))?;

    let parsed = skill_core::parser::parse_frontmatter(&content);
    if parsed.name.is_empty() {
        return Err("SKILL.md must have a valid 'name' in frontmatter".into());
    }

    // Validate tool supports this format
    let tools = tool_core::registry::all_tools();
    let tool = tools.iter().find(|t| t.id == tool_id)
        .ok_or(format!("Tool not found: {}", tool_id))?;

    if !tool.has_skills {
        return Err(format!("{} does not support skills", tool.name));
    }

    // Get or derive skill name
    let skill_name = src.file_name()
        .ok_or("Invalid source path")?
        .to_string_lossy()
        .to_string();

    // Target directory
    let skills_dir = tool.skills_dirs.first()
        .ok_or("No skills directory configured")?;
    let resolved_dir = skill_fs::reader::expand_path(skills_dir);
    let target = resolved_dir.join(&skill_name);

    if target.exists() {
        return Err(format!("Skill '{}' already exists in {}", skill_name, tool.name));
    }

    // Copy recursively
    copy_dir_recursive(src, &target)
        .map_err(|e| format!("Failed to copy: {}", e))?;

    Ok(skill_name)
}

fn copy_dir_recursive(src: &Path, dst: &Path) -> std::io::Result<()> {
    fs::create_dir_all(dst)?;
    for entry in fs::read_dir(src)? {
        let entry = entry?;
        let entry_path = entry.path();
        let target_path = dst.join(entry.file_name());
        if entry_path.is_dir() {
            copy_dir_recursive(&entry_path, &target_path)?;
        } else {
            fs::copy(&entry_path, &target_path)?;
        }
    }
    Ok(())
}
