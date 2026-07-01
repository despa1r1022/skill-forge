use skill_core::convert;
use skill_core::model::SkillEntry;
use tool_core::registry;

/// Copy a skill from one tool to another with automatic format conversion
#[tauri::command]
pub fn copy_skill(
    from_tool: String,
    to_tool: String,
    name: String,
) -> Result<SkillEntry, String> {
    let tools = registry::all_tools();

    let source_tool = tools
        .iter()
        .find(|t| t.id == from_tool)
        .ok_or(format!("Source tool not found: {}", from_tool))?;

    let target_tool = tools
        .iter()
        .find(|t| t.id == to_tool)
        .ok_or(format!("Target tool not found: {}", to_tool))?;

    // Find source skill
    let src_skills = skill_fs::scanner::scan_tool_skills(source_tool);
    let source = src_skills
        .iter()
        .find(|s| s.name == name)
        .ok_or(format!("Skill not found: {}", name))?;

    // Read source content
    let src_content = source.raw_content.as_deref().unwrap_or("");

    // Convert format
    let src_format = &source.format;
    let target_format = match target_tool.skill_format {
        tool_core::profile::SkillFormat::SkillMdYaml => skill_core::model::SkillFormat::SkillMdYaml,
        tool_core::profile::SkillFormat::PlainMd => skill_core::model::SkillFormat::PlainMd,
        tool_core::profile::SkillFormat::ContextFile => skill_core::model::SkillFormat::ContextFile,
        tool_core::profile::SkillFormat::RulesFile => skill_core::model::SkillFormat::RulesFile,
        _ => skill_core::model::SkillFormat::SkillMdYaml,
    };

    let converted_content = convert::convert(src_content, src_format, &target_format);

    // Write to target
    let target_dir = target_tool
        .skills_dirs
        .first()
        .ok_or("Target tool has no skills directory")?;

    let resolved_dir = skill_fs::reader::expand_path(target_dir);
    skill_fs::writer::create_skill_dir(
        &resolved_dir.to_string_lossy(),
        &name,
        &converted_content,
    )?;

    Ok(SkillEntry {
        name: name.clone(),
        version: source.version.clone(),
        description: source.description.clone(),
        path: format!("{}/{}", resolved_dir.to_string_lossy(), name),
        enabled: true,
        tool_id: target_tool.id.clone(),
        format: target_format,
        file_name: target_tool.skill_filename.clone(),
        subdirs: vec![],
        meta: source.meta.clone(),
        raw_content: Some(converted_content),
    })
}
