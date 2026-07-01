// Tool info from backend
export interface ToolInfo {
  id: string;
  name: string;
  description: string;
  installed: boolean;
  has_skills: boolean;
  has_rules: boolean;
  skill_count: number;
}

// Skill entry from backend
export interface SkillEntry {
  name: string;
  version: string | null;
  description: string;
  path: string;
  enabled: boolean;
  tool_id: string;
  format: SkillFormat;
  file_name: string;
  subdirs: SubDir[];
  meta: SkillMeta;
  raw_content: string | null;
}

export type SkillFormat =
  | "SkillMdYaml"
  | "PlainMd"
  | "ContextFile"
  | "RulesFile"
  | "ConfigToml"
  | "ConfigJson";

export interface SkillMeta {
  requires_bins: string[];
  requires_env: string[];
  requires_siblings: string[];
  openclaw_source: string | null;
  paths: string[];
}

export interface SubDir {
  name: string;
  files: FileEntry[];
}

export interface FileEntry {
  name: string;
  path: string;
  size: number;
}

export interface CreateRequest {
  name: string;
  description: string;
  version?: string;
  template?: "Minimal" | "WithReferences" | "WithScripts";
}

export interface ToolDetection {
  tool: {
    id: string;
    name: string;
    description: string;
  };
  installed: boolean;
  found_dirs: string[];
  found_rules: string[];
}
