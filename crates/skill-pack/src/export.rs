use std::fs::File;
use std::io::{Read, Write};
use std::path::Path;
use zip::write::FileOptions;
use zip::ZipWriter;

/// Export a skill directory to a zip file
pub fn export_to_zip(skill_dir: &str, output_path: &str) -> Result<(), String> {
    let src = Path::new(skill_dir);
    if !src.is_dir() {
        return Err(format!("Source directory not found: {}", skill_dir));
    }

    let file = File::create(output_path)
        .map_err(|e| format!("Failed to create zip: {}", e))?;

    let mut zip = ZipWriter::new(file);
    let options = FileOptions::default()
        .compression_method(zip::CompressionMethod::Deflated);

    add_dir_to_zip(&mut zip, src, src, &options)?;

    zip.finish()
        .map_err(|e| format!("Failed to finalize zip: {}", e))?;

    Ok(())
}

fn add_dir_to_zip(
    zip: &mut ZipWriter<File>,
    base: &Path,
    current: &Path,
    options: &FileOptions,
) -> Result<(), String> {
    for entry in std::fs::read_dir(current)
        .map_err(|e| format!("Failed to read dir: {}", e))?
    {
        let entry = entry.map_err(|e| format!("Failed to read entry: {}", e))?;
        let path = entry.path();
        let relative = path.strip_prefix(base).unwrap_or(&path);

        if path.is_dir() {
            add_dir_to_zip(zip, base, &path, options)?;
        } else if path.is_file() {
            zip.start_file(
                relative.to_string_lossy(),
                options.clone(),
            )
            .map_err(|e| format!("Failed to start zip entry: {}", e))?;

            let mut file = File::open(&path)
                .map_err(|e| format!("Failed to open file: {}", e))?;
            let mut buf = vec![];
            file.read_to_end(&mut buf)
                .map_err(|e| format!("Failed to read file: {}", e))?;
            zip.write_all(&buf)
                .map_err(|e| format!("Failed to write zip entry: {}", e))?;
        }
    }
    Ok(())
}
