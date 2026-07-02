import { invoke } from "@tauri-apps/api/core";
import type { ToolInfo, SkillEntry, SubDir, CreateRequest, ToolDetection } from "../types";

export const api = {
  // Tools
  listTools: (): Promise<ToolInfo[]> => invoke("list_tools"),
  detectTools: (): Promise<ToolDetection[]> => invoke("detect_tools"),

  // Skills
  listSkills: (toolId: string): Promise<SkillEntry[]> =>
    invoke("list_skills", { toolId }),

  getSkill: (toolId: string, name: string): Promise<SkillEntry> =>
    invoke("get_skill", { toolId, name }),

  getFileTree: (dir: string): Promise<SubDir[]> =>
    invoke("get_file_tree", { dir }),

  createSkill: (toolId: string, req: CreateRequest): Promise<SkillEntry> =>
    invoke("create_skill", { toolId, req }),

  saveSkill: (toolId: string, name: string, content: string): Promise<void> =>
    invoke("save_skill", { toolId, name, content }),

  deleteSkill: (path: string): Promise<void> =>
    invoke("delete_skill", { path }),

  toggleSkill: (path: string): Promise<boolean> =>
    invoke("toggle_skill", { path }),

  copySkill: (fromTool: string, toTool: string, name: string): Promise<SkillEntry> =>
    invoke("copy_skill", { fromTool, toTool, name }),

  exportSkill: (skillPath: string): Promise<string> =>
    invoke("export_skill", { skillPath }),

  importSkill: (toolId: string, zipPath: string): Promise<void> =>
    invoke("import_skill", { toolId, zipPath }),

  // File operations
  createFile: (skillPath: string, subdir: string, filename: string): Promise<void> =>
    invoke("create_file", { skillPath, subdir, filename }),

  createDirectory: (skillPath: string, dirname: string): Promise<void> =>
    invoke("create_directory", { skillPath, dirname }),

  saveFileContent: (path: string, content: string): Promise<void> =>
    invoke("save_file_content", { path, content }),

  deleteFile: (path: string): Promise<void> =>
    invoke("delete_file", { path }),

  readFileContent: (path: string): Promise<string> =>
    invoke("read_file_content", { path }),

  importLocalSkill: (toolId: string, sourcePath: string): Promise<string> =>
    invoke("import_local_skill", { toolId, sourcePath }),
};
