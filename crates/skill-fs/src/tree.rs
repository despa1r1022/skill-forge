use skill_core::model::{FileEntry, SubDir};
use std::fs;
use std::path::Path;

/// Get the file tree for a given skill directory
pub fn get_file_tree(dir: &str) -> Vec<SubDir> {
    let path = Path::new(dir);
    if !path.is_dir() {
        return vec![];
    }

    let valid_dirs = ["references", "scripts", "assets", "routes", "scenes"];
    let mut result = vec![];

    for sub_name in &valid_dirs {
        let sub_path = path.join(sub_name);
        if sub_path.is_dir() {
            if let Ok(entries) = walk_dir(&sub_path) {
                result.push(SubDir {
                    name: sub_name.to_string(),
                    files: entries,
                });
            }
        }
    }

    result
}

fn walk_dir(dir: &Path) -> std::io::Result<Vec<FileEntry>> {
    let mut files = vec![];
    walk_recursive(dir, dir, &mut files)?;
    Ok(files)
}

fn walk_recursive(base: &Path, dir: &Path, files: &mut Vec<FileEntry>) -> std::io::Result<()> {
    for entry in fs::read_dir(dir)? {
        let entry = entry?;
        let path = entry.path();
        let rel = path.strip_prefix(base).unwrap_or(&path);

        if path.is_dir() {
            walk_recursive(base, &path, files)?;
        } else if path.is_file() {
            let size = entry.metadata().map(|m| m.len()).unwrap_or(0);
            files.push(FileEntry {
                name: rel.to_string_lossy().to_string(),
                path: path.to_string_lossy().to_string(),
                size,
            });
        }
    }
    Ok(())
}
