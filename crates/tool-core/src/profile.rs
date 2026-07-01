/// Tool profile defining a supported AI coding tool's skill/rules storage layout
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ToolProfile {
    pub id: String,
    pub name: String,
    pub description: String,
    /// Paths where SKILL.md files are stored (supports ~ expansion)
    pub skills_dirs: Vec<String>,
    /// Paths where rules files are stored
    pub rules_dirs: Vec<String>,
    /// Context file names at project root (e.g. "AGENTS.md", "CLAUDE.md")
    pub context_files: Vec<String>,
    /// Format of skill files
    pub skill_format: SkillFormat,
    /// Whether the tool supports rules
    pub has_rules: bool,
    /// Whether the tool supports skills
    pub has_skills: bool,
    /// File extension for rules
    pub rules_extension: String,
    /// Primary content filename within a skill directory
    pub skill_filename: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum SkillFormat {
    /// SKILL.md with YAML frontmatter (CodeBuddy, Claude Code, Trae, Cursor)
    SkillMdYaml,
    /// Plain markdown with sections (Codex skills)
    PlainMd,
    /// Single context file (AGENTS.md, GEMINI.md, CLAUDE.md)
    ContextFile,
    /// Rules file (.mdc, .windsurfrules, .clinerules)
    RulesFile,
    /// TOML config based
    ConfigToml,
    /// JSON config based
    ConfigJson,
}
