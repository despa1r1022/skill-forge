use serde::{Deserialize, Serialize};
pub use tool_core::profile::SkillFormat;

/// Represents a parsed skill or rule entry
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SkillEntry {
    /// Skill name (from directory or frontmatter)
    pub name: String,
    /// Skill version (from frontmatter, if present)
    pub version: Option<String>,
    /// Skill description
    pub description: String,
    /// Full path to the skill directory
    pub path: String,
    /// Whether the skill is enabled (not .disabled)
    pub enabled: bool,
    /// Which tool this belongs to
    pub tool_id: String,
    /// Format type
    pub format: SkillFormat,
    /// File entry name (e.g. "SKILL.md", "AGENTS.md")
    pub file_name: String,
    /// Subdirectories in the skill directory
    pub subdirs: Vec<SubDir>,
    /// Additional metadata extracted from frontmatter
    pub meta: SkillMeta,
    /// Raw content of the primary file
    pub raw_content: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SkillMeta {
    pub requires_bins: Vec<String>,
    pub requires_env: Vec<String>,
    pub requires_siblings: Vec<String>,
    pub openclaw_source: Option<String>,
    pub paths: Vec<String>,
}

impl Default for SkillMeta {
    fn default() -> Self {
        Self {
            requires_bins: vec![],
            requires_env: vec![],
            requires_siblings: vec![],
            openclaw_source: None,
            paths: vec![],
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SubDir {
    pub name: String,
    pub files: Vec<FileEntry>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FileEntry {
    pub name: String,
    pub path: String,
    pub size: u64,
}

/// Request to create a new skill
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateRequest {
    pub name: String,
    pub description: String,
    pub version: Option<String>,
    pub template: Option<TemplateType>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum TemplateType {
    Minimal,
    WithReferences,
    WithScripts,
}
