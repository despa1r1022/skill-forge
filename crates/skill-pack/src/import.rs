use std::fs;
use std::io::Read;
use std::path::Path;

/// Import a skill from a zip file into a target directory
pub fn import_from_zip(zip_path: &str, target_dir: &str) -> Result<String, String> {
    let file = fs::File::open(zip_path)
        .map_err(|e| format!("Failed to open zip: {}", e))?;

    let mut archive = zip::ZipArchive::new(file)
        .map_err(|e| format!("Failed to read zip archive: {}", e))?;

    let target = Path::new(target_dir);
    fs::create_dir_all(target)
        .map_err(|e| format!("Failed to create target dir: {}", e))?;

    let mut skill_name = String::new();

    for i in 0..archive.len() {
        let mut entry = archive.by_index(i)
            .map_err(|e| format!("Failed to read zip entry: {}", e))?;

        let out_path = target.join(entry.name());

        if skill_name.is_empty() {
            // Extract skill name from first directory component
            if let Some(first) = entry.name().split('/').next() {
                if !first.is_empty() {
                    skill_name = first.to_string();
                }
            }
        }

        if entry.is_dir() {
            fs::create_dir_all(&out_path)
                .map_err(|e| format!("Failed to create dir: {}", e))?;
        } else {
            if let Some(parent) = out_path.parent() {
                fs::create_dir_all(parent)
                    .map_err(|e| format!("Failed to create parent dir: {}", e))?;
            }
            let mut out_file = fs::File::create(&out_path)
                .map_err(|e| format!("Failed to create file: {}", e))?;
            let mut buf = vec![];
            entry.read_to_end(&mut buf)
                .map_err(|e| format!("Failed to read entry data: {}", e))?;
            std::io::Write::write_all(&mut out_file, &buf)
                .map_err(|e| format!("Failed to write file: {}", e))?;
        }
    }

    if skill_name.is_empty() {
        skill_name = "imported-skill".to_string();
    }

    Ok(skill_name)
}
