use std::path::Path;
use std::process::Command;

/// Clone a Git repository skill into the target directory
pub fn clone_skill(url: &str, target_dir: &str) -> Result<(), String> {
    if !url.ends_with(".git") {
        return Err("URL must be a valid Git repository URL".to_string());
    }

    let target = Path::new(target_dir);

    // Run git clone --depth 1
    let output = Command::new("git")
        .args(["clone", "--depth", "1", url])
        .arg(target)
        .output()
        .map_err(|e| format!("Failed to execute git: {}", e))?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        return Err(format!("Git clone failed: {}", stderr));
    }

    Ok(())
}
