use skill_core::model::{CreateRequest, SkillEntry, SkillMeta, TemplateType};
use skill_core::validate;
use std::fs;
use std::path::Path;
use tool_core::registry;

fn map_err(e: impl std::fmt::Display) -> String {
    e.to_string()
}

/// Create a new skill for a specific tool
#[tauri::command]
pub fn create_skill(tool_id: String, req: CreateRequest) -> Result<SkillEntry, String> {
    validate::validate_name(&req.name).map_err(map_err)?;
    validate::validate_description(&req.description).map_err(map_err)?;

    if let Some(ref version) = req.version {
        if !version.is_empty() {
            validate::validate_version(version).map_err(map_err)?;
        }
    }

    let tools = registry::all_tools();
    let tool = tools
        .iter()
        .find(|t| t.id == tool_id)
        .ok_or(format!("Tool not found: {}", tool_id))?;

    let skills_dir = tool
        .skills_dirs
        .first()
        .ok_or("No skills directory configured")?;

    let resolved_dir = skill_fs::reader::expand_path(skills_dir);
    let dir_str = resolved_dir.to_string_lossy().to_string();

    // Build SKILL.md content
    let version_line = req
        .version
        .as_ref()
        .map(|v| format!("version: \"{}\"\n", v))
        .unwrap_or_default();

    let content = format!(
        "---\nname: {}\n{}description: \"{}\"\n---\n\n# {}\n\n{}",
        req.name, version_line, req.description, req.name, req.description
    );

    skill_fs::writer::create_skill_dir(&dir_str, &req.name, &content)?;

    // Create custom subdirectories
    let skill_path = format!("{}/{}", dir_str, req.name);

    // First handle template-based subdirs
    if let Some(template) = &req.template {
        match template {
            TemplateType::WithReferences => {
                fs::create_dir_all(format!("{}/references", skill_path))
                    .map_err(|e| format!("Failed to create references dir: {}", e))?;
            }
            TemplateType::WithScripts => {
                fs::create_dir_all(format!("{}/references", skill_path))
                    .map_err(|e| format!("Failed to create references dir: {}", e))?;
                fs::create_dir_all(format!("{}/scripts", skill_path))
                    .map_err(|e| format!("Failed to create scripts dir: {}", e))?;
            }
            TemplateType::Minimal => {}
        }
    }

    // Then create custom subdirectories and files
    if let Some(dirs) = &req.subdirs {
        for dir in dirs {
            let target = format!("{}/{}", skill_path, dir);
            fs::create_dir_all(&target)
                .map_err(|e| format!("Failed to create '{}' dir: {}", dir, e))?;
        }
    }

    // Create files in subdirectories
    if let Some(files) = &req.files {
        for f in files {
            let dir = Path::new(&skill_path).join(&f.subdir);
            fs::create_dir_all(&dir)
                .map_err(|e| format!("Failed to ensure dir '{}': {}", f.subdir, e))?;
            let filepath = dir.join(&f.filename);
            let content = f.content.as_deref().unwrap_or("");
            fs::write(&filepath, content)
                .map_err(|e| format!("Failed to create file '{}': {}", f.filename, e))?;
        }
    }

    Ok(SkillEntry {
        name: req.name.clone(),
        version: req.version,
        description: req.description,
        path: skill_path,
        enabled: true,
        tool_id: tool.id.clone(),
        format: skill_core::model::SkillFormat::SkillMdYaml,
        file_name: "SKILL.md".into(),
        subdirs: vec![],
        meta: SkillMeta::default(),
        raw_content: Some(content),
    })
}
