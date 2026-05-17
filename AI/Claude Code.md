# Claude Code 使用指南

## 一、应用方式

| 方式     | 说明                             |
| :----- | :----------------------------- |
| 桌面端应用  | 独立桌面客户端，完整 UI 体验               |
| 网页端应用  | 通过浏览器访问 claude.ai/code         |
| IDE 插件 | VS Code / JetBrains 插件，内嵌在编辑器中 |
| 终端（推荐） | CLI 方式运行，更原生、功能更全              |

## 二、部署与安装

### 方式 1：终端命令行安装（需科学上网）

**Windows：**

```powershell
winget install Git.Git           # 第一步：安装 Git
irm https://claude.ai/install.ps1 | iex  # 第二步：安装 CC
claude --version                 # 第三步：验证版本
```

Windows CMD：

```cmd
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
```

**macOS / Linux：**

```bash
curl -fsSL https://claude.ai/install.sh | bash
claude --version
```

### 方式 2：Agent 原生安装（需科学上网）

向 IDE Agent 输入：

```text
帮我安装node并且用npm安装好最新的claude code
```

### 方式 3：无科学上网安装

**Windows：**

```powershell
winget install Git.Git
```

然后向 Agent 输入：

```text
执行这条代码安装Claude code：winget install Anthropic.ClaudeCode
安装完后，把Claude Code的可执行文件路径配置到系统环境变量的Path里。
```

重启 IDE，验证 `claude --version`。

**macOS：**

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

向 Agent 输入：`帮我把homebrew加到PATH路径变量里面去`

```bash
brew install --cask claude-code@latest
claude --version
```

## 三、配置大模型

下载 **CC Switch** 做多模型切换和管理。

- GitHub 仓库：[cc-switch](https://github.com/farion1231/cc-switch/releases/tag/v3.14.1)
- 最新版本：v3.14.1

步骤 1：在下载页根据系统选择对应安装包。
步骤 2：安装完成后，**在打开 CC 之前**先设置 CC Switch，在 Claude Code 页面添加 API Key 供应商。
步骤 3：以 Minimax 为例，选择对应厂商（中国版），填写 API Key 和 Base URL。
步骤 4：选择「启用」设置好的 API。

## 四、三种模式

| 模式 | 说明 | 适用场景 |
|:---|:-----|:--------|
| **对话模式** | 默认模式，一问一答 | 日常编码、调试、探索 |
| **计划模式** | `/plan` — 先设计方案再编码 | 复杂功能、架构决策、多文件改动 |
| **循环模式** | `/loop <时间>` — 定时重复执行 | 监控部署、轮询状态、定期检查 |

> [!NOTE] 切换模式快捷键 `Shift + Tab`

## 五、高效使用

### 5.1 启动与退出

| 操作 | 方式 |
|:---|:----|
| 启动 | 在 IDE 终端输入 `claude`，按引导设置后进入主界面 |
| 退出 | 连按两次 `Ctrl + C` |
| 恢复历史对话 | `/resume` 或 `claude -c` |

### 5.2 提供文件给 CC

| 方式 | 操作方法 |
|:---|:--------|
| 本地文件 | 使用 `@` 指令让 CC 查找 |
| 图片 | 拖拽图片至对话框，或 `Alt + V`（Win）/ `Command + V`（Mac）粘贴 |
| 多行文本 | `Ctrl + Enter`（Win）/ `Option + Enter`（Mac）换行 |

### 5.3 权限管理

CC 执行终端命令时会弹出三个选项：

| 选项 | 含义 |
|:----|:-----|
| 仅同意这一次 | 仅允许当前命令执行一次 |
| 同意 | 该项目之后执行项目依赖安装时不再询问 |
| 不同意 | 拒绝执行，再商量 |

跳过所有权限弹窗（仅当前会话生效）：

```powershell
claude --dangerously-skip-permissions
```

### 5.4 效率技巧

| 技巧       | 说明                     |
| :------- | :--------------------- |
| 并行任务     | 同时让 CC 做多个独立任务         |
| 批量编辑     | 一次描述多个改动，CC 逐步处理       |
| 背景运行     | 长时间任务可在后台运行，不阻塞对话      |
| `! <命令>` | 直接执行 shell 命令并返回结果     |
| 绝对路径     | 使用绝对路径引用文件，避免歧义        |
| `> ` 引用  | 用 `> ` 引用之前的消息，CC 优先关注 |

### 5.5 最佳实践

**避免的用法：**
- ❌ 模糊指令：「优化这段代码」→ 具体说明优化方向
- ❌ 过多无关上下文 → 只提供相关的文件和日志
- ❌ 一次要求太多改动 → 拆分成多个小任务

**推荐的用法：**
- ✅ 先讨论方案再实施（尤其复杂任务）
- ✅ 改动后主动审查 diff
- ✅ 测试覆盖关键路径
- ✅ 记录项目约定到 CLAUDE.md

## 六、指令大全

| 指令                | 功能说明                              |
| :---------------- | :-------------------------------- |
| `/help`           | 查看所有命令及帮助信息                       |
| `/clear`          | 彻底清空上下文，重开一个会话                    |
| `/compact`        | 主动压缩精简上下文                         |
| `/context`        | 查看上下文占比、token 消耗等详细信息             |
| `/resume`         | 恢复之前的对话历史                         |
| `/rewind`         | 进入回滚界面，回退到之前的对话节点                 |
| `/model <模型名>`    | 切换模型                              |
| `/config`         | 修改设置（主题、模型、权限等）                   |
| `/init`           | 初始化项目级 CLAUDE.md                  |
| `/plan`           | 进入计划模式                            |
| `/memory`         | 管理全局/项目记忆及 Auto-memory            |
| `/cost`           | 查看本次会话的 token 消耗                  |
| `/doctor`         | 诊断环境问题                            |
| `/fast`           | 切换到快速模式（更快输出）                     |
| `/review`         | 审查当前分支的代码变更                       |
| `/simplify`       | 派生 3 个 Agent 从代码质量、效率、复用性做审核并自动优化 |
| `/loop <时间> <命令>` | 按间隔重复执行                           |
| `/agents`         | 创建、调用、管理子 Agent                   |
| `/plugin`         | 发现和管理插件                           |
| `/btw`            | 临时切出当前项目，隔离上下文进行对话，按 Esc 返回       |

## 七、模型配置（接入 DeepSeek）

| 配置项         | 填入模型                    | 分配逻辑说明                |
| :---------- | :---------------------- | :-------------------- |
| 主模型         | `deepseek-v4-flash` | 日常默认用速度快、成本低的 flash   |
| Haiku 默认模型  | `deepseek-v4-flash` | 轻量化高速模型，匹配 flash 定位   |
| Sonnet 默认模型 | `deepseek-v4-pro`   | 中阶主力，处理常规代码编写、逻辑分析    |
| Opus 默认模型   | `deepseek-v4-pro`   | 最强推理，处理长上下文、重构、疑难 bug |

## 八、会话管理

### 8.1 上下文管理

| 操作 | 指令 | 说明 |
|:---|:----|:-----|
| 查看进度 | `/context` | 查看上下文占比、token 类别等详细信息 |
| 主动压缩 | `/compact` | 建议占比高于 **60%** 时执行，降低 token 消耗 |
| 彻底清空 | `/clear` | 相当于重开一个会话 |

### 8.2 状态栏常驻

在对话框输入：

```text
帮我配一个 statusLine，能显示当前目录 + 模型 + 上下文剩余百分比
```

> [!NOTE] 配置后需重启 CC 生效

### 8.3 用 Git + GitHub 保存项目状态

#### 初始化仓库

```text
初始化 Git，忽略图片和 .obsidian 配置，然后做第一次提交
```

CC 会自动创建 `.gitignore` 并完成 `git init` + `git add -A` + `git commit`。

#### 常用操作速查

| 操作 | 对 CC 说 | 等价命令 |
|:----|:---------|:--------|
| 查看状态 | `git status` | `git status` |
| 提交 | `git commit` | `git add -A && git commit` |
| 看提交历史 | `git log` | `git log --oneline` |
| 恢复文件 | `用 git 恢复 xxx 文件` | `git checkout -- 文件` |
| 看改了啥 | `git diff` | `git diff` |
| 推到远程 | `git push` | `git push` |

> [!tip] 每次整理完笔记后随手 commit + push，GitHub 就是免费远程备份。

## 九、个性化配置

### 9.1 CLAUDE.md 文件

| 类型 | 创建方式 | 用途 |
|:---|:--------|:-----|
| **全局级** | 让 CC 写进全局 claude.md，或手动编辑 `%USERPROFILE%\.claude\CLAUDE.md` | 所有项目通用的长期原则 |
| **项目级** | 在工作目录下 `/init` | 跟随项目变化，踩坑后同步更新 |
| **子文件夹级** | 递归生效 | 局部规则覆盖 |

### 9.2 Auto Memory

`/memory` → 选择「Auto-memory」开启。自动记录没有显式写入 CLAUDE.md 的习惯、错误和经验，**仅限于当前项目**。

## 十、高级扩展

### 10.1 Skill（技能）

| 类型 | 说明 |
|:---|:-----|
| 知识型 | 设计规范、语言规范等 |
| 流程型 | 工作流程指南 |
| 工具型 | 工具使用说明书 |
| 混合型 | 以上类型的组合 |

**安装方式**：从 LobeHub 市场或 GitHub 下载 Skill 文件夹，放入全局或项目的 `.claude/skills/` 目录。

> 推荐安装：Find-Skill（查找 skill）、Skill-Creator（创建 skill）

### 10.2 MCP

AI 和外部应用的转接口。可参考 V 站或官方文档了解 MCP 配置方法。

### 10.3 CLI（命令行工具）

轻量化的 MCP。推荐 CLI：

| CLI 名称 | 功能 |
|:--------|:----|
| 飞书 CLI | 飞书官方 CLI，覆盖消息、文档、多维表格等 200+ 命令 |
| OpenCLI | 万能命令行工具箱 |
| GitHub CLI | GitHub 官方 CLI，将 PR、Issue 带到终端 |
| gemini-CLI | 将 Gemini 功能引入终端 |

### 10.4 SubAgent（子 Agent）

| 创建方式 | 说明                       |
| :--- | :----------------------- |
| 自动触发 | 任务复杂且存在并行可能时，CC 自动派生     |
| 手动创建 | `/agents` → Library 界面创建 |



### 10.5 Hook（钩子）

关键词：**当 {XXXXX} 时，就要完成 {XXXXX}**。

直接对 CC 说即可自动配置：

```text
设置一个hook，每次完成任务之后，都自动执行一个声音脚本，发出提示音"叮"
```

推荐 Hook：
- 任务完成提示音
- 代码提交前格式检查

### 10.6 Plugin（插件）

插件是打包了 **Skill**、**SubAgent**、**Hook**、**MCP** 的整合性概念。

- `/plugin` — 进入插件管理界面

推荐插件：

| 插件名称 | 功能 |
|:--------|:----|
| commit-commands | 用简单命令简化 Git 工作流程 |
| content-creator | 跨平台内容创作 |
| security-guidance | 编辑文件时提示潜在安全问题 |

## 十一、注意事项

- Claude Code 使用 CommonMark 规范渲染 Markdown
- 对话有上下文窗口限制，过长时系统会自动压缩早期消息
- 文件编辑使用精确匹配工具，缩进和空格需要保持一致
- Windows 环境下使用 Unix shell 语法（正斜杠路径等）
