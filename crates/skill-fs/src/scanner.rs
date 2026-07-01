use skill_core::model::{SkillEntry, SkillMeta, SubDir, FileEntry};
use skill_core::parser;
use std::fs;
use std::path::Path;
use tool_core::profile::ToolProfile;

/// Scan a tool's skills directories and return all discovered entries
pub fn scan_tool_skills(tool: &ToolProfile) -> Vec<SkillEntry> {
    let mut results = vec![];

    for dir_pattern in &tool.skills_dirs {
        let dir_path = resolve_path(dir_pattern);
        let path = Path::new(&dir_path);
        if !path.exists() || !path.is_dir() {
            continue;
        }

        if let Ok(entries) = fs::read_dir(path) {
            for entry in entries.flatten() {
                let entry_path = entry.path();
                if !entry_path.is_dir() {
                    continue;
                }

                let dir_name = entry_path
                    .file_name()
                    .unwrap_or_default()
                    .to_string_lossy()
                    .to_string();

                let enabled = !dir_name.ends_with(".disabled");

                let skill_file = entry_path.join(&tool.skill_filename);
                if !skill_file.exists() {
                    continue;
                }

                let raw_content = fs::read_to_string(&skill_file).ok();

                let parsed = raw_content
                    .as_deref()
                    .map(|c| parser::parse_frontmatter(c));

                let subdirs = scan_subdirs(&entry_path);

                let skill_format = tool.skill_format.clone();

                let parsed_ref = parsed.as_ref();

                results.push(SkillEntry {
                    name: parsed_ref.map_or_else(
                        || dir_name.clone(),
                        |p| if p.name.is_empty() { dir_name.clone() } else { p.name.clone() },
                    ),
                    version: parsed_ref.and_then(|p| p.version.clone()),
                    description: parsed_ref.map_or_else(
                        || String::new(),
                        |p| p.description.clone(),
                    ),
                    path: entry_path.to_string_lossy().to_string(),
                    enabled,
                    tool_id: tool.id.clone(),
                    format: skill_format,
                    file_name: tool.skill_filename.clone(),
                    subdirs,
                    meta: parsed_ref.map_or(SkillMeta::default(), |p| p.meta.clone()),
                    raw_content,
                });
            }
        }
    }

    results
}

/// Scan a tool's rules directories
pub fn scan_tool_rules(tool: &ToolProfile) -> Vec<SkillEntry> {
    let mut results = vec![];

    for dir_pattern in &tool.rules_dirs {
        let dir_path = resolve_path(dir_pattern);
        let path = Path::new(&dir_path);
        if !path.exists() || !path.is_dir() {
            continue;
        }

        if let Ok(entries) = fs::read_dir(path) {
            for entry in entries.flatten() {
                let entry_path = entry.path();

                if entry_path.is_file() {
                    let ext = entry_path.extension()
                        .unwrap_or_default()
                        .to_string_lossy()
                        .to_string();

                    let expected_ext = tool.rules_extension.trim_start_matches('.');
                    if !expected_ext.is_empty() && ext != expected_ext {
                        continue;
                    }

                    let file_name = entry_path
                        .file_name()
                        .unwrap_or_default()
                        .to_string_lossy()
                        .to_string();

                    let raw_content = fs::read_to_string(&entry_path).ok();

                    results.push(SkillEntry {
                        name: file_name.clone(),
                        version: None,
                        description: format!("Rule: {}", file_name),
                        path: entry_path.to_string_lossy().to_string(),
                        enabled: true,
                        tool_id: tool.id.clone(),
                        format: skill_core::model::SkillFormat::RulesFile,
                        file_name,
                        subdirs: vec![],
                        meta: SkillMeta::default(),
                        raw_content,
                    });
                }
            }
        }
    }

    results
}

fn scan_subdirs(dir: &Path) -> Vec<SubDir> {
    let valid_dirs = ["references", "scripts", "assets", "routes", "scenes"];
    let mut result = vec![];

    for sub_name in &valid_dirs {
        let sub_path = dir.join(sub_name);
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
    walk_dir_recursive(dir, dir, &mut files)?;
    Ok(files)
}

fn walk_dir_recursive(base: &Path, dir: &Path, files: &mut Vec<FileEntry>) -> std::io::Result<()> {
    for entry in fs::read_dir(dir)? {
        let entry = entry?;
        let path = entry.path();
        let rel = path.strip_prefix(base).unwrap_or(&path);

        if path.is_dir() {
            walk_dir_recursive(base, &path, files)?;
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

fn resolve_path(path: &str) -> String {
    let home = std::env::var("HOME")
        .or_else(|_| std::env::var("USERPROFILE"))
        .unwrap_or_default();

    if let Some(rest) = path.strip_prefix("~/") {
        format!("{}/{}", home, rest)
    } else {
        path.to_string()
    }
}
