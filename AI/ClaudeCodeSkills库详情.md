---
tags:
  - claude-code
  - extensions-index
  - auto-maintained
created: 2026-05-17
description: 全局和个人库的 Skill、MCP、CLI 工具、Pluging 插件完整清单，有变更时自动更新
---

# Claude Code 扩展库详情

> [!info] 维护说明
> 此文档由 Claude Code 自动维护。每次全局或个人库的 Skill / MCP / CLI / Pluging 有变更时同步更新，更新后我会知会你一声。

---

## 全局 Skill

安装位置：[`C:\Users\Liuzwei\.claude\skills\`](file:///C:/Users/Liuzwei/.claude/skills/)

| Skill 名称          | 功能说明                                                    |
| ----------------- | ------------------------------------------------------- |
| `学习秘书团` | 总秘书大人统筹出题、批改、复盘全流程（问题官 + 知识官 + 复盘官） |
| `code-review-cpp` | 按项目代码规范审查 C/C++ 代码（变量/函数/类命名、注释、宏定义、工程结构）               |
| `docx`            | Word 文档创建、编辑、分析（含修订和批注）                                 |
| `find-skills`     | 发现和安装新 Skill                                            |
| `Obsidian-skill`  | Obsidian 相关 Skill 合集（7 个子 skill）                        |
| `pdf`             | PDF 文档处理（提取文本、创建 PDF、合并文档）（→ `.agents/skills/pdf` 符号链接） |
| `pptx`            | PPT 演示文稿创建与编辑                                           |
| `anthropics-skills-pptx` | Anthropic 官方 PPTX skill（LobeHub 安装），含 unpack/pack/validate/thumbnail 工具链 + pptxgenjs 参考 |
| `skill-creator`   | 创建、修改和优化 Skill（含评测、对比、基准测试）                             |
| `skill-sync-repo` | 同步 Skill 到个人库                                           |
| `vision`          | 火山引擎豆包视觉模型识图，vision.js 调用豆包 API，模型无原生识图能力时使用            |
| `xlsx`            | 电子表格创建、编辑、数据分析（含公式、格式化、可视化）                             |

> [!note] Obsidian-skill 子 skill
> `json-canvas` `obsidian-bases` `obsidian-cli` `obsidian-markdown` `Obsidian-PhotoToCode` `obsidian-titiled` `openclaw-openclaw-obsidian`
> 功能说明见下方个人库对应分类。

## 全局 Pluging 插件

安装位置：[`C:\Users\Liuzwei\.claude\plugins\cache\`](file:///C:/Users/Liuzwei/.claude/plugins/cache/)

| 插件名称 | 来源 | 版本 | 功能说明 |
|---------|------|------|---------|
| `andrej-karpathy-skills` | [forrestchang/andrej-karpathy-skills](https://github.com/forrestchang/andrej-karpathy-skills) | 1.0.0 | Karpathy 编程行为规范：Think Before Coding、Simplicity First、Surgical Changes 等 guideline 合集，含 `karpathy-guidelines` skill |
| `claude-hud` | [jarrodwatts/claude-hud](https://github.com/jarrodwatts/claude-hud) | 0.1.0 | 实时状态栏 HUD，显示上下文使用率、工具活动、Agent 追踪、Todo 进度、Git 状态，支持中文 |
| `claude-md-management` | [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official) | 1.0.0 | CLAUDE.md 维护工具：`claude-md-improver` skill 审计质量 + `/revise-claude-md` 命令捕获会话学习 |
| `clangd-lsp` | [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official) | — | C/C++ 语言服务器（clangd），提供诊断、补全、跳转定义、格式化，需系统安装 LLVM |

## 全局 CLI 工具

安装位置：npm global（`%APPDATA%\npm\`） + pip global

| 工具名称           | 包名                   | 版本     | 功能说明                                                                         |
| -------------- | -------------------- | ------ | ---------------------------------------------------------------------------- |
| `opencli`      | `@jackwener/opencli` | 1.7.16 | 将网站/浏览器/Electron 应用转化为确定性 CLI 接口，支持 100+ 网站适配器、浏览器自动化基元、CDP 驱动桌面应用           |
| `cloakbrowser` | `cloakbrowser` (pip) | 0.3.30 | 定制 headless Chromium，用于绕过学术站点（arXiv/IEEE/Google Scholar）反爬检测，首次运行自动下载 ~200MB |


## 全局 MCP

安装位置：`C:\Users\Liuzwei\.claude\.mcp.json`

> [!warning] 暂无安装
> 未安装任何全局 MCP 服务。


---

## 个人 Skill 库

安装位置：[`D:\桌面\ClaudeCode\LIU-Skill-repository\`](file:///D:/桌面/ClaudeCode/LIU-Skill-repository/)

 ### 文档处理

| Skill 名称 | 功能说明 | 安装状态 |
|-----------|---------|---------|
| `docx` | Word 文档创建与编辑 | 已装全局 |
| `pdf` | PDF 文档处理 | 已装全局 |
| `pptx` | PPT 演示文稿 | 已装全局 |
| `anthropics-skills-pptx` | Anthropic 官方 PPTX skill，含 OOXML 工具链 + pptxgenjs + 设计规范 | 已装全局 |
| `xlsx` | 电子表格创建、编辑、数据分析 | 已装全局 |

### 代码与开发

| Skill 名称                   | 功能说明                                       | 安装状态  |
| -------------------------- | ------------------------------------------ | ----- |
| `accept-edits-permissions` | 每个项目启动时自动配置权限，写入 settings.local.json       | 个人库独有 |
| `find-skills`              | 发现和安装新 Skill                               | 已装全局  |
| `skill-creator`            | 创建、修改和优化 Skill                             | 已装全局  |
| `skill-sync-repo`          | 同步 Skill 到个人库                              | 已装全局  |
| `学习秘书团` | 总秘书大人统筹出题、批改、复盘全流程 | 项目级 |
| `code-review-cpp`          | 按项目代码规范审查 C/C++ 代码（变量/函数/类命名、注释、宏定义、工程结构） | 已装全局     |
| `claude-hud`               | 实时状态栏 HUD 插件，显示上下文/工具/Agent/Todo/Git（支持中文） | 已装全局(插件) |
| `huashu-nuwa`              | 女娲造人：输入人名/主题/模糊需求 → 深度调研 → 思维框架提炼 → 生成可运行的人物 Skill | 个人库 + 项目级 |
| `scott-meyers-perspective` | Scott Meyers C++ 工程思维框架：接口设计、RAII、const 正确性、最佳实践等 5 个心智模型 + 8 条决策启发式 | 个人库 + 项目级 |
| `bjarne-stroustrup-perspective` | Bjarne Stroustrup C++ 设计哲学：零开销抽象、演进主义、多范式、类型与资源安全等 6 个心智模型 + 10 条启发式。与 Scott 互补——Stroustrup 讲"为什么这样设计"，Meyers 讲"怎么用对" | 个人库 + 项目级 |

### Obsidian-skill

| Skill 名称 | 功能说明 | 安装状态 |
|-----------|---------|---------|
| `json-canvas` | 创建和编辑 JSON Canvas 文件（节点、边、分组） | 已装全局 |
| `obsidian-bases` | 创建和编辑 Obsidian Bases 数据库视图 | 已装全局 |
| `obsidian-cli` | 通过 CLI 与 Obsidian 仓库交互（读写搜索笔记、管理插件） | 已装全局 |
| `obsidian-markdown` | 创建和编辑 Obsidian 风味 Markdown（wikilink、callout、frontmatter） | 已装全局 |
| `Obsidian-PhotoToCode` | OCR 识别笔记中代码截图并转为代码块 | 已装全局 |
| `obsidian-titiled` | 格式化并重编号 Obsidian Markdown 标题（中文编号体系） | 已装全局 |
| `openclaw-openclaw-obsidian` | 通过 obsidian-cli 操作 Obsidian 仓库 | 已装全局 |

### 图片与视觉

| Skill 名称                         | 功能说明                       | 安装状态  |
| -------------------------------- | -------------------------- | ----- |
| `drawio-skill`                   | 通过 draw.io 创建流程图、架构图、可视化图表 | 个人库独有 |
| `vision`                        | 火山引擎豆包视觉模型识图（vision.js 调用豆包 API） | 已装全局  |

### 信息搜取

| Skill 名称                                  | 功能说明                                  | 安装状态  |
| ----------------------------------------- | ------------------------------------- | ----- |
| `defuddle`                                | 从网页提取干净 Markdown 内容，去 clutter 省 token | 个人库独有 |
| `vercel-labs-agent-browser-agent-browser` | 浏览器自动化 CLI 工具                         | 个人库独有 |

### CLI工具

| 工具名称 | 功能说明 | 安装状态 |
|---------|---------|---------|
| `opencli` | 将网站/浏览器/Electron 应用转化为确定性 CLI 接口，100+ 网站适配器，浏览器自动化基元（click/type/fill/extract/screenshot） | 已装全局 |
| `paper-scraper` | 学术论文检索工具集：arXiv API 检索 + Semantic Scholar + Google Scholar + CloakBrowser 反爬浏览器。覆盖车辆工程/嵌入式/控制领域预设查询词。含 Obsidian 笔记生成 | 项目级 + 个人库 |

### MCP

> [!warning] 暂无
> 暂未安装任何 MCP 服务。

### Pluging插件

| 插件名称 | 功能说明 | 安装状态 |
|---------|---------|---------|
| `andrej-karpathy-skills` | Karpathy 编程行为规范 | 已装全局 |
| `claude-hud` | 实时状态栏 HUD | 已装全局 |
| `claude-md-management` | CLAUDE.md 维护工具（审计 + 会话学习） | 已装全局 |
| `clangd-lsp` | C/C++ 语言服务器（clangd） | 已装全局 |
| `superpowers` | [obra/superpowers](https://github.com/obra/superpowers) v5.1.0 — 完整软件开发工作流：brainstorming → planning → TDD → review，含 14 个 skill，通过 SessionStart hook 注入引导。**高 token 消耗**，适合中大型功能开发，不建议常驻 | 仅个人库 |

### scripts

> [!warning] 空目录
> 暂无内容。

---

> [!tip] 功能说明来源
> 各 Skill 目录下的 `SKILL.md` 文件的 `description` 字段。英文描述未翻译，保留原文。



# 管理规则

**1. 全局 `CLAUDE.md`** — Skill 管理规则扩展为 Skill / MCP / CLI / Pluging 四类统一管理：

| 规则   | 内容                               |
| ---- | -------------------------------- |
| 安装前  | 先问装到个人库还是全局库                     |
| 安装后  | 提醒是否需要同步到个人库和全局库                 |
| 变更追踪 | 修改时检查个人库/全局库，询问是否同步              |
| 文档维护 | 所有变更更新到 `ClaudeCodeSkills库详情.md` |

