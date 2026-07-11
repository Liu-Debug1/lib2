## Vscode自带快捷键
全部保存

| 快捷键                      | 功能                  | 对你的用处                      |
| :----------------------- | :------------------ | :------------------------- |
| **F12**                  | 跳转到定义               | 点击函数/变量，直接跳转到的定义处          |
| **Alt + ←**              | 返回上一处               | 跳转定义后，一键回到原来的位置            |
| **Alt + →**              | 前进到下一处              | 和上面相反，回到跳转后的位置             |
| **Ctrl + G**             | 跳转到指定行号             | 调试时，直接跳转到报错的行号             |
| **Ctrl + P**             | 快速打开文件              | 输入文件名，1 秒打开任何.c/.h 文件      |
| **Ctrl + Shift + F**     | 全局搜索                | 在整个 Keil 项目里搜索任何字符串        |
| **Ctrl + Tab**           | 切换已打开的文件            | 在多个代码文件之间快速切换              |
| **Ctrl + Shift + O**     | 跳转到文件内的函数           | 输入函数名，直接跳转到当前文件的某个函数       |
| **Ctrl + C / Ctrl + V**  | 复制 / 粘贴             | 不多说                        |
| **Ctrl + X**             | 剪切整行                | 光标在任意位置，直接剪切整行             |
| **Ctrl + D**             | 选中下一个相同的词           | 批量修改变量名，超级好用               |
| **Ctrl + /**             | 注释 / 取消注释           | 一键注释多行代码                   |
| **Shift + Alt + ↑/↓**    | 向上 / 向下复制行          | 快速复制一行代码                   |
| **Alt + ↑/↓**            | 向上 / 向下移动行          | 调整代码顺序，不用剪切粘贴              |
| **Ctrl + Shift + K**     | 删除整行                | 一键删除整行                     |
| **Ctrl + F4**            | 关闭本页                |                            |
| ***Ctrl + K  Ctrl + F*** | 选中内容格式化             |                            |
| ***Shift + Alt + F***    | 全局格式化               |                            |
| **`Ctrl + ,`**           | 打开设置                | 快速打开 VS Code 设置页面（JSON/UI） |
| **`Ctrl + K, Ctrl + S`** | 打开键盘快捷键设置           | 查看和自定义所有快捷键                |
| `Ctrl + Shift + [`       | 折叠当前块               |                            |
| `Ctrl + Shift + ]`       | 展开当前块               |                            |
| `Ctrl + K` → `Ctrl + 0`  | 折叠全部（递归）            |                            |
| `Ctrl + K` → `Ctrl + J`  | 展开全部（递归）            |                            |
| `Ctrl + K` → `Ctrl + 2`  | 折叠级别（如折叠第2层）（数字2~9） |                            |
| `Ctrl + K` → `Ctrl + ]`  | 展开级别                |                            |
| `Ctrl + K` → `Ctrl + -`  | 折叠所有区域（非递归，仅一级）     |                            |
| `Ctrl + K` → `Ctrl + +`  | 展开所有区域（非递归，仅一级）     |                            |


## 扩展区快捷键

## 字体样式设置

### 适用场景

- 想把 **VS Code 代码区字体**改成 `JetBrains Mono`
- 想把 **集成终端字体**一起统一
- 想把字体调细一点，比如从默认粗细改成 `280`

### 一、打开用户级配置

- 按 `Ctrl + Shift + P`
- 输入 `Preferences: Open User Settings (JSON)`
- 打开的就是 **用户级全局配置文件** `settings.json`

也可以直接打开下面这个文件：

`C:\Users\Liuzwei\AppData\Roaming\Code\User\settings.json`

> [!note]
> **用户级配置**是在当前 VS Code 安装内全局生效的。  
> 但 `Cursor`、`VS Code Insiders`、`VSCodium` 这些分支编辑器都有各自独立的 `settings.json`，**不会自动共用**。

### 二、常用字体字段

把下面这些字段加入 `settings.json` 即可。

```json
"editor.fontFamily": "'JetBrains Mono', Consolas, 'Courier New', monospace",
"editor.fontWeight": "280",
"editor.fontLigatures": true,
"editor.inlayHints.fontFamily": "'JetBrains Mono', Consolas, 'Courier New', monospace",
"terminal.integrated.fontFamily": "'JetBrains Mono', Consolas, 'Courier New', monospace",
"terminal.integrated.fontWeight": "280",
"scm.inputFontFamily": "'JetBrains Mono', Consolas, 'Courier New', monospace",
"notebook.output.fontFamily": "'JetBrains Mono', Consolas, 'Courier New', monospace"
```

### 三、每个字段是干什么的

| 字段                               | 作用             | 备注         |
| :------------------------------- | :------------- | :--------- |
| `editor.fontFamily`              | 代码编辑区字体        | 最核心        |
| `editor.fontWeight`              | 代码编辑区字重        | 数值越小越细     |
| `editor.fontLigatures`           | 是否开启编程连字       | `true` 为开启 |
| `editor.inlayHints.fontFamily`   | 参数提示、小字提示字体    | 统一观感       |
| `terminal.integrated.fontFamily` | VS Code 集成终端字体 | 和代码区分开控制   |
| `terminal.integrated.fontWeight` | 集成终端字重         | 可单独调细      |
| `scm.inputFontFamily`            | Git 提交信息输入框字体  | 不常改，但可统一   |
| `notebook.output.fontFamily`     | Notebook 输出区字体 | 做实验/脚本时更整齐 |

### 四、这次实际使用的配置思路

- **字体名**用 `JetBrains Mono`
- 后面保留 `Consolas`、`Courier New`、`monospace` 作为**兜底字体**
- 字重从默认的 `normal/400` 改成 `280`
- **编辑区**和**集成终端**统一成同一套字体

> [!tip]
> 这样配的好处：
> - 代码区和终端观感统一
> - 即使某台电脑没装 `JetBrains Mono`，也不会直接显示异常
> - 想微调粗细时，只需要改 `fontWeight`

### 五、为什么改完有时看起来没变化

> [!warning]
> 常见原因：
> - 改的是 `VS Code`，但实际打开的是 `Cursor`
> - 当前窗口用了别的 `Profile`，被 Profile 配置覆盖
> - 改的是代码区字体，但你观察的是左侧资源管理器、菜单栏、设置页
> - 修改后没有重载窗口

### 六、生效方式

- 按 `Ctrl + Shift + P`
- 输入 `Developer: Reload Window`
- 回车后重新加载窗口

### 七、补充说明

> [!note]
> `editor.fontFamily` 只影响 **代码编辑区**，不影响整个软件外壳界面。

- 如果你平时主力是 `Cursor`，还要单独改它自己的配置文件：`C:\Users\Liuzwei\AppData\Roaming\Cursor\User\settings.json`
- 如果 `Cursor` 开了多个 `Profile`，还要检查：`C:\Users\Liuzwei\AppData\Roaming\Cursor\User\profiles\`

### 八、推荐记忆版本

最常用、最值得记住的其实就这四项，属于 **最小可用配置**：

```json
"editor.fontFamily": "'JetBrains Mono', Consolas, 'Courier New', monospace",
"editor.fontWeight": "280",
"terminal.integrated.fontFamily": "'JetBrains Mono', Consolas, 'Courier New', monospace",
"terminal.integrated.fontWeight": "280"
```

