# obsidian-note-style 交接记录

> [!summary] 当前状态
> 已完成 `obsidian-note-style` 的 **12-tile moodboard 参考板 fallback 版**。  
> 原计划是生成 12 张原创参考图，但两个生成通道都被环境限制拦住，因此当前版本使用公开单图参考作为临时审阅板。原始生成 prompt 已完整保存在 `spec.json`，后续可直接重跑生成原创版。

## 一、任务目标

为未来的 `obsidian-note-style` skill 做一组视觉风格参考，用来指导长期 Obsidian 笔记的内容与格式风格。

目标风格：

- **干净、分层、可读**
- **工程实践导向**
- **适合长期复习和复用**
- **克制专业，不做花哨装饰**

面向对象：

- 机械/车辆工程研究生
- C/C++、嵌入式、ROS、线控底盘方向学习者
- 使用 Obsidian 做长期知识管理的人

## 二、能力路由与计划过程

本任务涉及：

| 能力 | 用途 | 当前结果 |
| :-- | :-- | :-- |
| `Creative Production:moodboard-explorer` | 创建 moodboard 和 review surface | 已使用 |
| `creative_production_mcp` | 渲染内联 moodboard widget | 已成功渲染 |
| `Fal` | 备用图片生成通道 | 失败，余额耗尽 |
| 本地 Codex exec image batch | Creative Production 默认图片生成通道 | 失败，Windows 权限拒绝 |
| Obsidian/Skill 管理规则 | 后续创建 `obsidian-note-style` skill 时使用 | 尚未执行 |

> [!note] Skill 路径约定
> 个人 Skill 源库：`D:\桌面\Codex\LIU-Skill-repository\`  
> Codex 全局运行入口：`C:\Users\Liuzwei\.codex\skills\`  
> 若后续创建 `obsidian-note-style`，建议先写入个人库，再同步到 Codex 全局入口。

## 三、已生成文件

| 文件/目录 | 作用 |
| :-- | :-- |
| `D:\桌面\Ob_Learning\outputs\moodboards\obsidian-note-style\spec.json` | 12 张原创图的正式生成 spec，后续可直接重跑 |
| `D:\桌面\Ob_Learning\outputs\moodboards\obsidian-note-style\run\` | Creative Production moodboard runtime |
| `D:\桌面\Ob_Learning\outputs\moodboards\obsidian-note-style\run\data\stream.json` | 当前 moodboard 可见 tile 数据 |
| `D:\桌面\Ob_Learning\outputs\moodboards\obsidian-note-style\run\data\stream-static.json` | 静态 stream 备份 |
| `D:\桌面\Ob_Learning\outputs\moodboards\obsidian-note-style\run\run-state.json` | moodboard widget 状态 |
| `D:\桌面\Ob_Learning\outputs\moodboards\obsidian-note-style\run\latest-action.json` | 最近一次 append 操作记录 |

当前 `stream.json` 状态：

- 可见 tile 数量：`12`
- 缺失 `imageUrl` 数量：`0`
- 所有 tile 都有 `sourceImageUrl`

## 四、当前 12 个 tile

| 序号 | Tile | 设计意图 |
| :-- | :-- | :-- |
| 1 | `Structured Engineering Notebook` | 标题层级、边注、结构化笔记表面 |
| 2 | `Callout Layering System` | callout、警告、提示、例子的层次感 |
| 3 | `Code And Concept Pairing` | 代码块和概念解释并置 |
| 4 | `ASCII Diagram Feeling` | ASCII 框图、流程图、模块关系 |
| 5 | `Engineering Decision Table` | 参数表、对比表、方案权衡 |
| 6 | `Debugging Trail` | 嵌入式问题排查、故障定位流程 |
| 7 | `Long-Term Knowledge Archive` | 长期知识沉淀、卡片化复习 |
| 8 | `Review And Recall Surface` | 间隔复习、错题、记忆触发 |
| 9 | `Technical Callout Cards` | note/tip/warning/example 的视觉区分 |
| 10 | `Vehicle Control Systems Map` | 线控底盘、控制链路、系统结构 |
| 11 | `Readable Markdown Craft` | Markdown 文档的代码块、表格、侧栏节奏 |
| 12 | `Calm Builder Desk` | 长时间学习/构建笔记的整体氛围 |

## 五、实现过程

### 5.1 创建原始 moodboard spec

已创建：

```text
D:\桌面\Ob_Learning\outputs\moodboards\obsidian-note-style\spec.json
```

这个文件包含 12 个原创生成 prompt，每个 prompt 都明确要求：

- 单一画面
- 非拼贴
- 非网格
- 无可读文字
- 无 logo
- 非 UI 截图

### 5.2 使用 moodboard-explorer 生成 runtime

执行过的命令：

```powershell
python "C:\Users\Liuzwei\.codex\plugins\cache\openai-curated-remote\creative-production\0.1.23\skills\moodboard-explorer\scripts\create_mood_board.py" `
  --spec "D:\桌面\Ob_Learning\outputs\moodboards\obsidian-note-style\spec.json" `
  --output "D:\桌面\Ob_Learning\outputs\moodboards\obsidian-note-style\run" `
  --force
```

结果：

- 成功生成 moodboard runtime
- 初始 `stream.json` 有 12 个待生成 prompt tile

### 5.3 尝试本地 Creative Production 生成

启动过本地 moodboard server：

```powershell
$env:CREATIVE_PRODUCTION_PYTHON='python'
$env:CREATIVE_PRODUCTION_WORKSPACE='D:\桌面\Ob_Learning'
$env:CREATIVE_PRODUCTION_IMAGE_MAX_CONCURRENCY='12'
$env:CREATIVE_PRODUCTION_IMAGE_MAX_ATTEMPTS='2'
Start-Process -FilePath 'node' -ArgumentList 'server.mjs' -WorkingDirectory "D:\桌面\Ob_Learning\outputs\moodboards\obsidian-note-style\run" -WindowStyle Hidden
```

服务曾成功启动在：

```text
http://127.0.0.1:8794
```

但调用 `/api/images` 时失败：

```text
PermissionError: [WinError 5] 拒绝访问
```

判断：

- 这是本地 `codex exec` 子进程启动权限问题
- 不是 prompt 质量问题
- 不是 moodboard spec 问题

### 5.4 尝试 Fal 备用生成

已尝试模型：

```text
fal-ai/flux-pro/kontext/text-to-image
```

失败原因：

```text
Queue submit failed (403): User is locked. Reason: Exhausted balance.
```

判断：

- Fal 账户余额耗尽
- 需要充值后才能继续用 Fal 生成原创图

### 5.5 fallback：公开参考图 moodboard

由于两个生成通道都不可用，已使用公开单图参考完成一个临时 review board。

已通过 `append_moodboard_board_items` 写入 12 个参考 tile，随后过滤掉原始 12 个空 prompt tile，使当前 board 只显示 12 个有图参考。

> [!warning] 当前版本性质
> 当前 moodboard 是 **reference-backed fallback**，不是最终原创生成版。  
> 它适合用于讨论视觉方向、提炼 `obsidian-note-style` 的写作规则，但不应当被当作最终生成资产。

## 六、后续继续建议

### 方案 A：继续创建 `obsidian-note-style` Skill

如果 Claude Code 接下来直接创建 skill，建议目标路径：

```text
D:\桌面\Codex\LIU-Skill-repository\obsidian-skills\obsidian-note-style\SKILL.md
```

同步路径：

```text
C:\Users\Liuzwei\.codex\skills\obsidian-note-style\SKILL.md
```

建议 skill 内容包括：

- 长期笔记的内容结构原则
- 粗体、斜体、代码块、表格、callout 的使用规则
- 技术笔记常见模板：概念解释、工具教程、故障排查、方案对比、实验记录、代码学习
- 与现有 skills 的分工：
  - `obsidian-markdown`：Obsidian 语法
  - `obsidian-contentList`：长段落列表化
  - `obsidian-titiled`：标题编号
  - `obisidian-liu-emojiStyle`：克制 emoji 美化
  - `obsidian-note-style`：整体阅读体验和长期笔记风格

### 方案 B：恢复原创图生成

如果要生成真正的 12 张原创图：

1. 优先修复本地 Codex exec 权限问题，或改用可运行的图片生成通道。
2. 直接复用 `spec.json`。
3. 重新运行 moodboard server 的 `/api/images` 批量生成。
4. 生成成功后，替换 fallback reference tile。
5. 再用 `render_moodboard_board_widget` 渲染 run。

> [!tip] 不需要重写 prompt
> 12 张原创图的 prompt 已经在 `spec.json` 里，后续重点是恢复生成通道，而不是重新构思视觉方向。

### 方案 C：把 moodboard 结论转成写作规范

建议从 12 个 tile 提炼出这几条长期规则：

- 笔记不是聊天记录，要整理成 **结论 + 解释 + 示例 + 踩坑 + 复盘**
- 表格用于字段、参数、方案、优缺点对比
- callout 用于结论、提示、警告、示例、复盘
- 代码块必须带语言标识，并且只放可执行/可复用内容
- 对 C/C++、嵌入式、ROS、控制系统，优先使用 ASCII 框图解释结构和数据流
- 粗体只强调关键词、工程判断和强约束，不能整段乱加
- 避免大段文字墙、标题碎片化、装饰性排版

## 七、给 Claude Code 的最短接手提示

```text
请继续这个任务：基于 D:\桌面\Ob_Learning\outputs\moodboards\obsidian-note-style\CLAUDE_CODE_HANDOFF.md 和 spec.json，创建 obsidian-note-style skill。

目标：
1. 在 D:\桌面\Codex\LIU-Skill-repository\obsidian-skills\obsidian-note-style\ 创建 SKILL.md。
2. 同步到 C:\Users\Liuzwei\.codex\skills\obsidian-note-style\。
3. Skill 要指导长期 Obsidian 技术笔记的内容结构和格式风格。
4. 默认风格：克制专业、工程实践导向、复习友好。
5. 重点写清粗体、斜体、代码块、表格、callout、ASCII 框图、Mermaid 的使用边界。
6. 与 obsidian-markdown、obsidian-contentList、obsidian-titiled、obisidian-liu-emojiStyle 做好分工，不重复职责。
```

## 八、已知问题

| 问题 | 状态 | 建议 |
| :-- | :-- | :-- |
| 本地 Creative Production 图片生成失败 | 未解决 | 检查 Windows 权限、Codex exec 子进程启动权限 |
| Fal 图片生成失败 | 未解决 | Fal 账户余额耗尽，需要充值 |
| 当前 moodboard 不是原创图 | 已知 | 作为临时参考板使用，后续可重跑 |
| `stream.json` 曾出现 BOM | 已修复 | 已用 Node 重写为无 BOM JSON |

## 九、验证记录

最后一次验证结果：

```text
Items: 12
MissingImageUrl: 0
MissingSource: 0
```

当前 12 个标题：

```text
Structured Engineering Notebook
Callout Layering System
Code And Concept Pairing
ASCII Diagram Feeling
Engineering Decision Table
Debugging Trail
Long-Term Knowledge Archive
Review And Recall Surface
Technical Callout Cards
Vehicle Control Systems Map
Readable Markdown Craft
Calm Builder Desk
```
