# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 仓库概况

这是一个 Obsidian 笔记仓库（Vault），内容以中文为主，聚焦两个方向：

- **嵌入式系统学习**：STM32、C/C++、硬件设计、PCB、外设驱动
- **毕业论文**：基于 STM32 的自动车窗系统软硬件设计（防夹、语音、蓝牙、雨感）

## 目录结构

| 目录 | 用途 |
|------|------|
| `AI/` | Claude Code 使用指南、API Key 配置 |
| `嵌入式/` | 嵌入式学习笔记（STM32外设、模块资料、硬件） |
| `嵌入式/C&C++/` | C/C++ 语法、数据结构与算法笔记 |
| `自动车窗系统软硬件设计/` | 毕业论文核心区（文献总览、流程记录） |
| `收件箱/` | 临时/待整理笔记 |
| `图片/` | 笔记附件图片（gitignore 排除） |
| `.claude/` | 项目级 Claude Code 配置和 Skills |

## 关键约定

### 笔记整理

整理 `.md` 笔记时遵循：
- 大纲缩进转为 `##`/`###` 标题层级
- 图片统一加宽度：`![描述|宽度](url)`，原理图 400-500px，细节图 300px
- 能用 Markdown 表格表达的信息优先用表格，替代信息类图片
- 合并重复描述，删除冗余内容
- Mubu 导出残留的 LaTeX+纯文本公式拼贴修复为干净 LaTeX
- 同类内容使用一致的章节模板（如各容器按"创建 → 核心操作 → 遍历"组织）
- 分散的编号列表碎片转为结构化格式（表格、代码块）
- 整理时顺手修正原文笔误（术语、拼写）
- 缺失的对照信息适当补充（如有序/无序容器对比表）
- Obsidian Callout 用于注意事项（`> [!warning]`）和补充说明（`> [!NOTE]`）
- 标题编号使用 `obsidian-titiled` skill 规范：
  - H2：一、二、三...（中文数字）
  - H3：X.Y（X 为 H2 序号，Y 为 H3 自身序号，如 2.1）
  - H4：X.Y.Z（如 2.1.1）

### 图片处理

`图片/` 目录被 gitignore 排除，不进入版本控制。笔记中的图片引用使用 wikilink 格式：`![[图片/xxx.png|宽度]]`

### Git 使用

- `.obsidian/` 和 `图片/` 不在版本控制中
- 整理完笔记后随手 commit
- 推送前确认远程仓库已关联

## 论文项目

`自动车窗系统软硬件设计/` 下的核心文件：
- **文献总览.md**：参考文献列表 + 论文写作提示（格式规范、学术规范），每次写论文相关内容时先参考
- **流程记录.md**：硬件参数、状态转移图、各功能模块的详细逻辑定义

论文涉及的硬件平台：STM32F103C8T6、INA219、TB6612、HC-05 蓝牙、ASR-PRO 语音模块、DHT11 温湿度传感器

## Skill 管理

`AI/ClaudeCodeSkills库详情.md` 是全局和个人 Skill 库的完整清单，有变更时自动更新。

## Obsidian 语法

笔记使用 Obsidian Flavored Markdown：
- Wikilink 内部链接：`[[笔记名]]`、`[[笔记名#标题]]`
- 图片嵌入：`![[图片名.png|宽度]]`
- Callout 块：`> [!NOTE]`、`> [!tip]`、`> [!warning]` 等
- 前端属性：`---` 包裹的 YAML frontmatter
