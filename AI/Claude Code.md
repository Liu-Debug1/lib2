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
！
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

| 技巧       | 说明                     |     |
| :------- | :--------------------- | --- |
| 并行任务     | 同时让 CC 做多个独立任务         |     |
| 批量编辑     | 一次描述多个改动，CC 逐步处理       |     |
| 背景运行     | 长时间任务可在后台运行，不阻塞对话      |     |
| `! <命令>` | 直接执行 shell 命令并返回结果     |     |
| 绝对路径     | 使用绝对路径引用文件，避免歧义        |     |
| `> ` 引用  | 用 `> ` 引用之前的消息，CC 优先关注 |     |

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

## 六、指令大全（共 73 条）

> 来源：Claude Code 官方最新指令清单，2026-06-04 更新

### 6.1 会话管理

| 指令 | 功能 |
|:-----|:-----|
| `/clear` | 彻底清空上下文，重开一个会话 |
| `/compact` | 主动压缩精简上下文 |
| `/context` | 查看上下文占比、token 消耗等详细信息 |
| `/resume` | 恢复之前的对话历史 |
| `/rewind` | 进入回滚界面，回退到之前的对话节点 |
| `/export [filename]` | 将当前对话导出为纯文本，可指定文件名 |
| `/recap` | 按需生成当前会话的摘要 |
| `/rename [name]` | 重命名当前会话并在提示栏显示名称 |
| `/copy [N]` | 复制上一个 assistant 响应到剪贴板，N 可指定倒数第 N 个 |
| `/exit` | 退出 CLI（别名 `/quit`） |

### 6.2 模型与输出控制

| 指令 | 功能 |
|:-----|:-----|
| `/model <模型名>` | 切换模型 |
| `/effort [level\|auto]` | 设置模型推理深度：low / medium / high / xhigh / max，auto 恢复默认 |
| `/fast [on\|off]` | 切换快速模式开或关 |
| `/config` | 打开设置界面（别名 `/settings`） |
| `/theme` | 更改颜色主题：auto / light / dark / colorblind-accessible |
| `/color [color\|default]` | 设置当前会话提示栏颜色：red, blue, green, yellow, purple, orange, pink, cyan |
| `/tui [default\|fullscreen]` | 设置终端 UI 渲染器并重启对话 |

### 6.3 任务与自动化

| 指令 | 功能 |
|:-----|:-----|
| `/plan [description]` | 进入计划模式，可选描述任务 |
| `/ultraplan` | 超计划模式：浏览器中审查计划 → 远程执行或回传终端 |
| `/loop [interval] [prompt]` | 按间隔重复执行提示（别名 `/proactive`） |
| `/batch` | 跨代码库编排大规模更改，在隔离 git worktree 中生成后台 agent |
| `/tasks` | 列出和管理后台任务（别名 `/bashes`） |
| `/schedule [description]` | 创建、列出、管理定时任务（别名 `/routines`） |

### 6.4 代码审查与安全

| 指令                     | 功能                              |
| :--------------------- | :------------------------------ |
| `/review [PR]`         | 在当前会话中审查 pull request           |
| `/ultrareview [PR]`    | 云沙盒中运行深度多 agent 代码审查            |
| `/security-review`     | 分析当前分支待处理更改的安全漏洞                |
| `/simplify`            | 派生 Agent 从代码质量、效率、复用性做审核并自动优化   |
| `/diff`                | 打开交互式 diff 查看器                  |
| `/pr-comments [PR]`    | 获取并显示 GitHub PR 的评论             |
| `/autofix-pr [prompt]` | 启动 Web 会话，监视分支 PR 并在 CI 失败时推送修复 |


### 6.5 Git 与分支

| 指令 | 功能 |
|:-----|:-----|
| `/init` | 初始化项目级 CLAUDE.md |
| `/branch [name]` | 在当前对话点创建分支（别名 `/fork`） |
| `/btw` | 临时切出当前项目，隔离上下文进行对话，按 Esc 返回 |

### 6.6 权限与安全

| 指令 | 功能 |
|:-----|:-----|
| `/login` | 登录 Anthropic 账户 |
| `/logout` | 从 Anthropic 账户登出 |
| `/permissions` | 管理工具权限（允许/询问/拒绝），别名 `/allowed-tools` |
| `/fewer-permission-prompts` | 扫描转录本，将常用只读操作加入允许列表 |
| `/sandbox` | 切换沙盒模式（仅支持的平台） |
| `/privacy-settings` | 查看和更新隐私设置（Pro / Max 订阅者可用） |

### 6.7 工具与环境

| 指令 | 功能 |
|:-----|:-----|
| `/doctor` | 诊断和验证安装和设置，按 f 修复问题 |
| `/terminal-setup` | 配置终端按键绑定（Shift+Enter 等） |
| `/keybindings` | 打开或创建按键绑定配置文件 |
| `/statusline` | 配置 Claude Code 状态行 |
| `/hooks` | 查看工具事件的 hook 配置 |
| `/ide` | 管理 IDE 集成并显示状态 |
| `/add-dir` | 添加工作目录以访问文件（--continue / --resume 恢复） |
| `/desktop` | 在 Claude Code Desktop 应用中继续会话（别名 `/app`） |
| `/mobile` | 显示下载移动应用的二维码（别名 `/ios`, `/android`） |
| `/chrome` | 配置 Chrome 中的 Claude 设置 |

### 6.8 扩展（Skill / MCP / Plugin / Agent）

| 指令 | 功能 |
|:-----|:-----|
| `/agents` | 管理 sub-agent 配置 |
| `/skills` | 列出可用技能，按 t 按 token 数量排序 |
| `/plugin` | 发现和管理插件 |
| `/mcp` | 管理 MCP 服务器连接和 OAuth 认证 |
| `/reload-plugins` | 重新加载所有活动插件以应用更改 |
| `/claude-api [migrate\|managed-agents-onboard]` | 加载 Claude API 参考材料 |

### 6.9 云服务与远程

| 指令 | 功能 |
|:-----|:-----|
| `/remote-control` | 使会话可通过 claude.ai 远程控制（别名 `/rc`） |
| `/remote-env` | 为 --remote 启动的 Web 会话配置默认远程环境 |
| `/teleport` | 将 Web 上的 Claude Code 会话拉入终端（别名 `/tp`） |
| `/web-setup` | 使用本地 gh CLI 凭证连接 GitHub 账户到 Web |
| `/install-github-app` | 为仓库设置 Claude GitHub Actions 应用 |
| `/install-slack-app` | 安装 Claude Slack 应用 |
| `/extra-usage` | 配置额外使用量以在达到速率限制时继续工作 |

### 6.10 模型提供商配置

| 指令 | 功能 |
|:-----|:-----|
| `/setup-bedrock` | 配置 Amazon Bedrock 认证、区域和模型（别名 `/bedrock-setup`） |
| `/setup-vertex` | 配置 Google Vertex AI 认证、项目、区域和模型 |

### 6.11 信息与统计

| 指令 | 功能 |
|:-----|:-----|
| `/cost` | 显示会话成本（别名 `/usage`, `/stats`） |
| `/usage` | 显示会话成本、计划使用限制和活动统计 |
| `/insights` | 生成会话分析报告（项目领域、交互模式、摩擦点） |
| `/release-notes` | 在交互式版本选择器中查看变更日志 |
| `/status` | 显示版本、模型、账户和连接状态 |
| `/debug [description]` | 启用调试日志并排查问题 |
| `/heapdump` | 将 JavaScript 堆快照写入桌面，用于诊断高内存使用 |
| `/feedback [report]` | 提交关于 Claude Code 的反馈（别名 `/bug`） |

### 6.12 其他

| 指令 | 功能 |
|:-----|:-----|
| `/memory` | 管理全局/项目记忆及 Auto-memory |
| `/help` | 查看所有命令及帮助信息 |
| `/voice [hold\|tap\|off]` | 切换语音听写模式 |
| `/powerup` | 通过互动课程和动画演示发现 Claude Code 功能 |
| `/team-onboarding` | 从 Claude Code 使用历史生成团队入职指南 |
| `/passes` | 与朋友分享一周免费 Claude Code |
| `/stickers` | 订购 Claude Code 贴纸 |
| `/upgrade` | 打开升级页面切换到更高计划层 |

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

**安装方式**：从[Agent SKILLs 市场](https://lobehub.com/zh/skills)或 GitHub 下载 Skill 文件夹，放入全局或项目的 `.claude/skills/` 目录。

> 推荐安装：Find-Skill（查找 skill）、Skill-Creator（创建 skill）

#### 如何描述一个 Skill 需求（让 CC 一次做对）

向 CC 描述 Skill 需求时，尽量覆盖以下 6 个维度。覆盖越多，成品越完整、越少返工：

**① 做什么（核心功能）**

一句话说清楚这个 skill 解决什么问题：

> "帮我审查 C/C++ 代码是否符合项目编码规范"
> "把笔记中的代码截图 OCR 识别后替换为代码块"

❌ 模糊： "帮我搞一个代码相关的 skill"

**② 什么时候触发（触发条件）**

给出触发词或触发场景，让 CC 知道何时自动调用：

> "触发词：审查代码、代码规范、check code、review"
> "当我说'整理笔记'或'优化这篇笔记'时触发"

**③ 输入什么、输出什么（I/O 规范）**

明确用户会提供什么，skill 应该返回什么：

> "用户提供一段 C/C++ 代码片段或文件路径"
> "输出一份审查报告，按严重度分级列出违规项 + 修改建议"

**④ 依据什么规则（知识来源）**

Skill 的判断依据是什么——文档、规范、经验法则？

> "规范来源：`D:\桌面\研0记录\代码规范相关说明.docx`"
> "参考《Google C++ Style Guide》的命名规范部分"

如果规则写在外部文档里，提供**文件路径**让 CC 自己读。

**⑤ 有哪些边界 / 不该做什么（负面约束）**

明确什么东西**不要**管、什么不是这个 skill 的职责：

> "不检查算法正确性，只检查风格和命名规范"
> "流程图、示意图等非代码图片不要 OCR，保留原图"

**⑥ 有没有参考样例（正反例）**

给出一个好的输出长什么样，帮助 CC 理解期望格式：

> "审查报告格式：违规项表格 + 符合项 + 总结"
> "类似 ESLint 的输出风格，带行号和严重度标记"

---

**描述模板**（可直接套用）：

```text
帮我创建一个 skill，叫 [名称]：

1. 功能：[一句话核心功能]
2. 触发：[触发词或场景]
3. 输入/输出：[用户提供什么 → 返回什么]
4. 规则来源：[文档路径 或 具体规则描述]
5. 不做什么：[边界约束]
6. 输出格式：[期望的报告/结果格式]
```

> [!tip] 最少提供 ①②④ 三项就能出一版能用的 skill。③⑤⑥ 是加分项，补充后 CC 写得更精准。

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
推荐的CLI市场[cli · GitHub Topics](https://github.com/topics/cli)
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
[Claude官方](https://claude.com/plugins#plugins)
[Claude第三方](https://claudecodeplugins.dev/zh)

| 插件名称              | 功能               |
| :---------------- | :--------------- |
| commit-commands   | 用简单命令简化 Git 工作流程 |
| content-creator   | 跨平台内容创作          |
| security-guidance | 编辑文件时提示潜在安全问题    |
|                   |                  |

## 十一、注意事项

- Claude Code 使用 CommonMark 规范渲染 Markdown
- 对话有上下文窗口限制，过长时系统会自动压缩早期消息
- 文件编辑使用精确匹配工具，缩进和空格需要保持一致
- Windows 环境下使用 Unix shell 语法（正斜杠路径等）
