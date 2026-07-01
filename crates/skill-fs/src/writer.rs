use std::fs;
use std::io::Write;
use std::path::Path;

/// Atomically write content to a file (write temp, then rename)
pub fn atomic_write(path: &str, content: &str) -> Result<(), String> {
    let target = Path::new(path);

    // Ensure parent directory exists
    if let Some(parent) = target.parent() {
        fs::create_dir_all(parent)
            .map_err(|e| format!("Failed to create directory: {}", e))?;
    }

    // Write to temp file
    let temp_path = target.with_extension("tmp");
    {
        let mut file = fs::File::create(&temp_path)
            .map_err(|e| format!("Failed to create temp file: {}", e))?;
        file.write_all(content.as_bytes())
            .map_err(|e| format!("Failed to write temp file: {}", e))?;
        file.flush()
            .map_err(|e| format!("Failed to flush temp file: {}", e))?;
    }

    // Atomic rename
    fs::rename(&temp_path, target)
        .map_err(|e| format!("Failed to rename temp file: {}", e))?;

    Ok(())
}

/// Create a new skill directory with SKILL.md template
pub fn create_skill_dir(base_dir: &str, name: &str, content: &str) -> Result<(), String> {
    let dir = Path::new(base_dir).join(name);
    fs::create_dir_all(&dir)
        .map_err(|e| format!("Failed to create skill directory: {}", e))?;

    let skill_file = dir.join("SKILL.md");
    atomic_write(&skill_file.to_string_lossy(), content)?;

    Ok(())
}

/// Delete a skill directory recursively
pub fn delete_skill_dir(path: &str) -> Result<(), String> {
    let target = Path::new(path);
    if !target.exists() {
        return Err(format!("Path does not exist: {}", path));
    }
    fs::remove_dir_all(target)
        .map_err(|e| format!("Failed to delete directory: {}", e))
}

/// Toggle skill enabled/disabled by renaming directory
pub fn toggle_skill_dir(path: &str) -> Result<bool, String> {
    let target = Path::new(path);
    let parent = target.parent().ok_or("Invalid path")?;
    let name = target
        .file_name()
        .ok_or("Invalid path")?
        .to_string_lossy()
        .to_string();

    if name.ends_with(".disabled") {
        let new_name = name.trim_end_matches(".disabled");
        let new_path = parent.join(new_name);
        fs::rename(target, &new_path)
            .map_err(|e| format!("Failed to enable skill: {}", e))?;
        Ok(true) // enabled
    } else {
        let new_name = format!("{}.disabled", name);
        let new_path = parent.join(new_name);
        fs::rename(target, &new_path)
            .map_err(|e| format!("Failed to disable skill: {}", e))?;
        Ok(false) // disabled
    }
}
