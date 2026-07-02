# SkillForge

**AI Skills 桌面管理工具**

跨工具统一管理、编辑、创建 AI 编码工具的 Skills、Rules 和上下文文件。

<p align="center">
  <img src="https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey" alt="Platforms">
  <img src="https://img.shields.io/badge/license-MIT-blue" alt="License">
</p>

---

## 支持的工具（14 个）

| 工具 | Skills | Rules | 上下文文件 |
|------|:---:|:---:|:---:|
| **CodeBuddy** | ✅ | — | — |
| **Claude Code** | ✅ | ✅ | `CLAUDE.md` |
| **Trae** | ✅ | ✅ | `CLAUDE.md` |
| **Cursor** | ✅ | ✅ | — |
| **Codex (OpenAI)** | ✅ | — | `AGENTS.md` / `CLAUDE.md` |
| **Gemini CLI** | — | — | `GEMINI.md` |
| **GitHub Copilot** | — | — | `copilot-instructions.md` |
| **Aider** | — | — | `CONVENTIONS.md` |
| **Windsurf** | — | ✅ | `.windsurfrules` |
| **Cline** | — | ✅ | `.clinerules` |
| **Continue** | — | ✅ | — |
| **Amazon Q** | — | ✅ | — |
| **Augment Code** | — | ✅ | — |
| **Codeium** | — | ✅ | — |

---

## 功能

- **集中管理** — 在同一界面查看、启用/禁用所有工具的 Skills 和 Rules
- **格式互通** — CodeBuddy / Claude Code / Trae / Cursor 的 `SKILL.md` 格式兼容，可直接复用
- **新建技能** — 支持自定义目录结构，自由添加子目录和文件
- **Markdown 编辑** — 内置编辑/预览切换，CodeMirror 6 多语言语法高亮
- **目录文件管理** — 在编辑页面直接创建/修改/删除 skill 目录下的文件
- **导入文件夹** — 导入本地 skill 文件夹，自动校验格式合规性
- **导出 ZIP** — 将技能打包为 ZIP 文件，方便分享和迁移
- **本地优先** — 所有数据存储在本地文件系统，不上传云端

---

## 技术栈

| 层级 | 技术 |
|------|------|
| 桌面框架 | **Tauri v2** (Rust + WebView) |
| 前端 | **React 18 + TypeScript + Vite** |
| 样式 | **Tailwind CSS** |
| 代码编辑 | **CodeMirror 6** |
| 图片处理 | **Pillow** |
| 打包 | `.dmg` / `.msi` / `.deb` / `.AppImage` |

---

## 下载安装

### 方式一：预构建版本

前往 [Releases](https://github.com/despa1r1022/skill-forge/releases) 页面，下载对应平台安装包：

| 操作系统 | 安装包 | 安装方式 |
|----------|--------|----------|
| **macOS** | `SkillForge_*_aarch64.dmg` | 双击挂载 → 拖拽到 Applications |
| **Windows** | `SkillForge_*_x64.msi` | 双击安装 |
| **Linux** | `SkillForge_*_amd64.deb` | `sudo dpkg -i SkillForge_*.deb` |
| **Linux** | `SkillForge_*_amd64.AppImage` | `chmod +x *.AppImage && ./*.AppImage` |

> macOS 如提示「已损坏」，执行 `sudo xattr -rd com.apple.quarantine /Applications/SkillForge.app` 后重开即可。

### 方式二：从源码构建

```bash
git clone https://github.com/despa1r1022/skill-forge.git
cd skill-forge
npm install
npm run tauri build
```

构建产物在 `src-tauri/target/release/bundle/` 目录下。

---

## 本地开发

### 前置要求

- **Node.js** 18+
- **Rust** 1.70+
- **macOS**: Xcode Command Line Tools
- **Linux**: `libwebkit2gtk-4.1-dev` `libssl-dev` `librsvg2-dev` `patchelf`
- **Windows**: Visual Studio C++ Build Tools + WebView2

### 启动

```bash
npm install
npm run tauri dev
```

- 前端热更新：`http://localhost:1420`
- 修改 Rust 代码自动重新编译
- 按 `Cmd+Option+I` (macOS) 或 `Ctrl+Shift+I` (Windows) 打开 WebView DevTools

### 编译检查

```bash
cargo check              # Rust
npx tsc --noEmit         # TypeScript  
npm run build            # 类型检查 + Vite 构建
```

---

## 项目结构

```
skill-forge/
├── src/                       # React 前端
│   ├── components/
│   │   ├── layout/            # Layout (侧边栏 + 内容区)
│   │   ├── skill/             # SkillList, SkillDetail, SkillEditor, CreateWizard, FileTree
│   │   └── shared/            # CodeEditor, FileEditorModal, MarkdownPreview, ConfirmDialog
│   ├── hooks/                 # useToolsContext, useSkillsContext, useSkillDetail
│   ├── types/                 # TS 类型
│   ├── lib/                   # Tauri API 封装
│   └── i18n/                  # 中文 / 英文
│
├── src-tauri/                 # Tauri 后端 (Rust)
│   ├── src/commands/          # 所有 Tauri Command
│   │   ├── files.rs           # 文件操作 (create/delete/edit)
│   │   ├── create.rs          # 创建技能
│   │   ├── delete.rs          # 删除技能
│   │   ├── toggle.rs          # 启用/禁用
│   │   ├── export_import.rs   # ZIP 导入导出
│   │   └── copy.rs            # 跨工具复制
│   ├── icons/                 # 应用图标
│   └── tauri.conf.json
│
├── crates/                    # Rust workspace
│   ├── tool-core/             # 14 工具配置 + 检测
│   ├── skill-core/            # 核心模型 + YAML 解析 + 格式转换
│   ├── skill-fs/              # 文件系统扫描 / 读写 / 原子写入
│   └── skill-pack/            # ZIP 打包 / 解包
│
└── .github/workflows/         # CI (build.yml + release.yml)
```

---

## 发布流程

```bash
# 打 tag 即自动触发 GitHub Actions 构建三平台包
git tag v0.1.0
git push origin v0.1.0
```

---

## License

MIT
