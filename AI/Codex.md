---
tags:
  - AI
  - Codex
  - 工具
date: 2026-06-06
source: https://my.feishu.cn/wiki/OCY5wzbGhiLDr8kMulkcLLuSnQd
---

# Codex 完全指南

> 基于飞书文档「Codex全解【视频文档】」整理，补充实际使用经验。

## 一、准备工作

### 1.1 安装下载

**步骤 1**：前往 [OpenAI Codex 官网](https://openai.com/zh-Hans-CN/codex/) 下载桌面客户端。

**步骤 2**：登录 Codex，有两种方式：

| 登录方式 | 说明 | 适用场景 |
|---------|------|---------|
| ChatGPT 账号 | 有 ChatGPT 账号即可，直接登录 | 个人用户，已有 ChatGPT 订阅 |
| API Key | 需要额外购买 API 额度 | 团队使用、需要更灵活的额度控制 |

> [!tip]
> ChatGPT Plus/Pro 会员登录后会获得一定免费额度，推荐个人用户使用此方式。

### 1.2 ChatGPT 账号模式代理配置

最近如果遇到 **Codex 账号模式无法使用**，优先检查代理配置。

- **ChatGPT 账号模式**：必须有可用代理，并且代理要正确配置到 Codex 工作目录。
- **API Key 模式**：是否需要代理取决于当前网络环境和 API 服务访问情况。

账号模式推荐配置流程：

1. 打开代理工具的 **TUN 模式**。
2. 在 Codex 工作目录创建 `.env` 文件：
   - Windows 默认位置：`C:\Users\<用户名>\.codex\.env`
   - 当前用户示例：`C:\Users\Liuzwei\.codex\.env`
3. 写入代理环境变量：

```bash
HTTP_PROXY=http://127.0.0.1:7890
HTTPS_PROXY=http://127.0.0.1:7890
ALL_PROXY=http://127.0.0.1:7890
NO_PROXY=localhost,127.0.0.1
```

> [!warning]
> 端口号要和本机代理软件实际监听端口一致，不一定都是 `7890`。改完 `.env` 后建议重启 Codex，让环境变量重新加载。

### 1.3 界面介绍

Codex 桌面端主要包含以下区域：

- **对话区**（左侧）：与 Codex 交互的主区域，输入指令、查看回复
- **代码/文件区**（右侧）：查看和管理项目文件、代码变更
- **终端区**（底部）：显示命令执行输出
- **设置面板**：管理模型、额度、权限、自动化等
- **侧边栏**：切换 Thread（对话线程）、管理项目

---

## 二、基础操作

### 2.1 上下文管理

Codex 通过 **Thread（对话线程）** 管理上下文：

- 每个 Thread 是一个独立的对话上下文
- Thread 内 Codex 能记住之前的对话历史和文件修改
- 可以创建多个 Thread 分别处理不同任务
- **/clear** 或新建 Thread 可清空上下文

> [!warning]
> 上下文窗口有限制（取决于模型），过长对话可能导致 Codex "遗忘"早期内容。建议一个任务一个 Thread，完成就换。

使用 `/` 斜杠命令可以快速调用常用功能。

### 2.2 线程、目标与工作区模式

> [!tip] 一句话理解
> Codex 不是只有一个聊天窗口，而是一个“任务工作台”：Thread 负责记住上下文，Goal 负责盯住长期目标，Plan Mode 负责先想清楚，Worktree 负责把后台修改隔离开。

可以先用一个工程类比记：

```text
Thread（线程）     = 一个任务档案袋
Goal（追求目标）   = 贴在档案袋上的长期任务目标
Plan Mode（计划） = 动手前先画施工图
Archive（归档）   = 做完后收进文件柜
Fork（派生）       = 从当前方案另开一条路线
Worktree（工作树） = 给 Codex 单独开一个施工现场
Local（本地）      = 你当前正在用的主工作区
```

#### 2.2.1 追求目标（Goal）

追求目标适合让 *Codex* 围绕一个**明确、长期、可完成**的目标持续推进。

比如：
```text
创建一个目标：把 ROS 学习笔记整理成适合复习和工程实践的完整章节。
```

| 适合使用 | 不适合使用 |
| :--- | :--- |
| 整理一整套笔记 | 问一个概念 |
| 修 bug 直到测试通过 | 翻译一句话 |
| 重构一个模块 | 改一个错别字 |
| 做一个完整小项目 | 查一个命令 |

> [!note] 工程理解
> Goal 的作用不是让 Codex 更“聪明”，而是让它更像一个持续工作的队友：不会只回答当前一句话，而是围绕同一个目标反复推进、检查进度、直到收尾。

#### 2.2.2 计划模式（Plan Mode）

计划模式适合在**不确定怎么做**时先拆解任务。

它更像正式开发前的技术方案评审：

1. 先理解需求和边界。
2. 拆成几个可执行步骤。
3. 识别风险点和需要确认的问题。
4. 方案确认后再进入执行。

适合：

- 设计 ROS 学习路线
- 重构笔记体系
- 做 Skill / MCP / Plugin 的安装方案
- 大范围改代码或改文档结构

不适合：

- “把这段内容写进笔记”
- “帮我改一个标题”
- “运行一下这个命令”

> [!warning] 注意
> 计划模式的核心是“先不急着动文件”。如果任务已经很明确，直接让 Codex 执行通常更快。

#### 2.2.3 对话归档（Archive）

对话归档就是把一个 Thread 从当前列表里收起来。

适合：

- 任务已经结束
- 临时问答不想继续占侧边栏
- 同一项目线程太多，需要保持工作台干净

> [!warning] 注意
> 归档 Thread 不等于提交代码，也不等于备份文件。文件是否保存、是否 `git commit`，仍然看本地文件系统和 Git 状态。

#### 2.2.4 派生 / 分叉（Fork）

派生就是从当前对话上下文另开一条路线。

比如当前线程在整理 `Codex.md`，可以派生出几个方向：

- 路线 A：继续补充 Codex 桌面端功能
- 路线 B：专门整理 Skill / MCP / Plugin 管理
- 路线 C：把这篇笔记改成教程版

> [!tip] 类比
> Fork 更像“复制一份当前讨论材料，然后另开一个会议室讨论新方案”。它主要分的是**对话上下文**，不是 Git 分支本身。

#### 2.2.5 Local、Worktree 与 Cloud

Codex App 创建线程时，常见工作模式有三类：

| 模式 | 运行位置 | 适合场景 |
| :--- | :--- | :--- |
| `Local` | 当前本地项目目录 | 小改动、Obsidian 笔记、本地文件整理 |
| `Worktree` | 本机 Git 工作树副本 | 大改动、后台任务、并行方案尝试 |
| `Cloud` | 远端云环境 | 云端委托任务、跨设备后台执行 |

官方文档里提到，`Local` 和 `Worktree` 都是在你的电脑上运行；区别在于 `Local` 是当前主工作区，`Worktree` 是 Git 创建出来的隔离副本。

```text
Local：你正在用的主工作区
   |
   |  创建 worktree
   v
Worktree：Codex 的后台独立工作区
```

#### 2.2.6 Worktree（工作树）

`Worktree` 本质上是 Git 的第二份 checkout。它有一份独立文件副本，但共享同一个仓库的 Git 元数据。

适合：

- 让 Codex 后台改一个大功能，你继续在 Local 里工作
- 同时比较两个方案，比如“方案 A 用 ROS1，方案 B 用 ROS2”
- 让 Codex 跑测试、修 bug，不影响当前工作目录
- 大型重构、代码迁移、前端 UI 改造

不适合：

- 简单改一篇笔记
- 没有 Git 管理的普通文件夹
- 涉及大量 `.gitignore` 文件的任务，例如 Obsidian 的 `图片/` 附件目录

> [!warning] Obsidian 仓库注意
> 本仓库的 `图片/` 目录被 `.gitignore` 排除。涉及图片附件、截图、PDF 附件的笔记整理，优先用 `Local`，避免正文在 Worktree 里改了，但附件还在主工作区。

#### 2.2.7 派生到本地 / Handoff to Local

Handoff 可以把线程在 `Local` 和 `Worktree` 之间移动。

常见流程：

```text
1. 在 Worktree 里让 Codex 后台完成大改动
2. 检查改动是否基本靠谱
3. Handoff to Local，把任务拿回主工作区
4. 用自己常用的 IDE / Obsidian / 编译环境继续检查
```

适合：

- Codex 在 Worktree 里做完了，你想自己接手检查
- 只能在当前 Local 环境跑程序，比如已有开发服务器、仿真环境、硬件连接
- 想把后台任务拿回前台继续细改

> [!note] 官方机制
> Handoff 底层会处理 Git 操作，因为同一个分支不能同时被两个 checkout 占用。实际使用时，把它理解成“Codex 帮你安全搬运当前任务现场”即可。

#### 2.2.8 选择建议

| 场景 | 推荐 |
| :--- | :--- |
| 问概念、整理一小段笔记 | `Local` |
| 修改 Obsidian 笔记，尤其涉及图片 | `Local` |
| 大改 C++ / ROS 工程 | `Worktree` |
| 想让 Codex 后台慢慢跑测试 | `Worktree` |
| 想比较两个不同方案 | `Fork` + `Worktree` |
| 后台改完，想自己检查 | `Handoff to Local` |
| 任务结束、侧边栏太乱 | `Archive` |
| 长期目标，不想每轮重复说明 | `Goal` |
| 不确定怎么做，怕改错方向 | `Plan Mode` |

#### 2.2.9 参考资料

- [Codex App 官方文档](https://developers.openai.com/codex/app)
- [Codex App Features](https://developers.openai.com/codex/app/features)
- [Codex Worktrees](https://developers.openai.com/codex/app/worktrees)
- [Codex Use Cases：Follow a goal](https://developers.openai.com/codex/use-cases)

### 2.3 额度状态

两种查看方式：

**方式 1：系统设置查看**
- 打开设置面板 → 查看当前 Token 使用量和剩余额度

**方式 2：斜杠命令查看**
- 输入 `/usage` 或 `/budget` 查看当前额度消耗

相关概念：
- **Token**：模型计费单位，约 1 Token ≈ 0.75 英文单词 ≈ 0.5 中文字
- **额度**：不同模型消耗不同，GPT-5 系列比 GPT-4 系列消耗更多
- 每次对话都会消耗 Token（输入 + 输出），文件读写也会计入

### 2.4 模型选择

Codex 支持多种模型，可在设置中切换：

| 模型 | 特点 | 推荐场景 |
|------|------|---------|
| GPT-5.5 | 最新旗舰，最强的复杂推理能力 | 复杂架构设计、大型重构 |
| GPT-5.4 | 均衡型，日常编程首选 | 日常开发、代码审查 |
| GPT-5.4-mini | 快速、低成本 | 简单修改、格式调整 |
| GPT-5.3-codex | 编程优化版 | 专门针对代码任务 |

可以在设置面板中选择默认模型，也可以在对话中通过斜杠命令临时切换。

---

## 三、本地文件读写

Codex 可以直接读写本地文件，这是它作为桌面客户端的核心优势之一：

- **读取文件**：Codex 自动扫描工作目录下的文件，可通过对话引用
- **编辑文件**：Codex 使用 `apply_patch` 工具直接修改文件
- **运行命令**：通过终端执行 shell 命令、编译、运行测试
- **工作目录**：可以在设置中配置默认工作目录，或通过对话切换

> [!NOTE]
> 权限模式（如 `acceptEdits`）决定 Codex 是自动执行修改还是需要手动确认。建议在 `.Codex/settings.local.json` 中配置。

**Sandbox（沙箱）模式**：限制 Codex 能访问哪些文件和命令，保障安全性。

---

## 四、命令行使用

除了桌面 GUI，Codex 也提供 **CLI（命令行）** 版本：

- 终端中直接调用 Codex
- 适合 CI/CD 集成、批量处理
- 支持管道操作和脚本自动化
- 与桌面版共享配置和额度

常用终端操作在 Codex 内置终端中即可完成，无需切换窗口。

---

### 4.1 CLI 安装与基本检查

- Windows / PowerShell 可直接全局安装：
  ```powershell
  npm install -g @openai/codex
  ```
- 安装完成后先验证命令是否可用：
  ```powershell
  codex --version
  ```
- 查看当前登录状态：
  ```powershell
  codex login status
  ```

### 4.2 设备码登录（ChatGPT 账号）

当前版本的 Codex CLI 使用 `login` 子命令，**不是** `codex --login`。

1. 执行设备码登录命令：
   ```powershell
   codex login --device-auth
   ```
2. 终端会显示一次性设备码和过期时间（通常 15 分钟）
3. 打开 [https://auth.openai.com/codex/device](https://auth.openai.com/codex/device)
4. 登录 OpenAI / ChatGPT 账号
5. 输入终端显示的设备码，完成授权

> [!warning]
> 设备码不是固定码，而是一次性临时码。每次重新执行 `codex login --device-auth`，通常都会生成新的码；过期后需要重新获取。

> [!tip]
> 只有首次登录、执行过 `codex logout`、切换账号，或本地登录凭证失效时，才需要重新走设备码授权。日常使用直接运行 `codex` 即可。

> [!note]
> 如果浏览器要求输入验证码，但终端没有显示新的设备码，先执行：
> ```powershell
> codex login status
> ```
> 若已经显示 `Logged in using ChatGPT`，通常说明当前已登录，无需重复授权。
> 若确实要重新授权，按下面顺序执行：
> ```powershell
> codex logout
> codex login --device-auth
> ```

## 五、持久记忆

Codex 支持三种级别的持久记忆机制：

### 方式 1：全局级长期记忆

- 配置在 **用户级** `AGENTS.md` 文件中
- 所有项目共享，如用户偏好、工具链、代码规范
- 位置：用户目录下的 Codex 配置文件夹

### 方式 2：项目级持久记忆

- 配置在 **项目根目录** 的 `AGENTS.md` 文件中
- 只对当前项目生效，如项目架构、命名规范、测试策略
- 支持子目录嵌套 `AGENTS.md`，就近原则覆盖

### 方式 3：自动记忆

- Codex 在对话中自动学习用户偏好
- 如常用的命令、代码风格、项目结构等
- 随使用时间增长，自动优化交互体验

> [!tip]
> **最佳实践**：全局 AGENTS.md 放个人偏好（工具链、语言），项目 AGENTS.md 放项目规范。越具体的规则放在越深层的目录中。

---

## 六、大型项目规划与落地

对于复杂项目，Codex 提供分层工作流：

1. **Plan Mode（规划模式）**：先制定计划，确认后再执行
2. **Task Decomposition（任务分解）**：将大任务拆分为可独立完成的子任务
3. **Plan Tracking（进度追踪）**：使用 `update_plan` 工具追踪每个步骤状态
4. **Sub-agent（子代理）**：并行处理多个独立子任务

**工作流建议**：
```
需求分析 → 制定计划 → 审核确认 → 逐步实现 → 测试验证 → 总结交付
```

---

## 七、插件

### 7.1 插件位置

插件安装在 Codex 的 plugins 目录：
- **全局**：`C:\Users\<用户名>\.codex\plugins\`
- **项目级**：项目内 `.codex/plugins/`

### 7.2 重点插件

| 插件           | 功能                     | 推荐度   |
| ------------ | ---------------------- | ----- |
| Browser      | 内置浏览器，可访问 localhost、网页 | ⭐⭐⭐⭐⭐ |
| Chrome       | 控制用户 Chrome，使用已登录会话    | ⭐⭐⭐⭐  |
| GitHub       | PR/Issue 管理、CI 调试、代码审查 | ⭐⭐⭐⭐⭐ |
| Google Drive | Google 文档/表格/幻灯片操作     | ⭐⭐⭐   |
| Gmail        | 邮件管理和自动化               | ⭐⭐⭐   |
| Computer Use | 控制桌面应用（Windows）        | ⭐⭐⭐   |

### 7.3 插件市场

Codex 支持 **Plugins（插件）** 扩展，提供额外能力：
- 内置插件随 Codex 发布自动更新
- 可在插件设置中启用/禁用
- 插件通过 Skills、MCP 等机制暴露能力给 Codex

### 7.4 Codex 插件大全

来源：[飞书云文档：Codex插件大全](https://my.feishu.cn/wiki/NATtwZKgmiS4JSk1I74c78lYnRb)，页面显示最新修改时间为 05 月 15 日，本次整理时间：2026-06-07。

> [!NOTE]
> 飞书页面目录中还列出「设计类插件」「生活方式插件」「生产力与业务插件」「研究与金融信息插件」的分类，本次已根据 2026-05-15 版本的页面内容全部补全。后续如果页面内容更新，可继续追加。
	
#### 7.4.1 六大插件分类

| 分类 | 适合谁看 | 主要用途 |
|------|----------|----------|
| Featured / 精选 | 刚开始使用 Codex 的人 | 官方重点推荐的通用插件，如浏览器、文档、代码协作、邮箱、日历、设计和部署。 |
| Coding / 编程与工程 | 开发者、产品技术团队 | 写代码、测试、部署、数据库、云服务、错误监控、安全扫描。 |
| Design / 设计 | 设计师、内容创作者、科研作者 | 做设计稿、视频动效、科研插图、HTML 视频内容。 |
| Lifestyle / 生活方式 | 生活服务场景用户 | 房产、汽车订阅、礼物清单、账单、旅行天气保障。 |
| Productivity / 生产力与业务 | 运营、销售、客服、市场、管理者 | 项目管理、CRM、会议纪要、客户支持、营销分析、企业搜索。 |
| Research / 研究与金融信息 | 研究员、投资分析、金融/政策信息用户 | 论文、金融数据、市场情报、政策信息、投研资料。 |

#### 7.4.2 精选类插件

适合优先了解，多数是 Codex 最常用、最核心的连接能力。

| 插件 | 可以做什么 |
|------|------------|
| Computer Use | 让 Codex 点击、输入、滚动和操作本机 Mac 应用，适合没有专用插件的本地软件流程。 |
| Chrome | 使用你的 Chrome 环境、登录态和页面上下文完成浏览器任务。 |
| Spreadsheets | 创建、编辑、分析 Excel/CSV/表格文件，适合数据清洗、公式、图表和报表。 |
| Presentations | 创建和编辑 PPT/演示文稿，适合做汇报、路演、总结 deck。 |
| GitHub | 处理 PR、Issue、CI、代码审查、发布流程等工程协作任务。 |
| Slack | 读取和管理 Slack 消息，整理讨论、提炼待办、准备回复。 |
| Notion | 处理 Notion 规格文档、研究资料、会议记录、项目知识。 |
| Linear | 查找和引用 Linear issue、项目、路线图，辅助研发任务管理。 |
| Statsig | 把 Statsig 工作区接入 Codex，用于实验、指标和功能开关上下文。 |
| Gmail | 读取和管理 Gmail，做邮件检索、摘要、回复草稿和收件箱整理。 |
| Google Calendar | 管理 Google 日程、会议、冲突检查、空闲时间和会议准备。 |
| Google Drive | 跨 Drive、Docs、Sheets 等文件查找、引用和整理资料。 |
| Teams | 总结 Teams 内容并起草跟进事项。 |
| SharePoint | 总结 SharePoint 站点和文件，适合企业资料库查询。 |
| Outlook Email | 整理 Outlook 收件箱、检索邮件、起草回复。 |
| Outlook Calendar | 管理 Outlook 日程、会议和排期。 |
| Figma | 设计到代码、读取设计稿、生成设计系统规则或辅助 UI 实现。 |
| Vercel | 构建和部署 Web 应用、Agent、预览环境。 |
| OpenAI Developers | 查询 OpenAI API、Agents、ChatGPT Apps、Codex 等官方开发资料。 |

#### 7.4.3 编程与工程类插件

适合开发、测试、部署、数据库、云平台和工程质量相关工作。

| 插件               | 可以做什么                              |
| ---------------- | ---------------------------------- |
| Hugging Face     | 查看模型、数据集、Spaces、论文等 AI 资源。         |
| Netlify          | 部署项目、管理发布、配置站点和函数。                 |
| Game Studio      | 设计、原型化并发布浏览器游戏。                    |
| Superpowers      | 强大 agent 工具包，辅助规划、TDD、调试和交付工程任务。   |
| CircleCI         | 构建、测试、部署应用，排查 CI/CD 流水线问题。         |
| Cloudflare       | 获取 Cloudflare 平台配置、部署、安全、边缘能力相关指导。 |
| Sentry           | 查看近期 Sentry issue 和事件，分析线上错误。      |
| Build iOS Apps   | 构建、优化、调试 iOS 应用。                   |
| Build macOS Apps | 构建、调试、埋点和实现 macOS 应用功能。            |
| Build Web Apps   | 面向前端的 Web App 构建、调试和迭代。            |
| Test Android Apps | 复现问题、检查 UI、辅助 Android 应用测试。        |
| Expo             | 构建、部署、升级和调试 Expo 应用。               |
| CodeRabbit       | 对代码和 PR 进行 AI 驱动的 review。           |
| Neon Postgres    | 管理 Neon 无服务器 Postgres 数据库。          |
| Plugin Eval      | 从对话开始，对插件或工作流效果做评估。               |
| Cloudinary       | 管理、搜索、转换图片/视频等媒体资产。               |
| Hostinger        | 使用 Hostinger Horizons 等能力构建和托管项目。   |
| MarcoPolo        | 启动安全容器来运行或隔离任务。                   |
| Quicknode        | 管理 Quicknode 节点和 Web3 基础设施。          |
| SendGrid         | 与 SendGrid 连接，处理邮件发送、模板或邮件 API。   |
| Vantage          | 查看云资源成本、监控和可观测性信息。               |
| YepCode          | 构建自定义 AI 工具和自动化流程。                |
| Render           | 部署、调试、监控和迁移 Render 上的应用。           |
| Temporal         | 开发、运行和管理 Temporal 工作流。             |
| Supabase         | 使用 Supabase 技能和 MCP 工具管理数据库、认证、存储等。 |
| Codex Security   | 对代码库做安全扫描和安全问题检查。                |
| Twilio Developer Kit | 构建和调试 Twilio 通信相关应用或自动化。       |

#### 7.4.4 设计类插件

适合做视觉设计、动效视频、科研图示和内容创作。

| 插件 | 可以做什么 |
|------|------------|
| Canva | 使用 Canva，搜索、创建、编辑设计稿，适合海报、社媒图、演示视觉。 |
| Remotion | 根据提示创建 motion graphics / 程序化视频。 |
| BioRender | 帮科研人员创建生物医学图示和科学插图。 |
| HyperFrames by HeyGen | 编写 HTML 并渲染视频，适合生成动态视觉内容。 |

#### 7.4.5 生活方式插件

偏生活服务类插件，适合特定场景下使用。

| 插件 | 可以做什么 |
|------|------------|
| Cogedim | 查询或处理 Cogedim 相关房地产信息。 |
| FINN | 查询 FINN 汽车订阅方案。 |
| MyRegistry.com | 管理或查询礼物清单、心愿单。 |
| Setu Bharat Connect BillPay | 支付或查询水电等公共事业账单相关信息。 |
| WeatherPromise | 为旅行等场景提供天气风险/保障相关服务。 |

#### 7.4.6 生产力与业务插件

数量最多，主要覆盖企业办公、销售、市场、客服、会议、项目管理和数据分析。

| 插件                | 可以做什么                           |
| ----------------- | ------------------------------- |
| Documents         | 创建和编辑文档类产物。                     |
| Atlassian Rovo    | 快速管理 Jira 和 Confluence。         |
| Jam               | 带上下文录屏，适合 bug 反馈和问题复现。          |
| Stripe            | 处理支付和商业工具相关信息。                  |
| Box               | 搜索和引用 Box 中的文档。                 |
| Amplitude         | 查询产品分析、漏斗和用户行为数据。               |
| Attio             | 将 Attio 客户/销售数据连接到 Codex。       |
| Brand24           | 监测品牌提及、社媒反馈和舆情线索。               |
| Brex              | 连接 Brex，审查费用、交易或公司财务上下文。        |
| Carta CRM         | 面向投资团队的 CRM/关系管理信息。             |
| Channel99         | 实时市场进入、渠道和增长相关信息。               |
| Circleback        | 提炼会议内容、行动项和团队跟进。                |
| ClickUp           | 连接 ClickUp 任务、项目和团队工作流。         |
| Common Room       | 嵌入买方洞察、社区信号和客户情报。               |
| Conductor         | 检索 Conductor 中的营销/SEO/内容数据。     |
| Coupler.io        | 分析多渠道营销数据、同步数据源。                |
| Coveo             | 搜索企业内容和知识库。                     |
| Demandbase        | 接入 Demandbase 账户营销和客户数据。        |
| Docket            | 让销售知识和资料可被 Codex 查询。            |
| Domotz (Preview)  | 监控和管理网络设备与网络状态。                 |
| Dovetail          | 连接 Dovetail，把用户研究资料转化为洞察。       |
| Egnyte            | 处理 Egnyte 中存储的文档和文件。            |
| Fireflies         | 读取会议记录、总结会议、提取待办。               |
| Fyxer             | 帮你写邮件、整理邮件和处理回复草稿。              |
| Granola           | 连接会议笔记，提炼总结、行动项和上下文。            |
| Happenstance      | 搜索个人或组织上下文，辅助关系和机会发现。           |
| Help Scout        | 同步 Help Scout 邮箱和客服对话。          |
| HighLevel         | 为代理商提供统一 CRM/营销工作台信息。           |
| HubSpot           | 分析 HubSpot 数据、客户、交易和销售线索。       |
| KeyBid Puls       | 解锁短租/房源收益能力，辅助收益分析。             |
| Mem               | 给 Codex 提供个人或团队知识上下文。           |
| Monday.com        | 通过 MCP 连接 Monday 工作流和项目数据。      |
| MotherDuck        | 连接 AI 助手到 MotherDuck 数据环境。      |
| Network Solutions | 查询 Network Solutions 域名相关信息。    |
| Omni Analytics    | 用语义查询方式分析 Omni 数据。              |
| Otter.ai          | 连接 Otter 会议转写和笔记。               |
| Pipedrive         | 同步 Pipedrive 交易、客户和销售流程。        |
| Pylon             | 访问 Pylon 客户支持和服务上下文。            |
| Ranked AI         | 提供行业领先 AI/市场相关信息。               |
| Razorpay          | 连接 Razorpay 账户，查询支付和交易信息。       |
| Read AI           | 带入会议智能、纪要和参会洞察。                 |
| Responsive        | 辅助响应 RFP、问卷、招标等资料。              |
| Semrush           | 通过 Semrush MCP 获取结构化 SEO 和营销数据。 |
| SignNow           | 更快获取文档签署，处理签署流程上下文。             |
| SkyWatch          | 搜索和探索卫星影像。                      |
| Streak            | Gmail 内置 CRM，处理客户关系和销售邮件。       |
| Teamwork.com      | 同步 Teamwork 项目和任务。              |
| United Rentals    | 查询或处理工程/作业设备租赁信息。               |
| Waldo             | 用 AI 生成策略研究、市场分析或商业洞察。          |
| Windsor.ai        | 连接营销与广告数据，做分析和归因。               |

#### 7.4.7 研究与金融信息插件

适合文献研究、投融资信息、政策新闻、金融市场和专业数据库查询。

| 插件                      | 可以做什么                            |
| ----------------------- | -------------------------------- |
| LaTeX Tectonic          | 内置 LaTeX 编译，适合论文、公式文档和学术排版。      |
| Life Science Research   | 处理生命科学方向的研究资料和问答。                |
| Zotero                  | 查找论文、添加引用、管理参考文献。                |
| Alpaca                  | 市场/交易相关信息（截图描述为"停止盯盘"）。          |
| Binance                 | 访问币安相关行情、账户或加密资产信息。              |
| CB Insights             | 作为私有市场研究入口，查询公司、行业和投资信息。         |
| Cube                    | 连接 Cube 语义层/数据模型进行查询。            |
| Daloopa                 | 提供高质量金融数据、公司指标或模型数据。             |
| Dow Jones Factiva       | 访问 Factiva 新闻、公司和市场资料。           |
| GovTribe                | 搜索政府合同、授标、采购机会。                  |
| Moody's                 | 信用和风险情报。                         |
| Morningstar             | 投资和基金研究。                         |
| MT Newswires            | 获取实时全球财经新闻。                      |
| Particl Market Research | 市场、产品、零售或竞争数据研究。                 |
| PitchBook               | 访问结构化私募市场、公司、投资和交易数据。            |
| PolicyNote              | 查询政策、政府事务和监管信息。                  |
| Quartr                  | 访问一手投资者关系数据，如财报电话会、公告。           |
| Readwise                | 接入 Readwise/Reader 中的阅读、标注和知识资料。 |
| Scite                   | 基于论文引用关系给出有依据的学术回答。              |
| Taxdown                 | 西语税务问答和申报辅助。                     |
| Third Bridge            | 接入专家网络和关键研究上下文。                  |
| Tinman AI               | 辅助贷款人员处理金融、客户或审批相关信息。            |

---

## 八、Skills & CLI

### 8.1 什么是 Skill

Skill 是预定义的**指令集**，告诉 Codex 在特定场景下如何工作：
- 每个 Skill 是一个 `SKILL.md` 文件 + 可选的脚本/模板
- 当用户提到触发词时自动激活
- 支持自定义 Skill 扩展 Codex 能力

### 8.2 Skill 合集网站

- **[LobeHub](https://lobehub.com)**：开源 Skill 合集，包含大量社区贡献的 Skills
- GitHub 上搜索 `codex-skill` 或 `SKILL.md` 可找到更多

### 8.3 创建自己的 Skill

Skill 文件结构：
```
my-skill/
├── SKILL.md          # 核心：触发条件 + 指令
├── scripts/          # 可选：辅助脚本
└── references/       # 可选：参考资料
```

`SKILL.md` 核心内容：
- **name**：技能名称
- **description**：触发描述（关键词）
- **instructions**：具体指令，告诉 Codex 如何工作

### 8.4 推荐 CLI 工具

除了 Codex CLI 本身，以下 CLI 工具可以增强工作流：
- **gh**（GitHub CLI）：管理 Issue、PR、Actions
- **defuddle**：提取网页纯净内容
- 其他可通过 npm 全局安装的工具

---

## 九、MCP

**MCP（Model Context Protocol）** 是 Codex 连接外部数据源和工具的协议。

### 9.1 MCP 位置

- **全局**：`C:\Users\<用户名>\.codex\.mcp.json`
- **项目级**：项目根目录 `.mcp.json`

### 9.2 MCP 安装

通过 `.mcp.json` 配置文件声明 MCP 服务器：
```json
{
  "mcpServers": {
    "my-server": {
      "type": "stdio",
      "command": "node",
      "args": ["path/to/server.js"]
    }
  }
}
```

### 9.3 MCP 扩展

MCP 可以扩展的能力：
- 连接数据库（查询、写入）
- 接入外部 API（天气、翻译、搜索）
- 工具集成（Jira、Slack、飞书等）
- 自定义工作流

---

## 十、自动化任务

### 方式 1：自动化面板

在 Codex 设置中创建自动化任务：

1. 打开设置 → 自动化
2. 新建自动化功能 / 选择需求相近的官方样例
3. 设置触发条件（定时、事件等）和执行内容

### 方式 2：日常语言交互设置

直接在对话中用自然语言描述：

```
帮我创建一个自动化任务，每周一早上9点。
任务内容是：自动执行热门项目推荐的skill，产出一篇图文发到飞书群里
```

> [!NOTE]
> 自动化功能类似 Cron Job + AI Agent 的组合，可以让 Codex 定时执行重复性任务。

---

## 扩展学习

- 📺 **视频教程**：[全网最全！60分钟全面掌握 Claude Code～【附完整文档】](https://www.bilibili.com/video/BV1NvRyBzEhq)
- 📄 **关联文档**：[[Claude Code完全教程]]

---

## 十一、Codex++ 软件应用与登录方式

Codex++ 是面向 Codex App 的外部增强启动器和管理工具。它不直接修改 Codex 原始安装文件，而是通过外部 launcher 启动 Codex，并注入增强脚本或 provider 配置。

### 11.1 Codex++ 的核心作用

- **启动增强版 Codex**：从 `Codex++` 入口启动后，会在 Codex 页面中注入增强功能。
- **打开管理器**：从 `Codex++ 管理工具` 进入配置面板，管理中转、provider、脚本、更新和诊断。
- **中转注入**：把模型请求切到自定义 Base URL 和 API Key。
- **官方登录态保留**：不替代官方 ChatGPT 登录，而是复用官方 Codex 已经保存的登录态。
- **增强功能**：常见功能包括插件入口解锁、会话删除、Markdown 导出、provider 同步等。

> [!warning]
> Codex++ 不是官方登录器，不应该在 Codex++ 里输入 OpenAI / ChatGPT 账号密码。官方账号登录仍然交给官方 Codex 或浏览器完成。

### 11.2 登录方式总览

| 模式 | 身份来源 | 模型请求来源 | 是否需要官方 ChatGPT 登录 | 适合场景 |
| :--- | :--- | :--- | :--- | :--- |
| 官方账号模式 | ChatGPT 官方账号 | OpenAI / Codex 官方通道 | 需要 | 日常稳定使用、插件能力、账号权益 |
| 纯 API 模式 | API Key | 自定义 Base URL / API Key | 不需要 | 自动化、CLI、只关心模型调用 |
| 官方账号 + API Key 混合模式 | ChatGPT 官方账号 | 自定义 Base URL / API Key | 需要 | 保留插件和账号能力，同时走中转或独立 API |

可以用一句话区分：

```text
官方登录 = 身份和账号能力
API / 中转 = 模型请求通道
Codex++ = 帮你切换和管理通道
```

### 11.3 官方账号模式

官方账号模式就是正常使用 ChatGPT / Codex 登录。

流程：

1. 打开官方 Codex App，或在终端执行：
   ```powershell
   codex login
   ```
2. 浏览器会打开官方登录页面。
3. 登录 ChatGPT / OpenAI 账号。
4. 登录成功后，Codex 会在本地保存登录态。

本地登录态常见位置：

- Windows：`C:\Users\<用户名>\.codex\auth.json`
- 当前机器示例：`C:\Users\Liuzwei\.codex\auth.json`

适合：

- 希望使用 ChatGPT Plus / Pro / Business / Enterprise 账号权益。
- 需要 Codex App 插件入口、账号能力、官方工作区权限。
- 不想额外配置 API Key。

### 11.4 纯 API 模式

纯 API 模式不依赖 ChatGPT 官方账号登录，而是让 Codex 使用 API Key 调用模型。

API Key 可以来自：

- OpenAI 官方 Platform API Key。
- 第三方中转站 API Key。
- 兼容 OpenAI 协议的私有服务。

Codex++ 会把相关配置写入 Codex 的配置文件，例如：

```toml
model_provider = "CodexPlusPlus"

[model_providers.CodexPlusPlus]
name = "CodexPlusPlus"
wire_api = "responses"
requires_openai_auth = true
base_url = "https://example.com/v1"
experimental_bearer_token = "sk-..."
```

适合：

- 使用第三方中转服务。
- 希望模型请求单独计费。
- 做 CLI / 自动化 / 批处理任务。
- 不需要官方 ChatGPT 工作区能力。

> [!warning]
> 纯 API 模式下，Codex App 可能会认为没有 ChatGPT 官方账号登录，因此插件入口或部分账号相关能力可能不可用。

### 11.5 官方账号 + API Key 混合模式

混合模式的核心是：

```text
账号身份 / 插件入口 / ChatGPT 权限：走官方 ChatGPT 登录
模型请求 / Base URL / API Key：走 Codex++ 配置的 API 通道
```

它不一定需要 OpenAI 官方 API Key，也可以使用第三方中转 Key。关键前提是：目标服务要兼容 Codex 需要的接口协议，优先选择 Responses API 兼容接口。

使用流程：

1. **先登录官方 Codex**
   - 打开官方 Codex App，或执行：
     ```powershell
     codex login
     ```
   - 在浏览器完成 ChatGPT 官方账号登录。
   - 确认 Codex 已识别账号，插件入口可用。

2. **打开 Codex++ 管理器**
   - 进入中转注入 / Provider 配置页面。
   - 新建或选择一个供应商配置。
   - 模式选择类似“官方登录 + 混入 API Key”。

3. **填写 API 配置**
   - `Base URL`：OpenAI 官方 API 地址或第三方中转地址。
   - `API Key`：对应平台的 Key。
   - `Protocol`：优先选 `Responses`；如果中转只支持旧接口，再选 `Chat Completions`。

4. **应用配置并从 Codex++ 启动**
   - Codex++ 保留官方 ChatGPT 登录态。
   - 同时把模型请求切换到配置的 API 通道。

可以理解为：

```text
先拿到官方身份牌
再让 Codex++ 给模型请求换一条路
最后从 Codex++ 入口启动 Codex
```

### 11.6 三种模式怎么选

| 使用目标 | 推荐模式 | 原因 |
| :--- | :--- | :--- |
| 日常写代码、整理笔记、使用官方插件 | 官方账号模式 | 稳定，账号能力完整 |
| 想保留插件，同时使用中转额度 | 官方账号 + API Key 混合模式 | 身份和模型请求分离 |
| 只想用便宜中转或自定义模型 | 纯 API 模式 | 配置直接，和官方账号解耦 |
| CI/CD、脚本、批量任务 | 纯 API 模式 | 更适合自动化和可控计费 |
| 官方账号登录失败但 API 可用 | 纯 API 模式 | 可绕开账号登录链路 |
| API 请求失败但官方账号正常 | 官方账号模式 | 先回到官方通道排除中转问题 |

### 11.7 常见排查边界

- **插件入口不可用**：优先检查官方 ChatGPT 登录态，而不是 API Key。
- **模型请求失败**：优先检查 Codex++ 的 Base URL、API Key、协议类型和模型名。
- **混合模式无效**：先确认官方 Codex 已登录，再确认 Codex++ 是否从增强入口启动。
- **切回官方后仍走 API**：在 Codex++ 管理器中清除 API 模式，检查 `config.toml` 中是否还有自定义 `model_provider`。
- **Key 不要写进日志**：只记录 Key 是否存在和认证结果，不记录完整 Key。

> [!NOTE]
> 最稳的使用习惯是：官方账号能力交给 Codex 官方登录；API、中转和 provider 切换交给 Codex++ 管理。这样排查问题时边界最清楚。
