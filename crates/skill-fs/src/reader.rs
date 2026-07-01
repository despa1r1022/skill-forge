use std::fs;
use std::path::{Path, PathBuf};

/// Read a skill's primary file content
pub fn read_skill_file(dir: &str, filename: &str) -> Result<String, String> {
    let path = Path::new(dir).join(filename);
    fs::read_to_string(&path).map_err(|e| format!("Failed to read {}: {}", path.display(), e))
}

/// Get file metadata
pub fn file_size(path: &str) -> u64 {
    Path::new(path)
        .metadata()
        .map(|m| m.len())
        .unwrap_or(0)
}

/// Check if a path exists
pub fn path_exists(path: &str) -> bool {
    Path::new(path).exists()
}

/// Expand ~ in paths
pub fn expand_path(path: &str) -> PathBuf {
    if let Some(rest) = path.strip_prefix("~/") {
        let home = std::env::var("HOME")
            .or_else(|_| std::env::var("USERPROFILE"))
            .unwrap_or_default();
        PathBuf::from(home).join(rest)
    } else {
        PathBuf::from(path)
    }
}
