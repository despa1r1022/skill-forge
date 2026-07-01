use crate::model::SkillMeta;
use serde::Deserialize;

/// Parsed YAML frontmatter structure
#[derive(Debug, Deserialize, Default)]
struct Frontmatter {
    name: Option<String>,
    version: Option<String>,
    description: Option<String>,
    metadata: Option<RawMetadata>,
}

#[derive(Debug, Deserialize, Default)]
struct RawMetadata {
    requires: Option<RequiresBlock>,
    #[serde(rename = "openclaw")]
    openclaw: Option<OpenclawBlock>,
}

#[derive(Debug, Deserialize, Default)]
struct RequiresBlock {
    bins: Option<Vec<String>>,
    env: Option<Vec<String>>,
    siblings: Option<Vec<String>>,
}

#[derive(Debug, Deserialize, Default)]
struct OpenclawBlock {
    source: Option<String>,
    requires: Option<OpenclawRequires>,
}

#[derive(Debug, Deserialize, Default)]
struct OpenclawRequires {
    bins: Option<Vec<String>>,
    env: Option<Vec<String>>,
}

/// Parse SKILL.md frontmatter and return structured data
pub fn parse_frontmatter(content: &str) -> ParsedResult {
    // Extract YAML frontmatter between --- delimiters
    let (frontmatter_yaml, body) = extract_frontmatter(content);

    if let Some(yaml) = frontmatter_yaml {
        match serde_yaml::from_str::<Frontmatter>(&yaml) {
            Ok(fm) => ParsedResult {
                name: fm.name.unwrap_or_default(),
                version: fm.version,
                description: fm.description.unwrap_or_default(),
                body: body.to_string(),
                meta: build_meta(fm.metadata),
            },
            Err(_) => default_parsed_result(content),
        }
    } else {
        default_parsed_result(content)
    }
}

fn default_parsed_result(content: &str) -> ParsedResult {
    ParsedResult {
        name: String::new(),
        version: None,
        description: content.lines().take(3).collect::<Vec<_>>().join(" "),
        body: content.to_string(),
        meta: SkillMeta::default(),
    }
}

fn extract_frontmatter(content: &str) -> (Option<String>, &str) {
    let lines: Vec<&str> = content.lines().collect();

    if lines.first().map_or(false, |l| l.trim() == "---") {
        let mut end_idx = None;
        for (i, line) in lines.iter().enumerate().skip(1) {
            if line.trim() == "---" {
                end_idx = Some(i);
                break;
            }
        }

        if let Some(idx) = end_idx {
            let yaml = lines[1..idx].join("\n");
            let body = lines[idx + 1..].join("\n");
            return (Some(yaml), Box::leak(body.into_boxed_str()));
        }
    }

    (None, content)
}

fn build_meta(metadata: Option<RawMetadata>) -> SkillMeta {
    let Some(meta) = metadata else {
        return SkillMeta::default();
    };

    let mut result = SkillMeta::default();

    if let Some(requires) = meta.requires {
        result.requires_bins = requires.bins.unwrap_or_default();
        result.requires_env = requires.env.unwrap_or_default();
        result.requires_siblings = requires.siblings.unwrap_or_default();
    }

    if let Some(openclaw) = meta.openclaw {
        result.openclaw_source = openclaw.source;
        if let Some(reqs) = openclaw.requires {
            if let Some(bins) = reqs.bins {
                result.requires_bins.extend(bins);
            }
            if let Some(envs) = reqs.env {
                result.requires_env.extend(envs);
            }
        }
    }

    result
}

#[derive(Debug, Clone)]
pub struct ParsedResult {
    pub name: String,
    pub version: Option<String>,
    pub description: String,
    pub body: String,
    pub meta: SkillMeta,
}
