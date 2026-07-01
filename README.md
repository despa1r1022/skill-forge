# SkillForge

**跨工具 AI Skills / Rules / 上下文管理器**

SkillForge 是一款桌面应用，可在 **14 个主流 AI 编码工具** 之间统一管理、编辑、转换和同步你的 Skills、Rules 和上下文文件。

---

## 支持的工具

| 工具 | Skills | Rules | 上下文文件 |
|------|:---:|:---:|:---:|
| **CodeBuddy** | ✅ | — | — |
| **Claude Code** | ✅ | ✅ | `CLAUDE.md` |
| **Trae** | ✅ | ✅ | `CLAUDE.md` |
| **Cursor** | ✅ | ✅ | — |
| **Codex (OpenAI)** | ✅ | — | `AGENTS.md` |
| **Gemini CLI** | — | — | `GEMINI.md` |
| **GitHub Copilot** | — | — | `copilot-instructions.md` |
| **Aider** | — | — | `CONVENTIONS.md` |
| **Windsurf** | — | ✅ | `.windsurfrules` |
| **Cline** | — | ✅ | `.clinerules` |
| **Continue** | — | ✅ | — |
| **Amazon Q** | — | ✅ | — |
| **Augment Code** | — | ✅ | — |
| **Codeium** | — | ✅ | — |

### 核心功能

- **集中管理** — 在一个界面查看所有工具的 Skills/Rules
- **格式互通** — CodeBuddy / Claude Code / Trae / Cursor 四者 `SKILL.md` 可直接复制使用
- **跨工具转换** — 一键将 SKILL.md 转换为 Plain MD、Rules File 或 Context File 格式
- **本地优先** — 所有数据存储在本地文件系统，不上传云端
- **导入导出** — 支持 ZIP 打包导出和导入，方便分享迁移

---

## 技术栈

| 层级 | 技术 |
|------|------|
| 桌面框架 | **Tauri v2** (Rust + 系统 WebView) |
| 前端 | **React 18 + TypeScript + Vite** |
| 后端 | **Rust** (Cargo workspace) |
| 样式 | **Tailwind CSS** |
| 编辑 | **CodeMirror 6** |
| 打包 | `.dmg` (macOS) / `.msi` (Windows) / `.deb` `.AppImage` (Linux) |

---

## 下载安装

### 方式一：下载预构建版本（推荐）

前往 [Releases](https://github.com/despa1r1022/skill-forge/releases) 页面，下载最新版本对应平台的安装包：

| 操作系统 | 安装包 | 安装方式 |
|----------|--------|----------|
| **macOS** | `SkillForge_*_x64.dmg` | 双击 `.dmg` → 拖拽到 Applications → 如提示无法验证，到「系统设置 → 隐私与安全性」允许 |
| **Windows** | `SkillForge_*_x64.msi` | 双击 `.msi` 安装，推荐选择 |
| **Windows** | `SkillForge_*_x64-setup.exe` | 备选 `.exe` 安装包 |
| **Linux (Debian/Ubuntu)** | `SkillForge_*_amd64.deb` | `sudo dpkg -i SkillForge_*.deb` |
| **Linux (通用)** | `SkillForge_*_amd64.AppImage` | `chmod +x SkillForge_*.AppImage && ./SkillForge_*.AppImage` |

### 发布流程（给维护者）

每次发布新版本只需两步：

```bash
# 1. 更新版本号（package.json 和 src-tauri/tauri.conf.json）
# 2. 打 tag 并推送
git tag v0.1.0
git push origin v0.1.0
```

GitHub Actions 会自动构建 macOS / Windows / Linux 三平台安装包，并创建 Release 草稿。到 [Releases](https://github.com/despa1r1022/skill-forge/releases) 页面确认发布即可。

### 方式二：从源码构建

```bash
# 1. 克隆仓库
git clone https://github.com/despa1r1022/skill-forge.git
cd skill-forge

# 2. 构建发布版本
npm run tauri build
```

构建产物在 `src-tauri/target/release/bundle/` 目录下。

---

## 本地开发调试

### 前置要求

| 工具 | 最低版本 | 说明 |
|------|----------|------|
| **Node.js** | 18+ | 前端运行时 |
| **npm** | 9+ | 包管理器 |
| **Rust** | 1.70+ | Tauri 后端语言 |
| **系统依赖** | — | 见下方各平台说明 |

### macOS 额外依赖

```bash
# 安装 Xcode Command Line Tools（如未安装）
xcode-select --install
```

### Linux 额外依赖

```bash
# Debian / Ubuntu
sudo apt update
sudo apt install -y libwebkit2gtk-4.1-dev libappindicator3-dev \
  librsvg2-dev patchelf libssl-dev

# Fedora / RHEL
sudo dnf install -y webkit2gtk4.1-devel libappindicator-gtk3-devel \
  librsvg2-devel patchelf openssl-devel
```

### Windows 额外依赖

1. 安装 [Microsoft Visual Studio C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)（勾选"使用 C++ 的桌面开发"）
2. 安装 [WebView2](https://developer.microsoft.com/microsoft-edge/webview2/)（Windows 11 默认已装）

---

### 开发启动

#### 1. 安装 Rust（如未安装）

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
# 重启终端或执行
source ~/.cargo/env
```

#### 2. 克隆项目并安装依赖

```bash
git clone https://github.com/despa1r1022/skill-forge.git
cd skill-forge

# 安装前端依赖
npm install
```

#### 3. 启动开发模式

```bash
# 同时启动前端 Vite 开发服务器 + Tauri 窗口
npm run tauri dev
```

启动后：
- 前端热更新在 `http://localhost:1420`
- Tauri 窗口会自动打开桌面应用
- 修改 React 代码会自动热重载
- 修改 Rust 代码需要重新编译（Tauri 会自动处理）

#### 4. 仅启动前端（不启动桌面窗口）

```bash
npm run dev
```

浏览器打开 `http://localhost:1420` 查看 UI（但 Tauri API 不可用）。

#### 5. 编译检查

```bash
# Rust 编译检查（不生成二进制）
cargo check

# TypeScript 类型检查
npx tsc --noEmit

# 完整构建检查
npm run build
```

---

### 项目结构

```
skill-forge/
├── src/                    # React 前端
│   ├── components/
│   │   ├── layout/         # Layout, Sidebar, ToolSelector
│   │   ├── skill/          # SkillList, SkillDetail, SkillEditor, CreateWizard
│   │   └── shared/         # MarkdownPreview, ConfirmDialog, SearchInput
│   ├── hooks/              # useTools, useSkills, useSkillDetail, useFileTree
│   ├── types/              # TypeScript 类型定义
│   ├── lib/                # Tauri API 封装层
│   └── i18n/               # 国际化（zh-CN / en-US）
│
├── src-tauri/              # Tauri 后端（Rust）
│   ├── src/
│   │   ├── commands/       # 10 个 Tauri Command（前后端 API）
│   │   │   ├── tools.rs    # list_tools, detect_tools
│   │   │   ├── list.rs     # list_skills, get_file_tree
│   │   │   ├── detail.rs   # get_skill
│   │   │   ├── create.rs   # create_skill
│   │   │   ├── edit.rs     # save_skill
│   │   │   ├── delete.rs   # delete_skill
│   │   │   ├── toggle.rs   # toggle_skill
│   │   │   ├── copy.rs     # copy_skill (跨工具)
│   │   │   └── export_import.rs  # export / import
│   │   └── lib.rs
│   ├── capabilities/       # Tauri v2 权限声明
│   └── tauri.conf.json     # Tauri 应用配置
│
├── crates/                 # Rust 工作区（4 个核心模块）
│   ├── tool-core/          # 14 工具配置文件
│   │   └── src/
│   │       ├── profile.rs  # ToolProfile 数据结构
│   │       ├── registry.rs # 14 工具预设配置
│   │       └── detect.rs   # 工具检测逻辑
│   ├── skill-core/         # 核心模型 + 解析
│   │   └── src/
│   │       ├── model.rs    # SkillEntry, SkillMeta
│   │       ├── parser.rs   # YAML frontmatter 解析
│   │       ├── convert.rs  # 格式转换引擎
│   │       └── validate.rs # 校验逻辑
│   ├── skill-fs/           # 文件系统操作
│   │   └── src/
│   │       ├── scanner.rs  # 多工具目录扫描
│   │       ├── reader.rs   # 文件读取
│   │       ├── writer.rs   # 原子写入
│   │       ├── git.rs      # Git clone
│   │       └── tree.rs     # 目录树结构
│   └── skill-pack/         # ZIP 打包
│       └── src/
│           ├── export.rs   # 导出打包
│           └── import.rs   # 导入解包
│
├── .github/workflows/      # GitHub Actions CI/CD
└── Cargo.toml              # Rust workspace 配置
```

---

### 调试技巧

#### Rust 端调试

```bash
# 查看编译警告
cargo clippy

# 查看编译详情
cargo build -vv

# 运行测试
cargo test
```

#### 前端调试

- Tauri 开发模式下打开窗口后，按 `Cmd+Option+I` (macOS) 或 `Ctrl+Shift+I` (Windows/Linux) 打开 WebView DevTools
- 可在 Console / Network / Elements 面板调试前端代码

#### 读取真实技能数据

开发模式下，应用会自动读取 `~/.codebuddy/skills/` 等目录中的真实技能文件。因此你可以直接看到自己已有的技能。

---

### 常用命令速查

| 命令 | 说明 |
|------|------|
| `npm install` | 安装前端依赖 |
| `npm run dev` | 启动前端开发服务器 |
| `npm run tauri dev` | 启动 Tauri 桌面开发模式 |
| `npm run build` | 构建前端 |
| `npm run tauri build` | 构建完整桌面应用 |
| `cargo check` | Rust 编译检查 |
| `cargo clippy` | Rust 代码检查 |
| `cargo test` | 运行 Rust 测试 |
| `npx tsc --noEmit` | TypeScript 类型检查 |

---

## License

MIT
