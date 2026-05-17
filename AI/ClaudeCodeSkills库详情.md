---
tags:
  - claude-code
  - skills-index
  - auto-maintained
created: 2026-05-17
description: 全局和个人 Skill 库的完整清单，有变更时自动更新
---

# Claude Code Skills 库详情

> [!info] 维护说明
> 此文档由 Claude Code 自动维护。每次全局或个人 Skill 库有变更时同步更新，更新后我会知会你一声。

---

## 全局 Skill

安装位置：[`C:\Users\Liuzwei\.claude\skills\`](file:///C:/Users/Liuzwei/.claude/skills/)

| Skill 名称                         | 功能说明                                                    |
| -------------------------------- | ------------------------------------------------------- |
| `article-illustration-generator` | Generates illustrations for articles                    |
| `docx`                           | Word 文档创建、编辑、分析（含修订和批注）                                 |
| `find-skills`                    | 发现和安装新 Skill                                            |
| `frontend-design`                | 前端界面设计与开发                                               |
| `imagen`                         | Google Gemini 图片生成（基于 gemini-3-pro-image-preview）       |
| `karpathy-guidelines`            | 减少常见 LLM 编码错误的编程规范                                      |
| `knowledge-2-web`                | 知识文章转交互式网页，自动配图                                         |
| `manimgl-best-practices`         | ManimGL（3B1B 版）动画开发规范（非 Community 版）                    |
| `notebooklm`                     | 查询 Google NotebookLM 笔记本，基于浏览器自动化的源引回答                  |
| `Obsidian-skill`                 | Obsidian 相关 Skill 合集（7 个子 skill）                        |
| `paper-2-web`                    | 学术论文转网页/视频/海报                                           |
| `pdf`                            | PDF 文档处理（提取文本、创建 PDF、合并文档）（→ `.agents/skills/pdf` 符号链接） |
| `planning-with-files`            | 基于文件的复杂任务规划（Manus 风格，含 session recovery）                |
| `pptx`                           | PPT 演示文稿创建与编辑                                           |
| `remotion`                       | React 程序化视频制作（最佳实践与综合指南）                                |
| `skill-creator`                  | 创建、修改和优化 Skill（含评测、对比、基准测试）                             |
| `skill-sync-repo`                | 同步 Skill 到个人库                                           |
| `xlsx`                           | 电子表格创建、编辑、数据分析（含公式、格式化、可视化）                             |

> [!note] Obsidian-skill 子 skill
> `json-canvas` `obsidian-bases` `obsidian-cli` `obsidian-markdown` `Obsidian-PhotoToCode` `obsidian-titiled` `openclaw-openclaw-obsidian`
> 功能说明见下方个人库对应分类。

### 插件安装的 Skill

安装位置：[`C:\Users\Liuzwei\.claude\plugins\cache\`](file:///C:/Users/Liuzwei/.claude/plugins/cache/)

| Skill 名称 | 来源 | 版本 | 功能说明 |
|-----------|------|------|---------|
| `andrej-karpathy-skills` | [forrestchang/andrej-karpathy-skills](https://github.com/forrestchang/andrej-karpathy-skills) | 1.0.0 | Karpathy 编程行为规范：Think Before Coding、Simplicity First、Surgical Changes 等 guideline 合集，含 CLAUDE.md 指南与 `karpathy-guidelines` skill |

---

## 个人 Skill 库

安装位置：[`D:\桌面\ClaudeCode\LIU-Skill-repository\`](file:///D:/桌面/ClaudeCode/LIU-Skill-repository/)

### 文档处理

| Skill 名称 | 功能说明 | 安装状态 |
|-----------|---------|---------|
| `docx` | Word 文档创建与编辑 | 已装全局 |
| `knowledge-2-web` | 知识文章转交互式网页 | 已装全局 |
| `paper-2-web` | 学术论文转网页/视频/海报 | 已装全局 |
| `pdf` | PDF 文档处理 | 已装全局 |
| `pptx` | PPT 演示文稿 | 已装全局 |
| `xlsx` | 电子表格创建、编辑、数据分析 | 已装全局 |

### 代码与开发

| Skill 名称                   | 功能说明                                       | 安装状态  |
| -------------------------- | ------------------------------------------ | ----- |
| `accept-edits-permissions` | 每个项目启动时自动配置权限，写入 settings.local.json       | 个人库独有 |
| `andrej-karpathy-skills`   | Karpathy 编程规范合集（内含 karpathy-guidelines 副本） | 已装全局(插件) |
| `find-skills`              | 发现和安装新 Skill                               | 已装全局  |
| `karpathy-guidelines`      | 减少常见 LLM 编码错误的编程规范                         | 已装全局  |
| `planning-with-files`      | 基于文件的复杂任务规划                                | 已装全局  |
| `skill-creator`            | 创建、修改和优化 Skill                             | 已装全局  |
| `skill-sync-repo`          | 同步 Skill 到个人库                              | 已装全局  |

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

| Skill 名称 | 功能说明 | 安装状态 |
|-----------|---------|---------|
| `article-illustration-generator` | 文章插图生成 | 已装全局 |
| `drawio-skill` | 通过 draw.io 创建流程图、架构图、可视化图表 | 个人库独有 |
| `frontend-design` | 前端界面设计与开发 | 已装全局 |
| `imagen` | Google Gemini 图片生成 | 已装全局 |
| `manimgl-best-practices` | ManimGL（3B1B 版）动画开发规范 | 已装全局 |
| `remotion` | React 程序化视频制作 | 已装全局 |

### 信息搜取

| Skill 名称 | 功能说明 | 安装状态 |
|-----------|---------|---------|
| `defuddle` | 从网页提取干净 Markdown 内容，去 clutter 省 token | 个人库独有 |
| `notebooklm` | 查询 Google NotebookLM 笔记本 | 已装全局 |
| `vercel-labs-agent-browser-agent-browser` | 浏览器自动化 CLI 工具 | 个人库独有 |

### CLI工具

> [!warning] 空目录
> 暂无 Skill。

### MCP

> [!warning] 空目录
> 暂无 Skill。

### scripts

> [!warning] 空目录
> 暂无 Skill。

---

> [!tip] 功能说明来源
> 各 Skill 目录下的 `SKILL.md` 文件的 `description` 字段。英文描述未翻译，保留原文。
