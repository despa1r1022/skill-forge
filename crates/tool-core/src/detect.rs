use crate::profile::ToolProfile;
use crate::registry;
use std::path::Path;

/// Result of detecting a tool on the local system
#[derive(Debug, Clone, serde::Serialize)]
pub struct ToolDetection {
    pub tool: ToolProfile,
    pub installed: bool,
    /// Paths that actually exist on disk
    pub found_dirs: Vec<String>,
    pub found_rules: Vec<String>,
}

/// Detect all tools and report their installation status
pub fn detect_all() -> Vec<ToolDetection> {
    let home = std::env::var("HOME")
        .or_else(|_| std::env::var("USERPROFILE"))
        .unwrap_or_default();

    registry::all_tools()
        .into_iter()
        .map(|tool| {
            let find_dirs = tool.skills_dirs.iter()
                .map(|d| resolve_path(d, &home))
                .filter(|p| Path::new(p).exists())
                .collect::<Vec<_>>();

            let find_rules = tool.rules_dirs.iter()
                .map(|d| resolve_path(d, &home))
                .filter(|p| Path::new(p).exists())
                .collect::<Vec<_>>();

            let installed = !find_dirs.is_empty() || !find_rules.is_empty()
                || tool.context_files.iter().any(|f| {
                    Path::new(&resolve_path(f, &home)).exists()
                });

            ToolDetection {
                tool,
                installed,
                found_dirs: find_dirs,
                found_rules: find_rules,
            }
        })
        .collect()
}

fn resolve_path(path: &str, home: &str) -> String {
    if let Some(rest) = path.strip_prefix("~/") {
        format!("{}/{}", home, rest)
    } else {
        path.to_string()
    }
}
