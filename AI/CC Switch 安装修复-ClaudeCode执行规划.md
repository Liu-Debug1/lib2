---
title: CC Switch 安装修复-ClaudeCode执行规划
date: 2026-06-10
tags:
  - Windows
  - CC-Switch
  - MSI
  - ClaudeCode
  - 故障排查
status: ready
---

# CC Switch 安装修复-ClaudeCode执行规划

## 一、问题背景

当前安装 CC Switch 时弹窗报错：

- 安装器：`CC Switch Setup`
- 报错信息：`Invalid Drive: E:\`
- 用户判断：以前把 CC Switch 安装在 `E:`，后来直接把安装目录复制/移动到 `D:`，导致 Windows Installer 仍保存旧盘符信息。

初步判断这是 **MSI 安装状态损坏 / 注册表残留路径仍指向不存在的 `E:\`**。目标不是简单删除文件，而是让系统恢复到可以正常安装 CC Switch 的状态。

> [!warning] 执行边界
> ClaudeCode 执行时不要用 `Win32_Product` 查询 MSI，它会触发已安装 MSI 产品的自修复，可能制造新问题。只用注册表、`msiexec`、文件系统和快捷方式检查。

## 二、目标

1. 找出 CC Switch 旧安装状态中仍指向 `E:\` 的残留。
2. 优先尝试让 MSI 走正常卸载/修复流程。
3. 如果 MSI 已损坏，再分层清理用户态文件、快捷方式、AppData 和注册表残留。
4. 清理后重新安装 CC Switch，确保安装器不再报 `Invalid Drive: E:\`。
5. 给用户留下可复查的日志和清理记录。

## 三、能力路由

ClaudeCode 推荐使用：

| 能力 | 是否需要 | 用途 |
|------|----------|------|
| PowerShell | 必须 | 查询进程、文件、快捷方式、注册表、运行 `msiexec` |
| 管理员 PowerShell | 可能需要 | 删除 `HKLM` 下的卸载项或安装器残留 |
| 文件系统工具 | 必须 | 检查 `D:\CCswitch`、AppData、开始菜单、桌面快捷方式 |
| 注册表查询 | 必须 | 检查 MSI 卸载项、安装路径、旧 `E:\` 引用 |
| 网络 | 非必须 | 只有需要重新下载最新版安装包时才联网 |
| 浏览器 | 非必须 | 只在需要打开下载页时使用 |

## 四、执行总原则

- 先诊断、备份、记录，再修改。
- 能走 MSI 正常卸载就先走 MSI 正常卸载。
- 如果只是 `E:` 盘符缺失，优先用临时盘符恢复法让卸载器完成工作。
- 如果 `msiexec` 返回 `1605`、`1610`、`1603` 等异常，再进入手动清理。
- 删除注册表前必须导出备份。
- 清理分两层：先用户态残留，再管理员注册表残留。
- 最后必须重新运行安装器验证，而不是只确认文件删掉。

## 五、阶段 1：诊断与证据收集

### 1.1 确认系统盘符和 `E:` 是否存在

```powershell
Get-PSDrive -PSProvider FileSystem | Select-Object Name,Root,Used,Free
Test-Path "E:\"
Test-Path "D:\CCswitch"
Test-Path "D:\CC Switch"
```

预期判断：

- 如果 `E:\` 不存在，`Invalid Drive: E:\` 很可能来自旧 MSI 路径。
- 如果 `D:\CCswitch` 存在，说明手动搬迁后的程序目录可能还在。

### 1.2 检查 CC Switch 进程

```powershell
Get-Process | Where-Object {
    $_.ProcessName -match "cc|switch|ccswitch"
} | Select-Object Id,ProcessName,Path
```

如果发现 `cc-switch.exe` 正在运行：

```powershell
Stop-Process -Id <PID> -Force
```

### 1.3 查询卸载注册表项

同时检查 64 位、32 位和当前用户卸载表：

```powershell
$roots = @(
  "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall",
  "HKLM:\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall",
  "HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall"
)

$items = foreach ($root in $roots) {
  if (Test-Path $root) {
    Get-ChildItem $root | ForEach-Object {
      $p = Get-ItemProperty $_.PsPath -ErrorAction SilentlyContinue
      if ($p.DisplayName -match "CC Switch|CCSwitch|ccswitch") {
        [PSCustomObject]@{
          KeyPath = $_.Name
          PSPath = $_.PsPath
          DisplayName = $p.DisplayName
          DisplayVersion = $p.DisplayVersion
          InstallLocation = $p.InstallLocation
          UninstallString = $p.UninstallString
          ModifyPath = $p.ModifyPath
          Publisher = $p.Publisher
        }
      }
    }
  }
}

$items | Format-List
```

重点看：

- `InstallLocation` 是否仍是 `E:\CCswitch\`
- `UninstallString` 是否是 `MsiExec.exe /X{...}`
- 产品 GUID 是否存在，例如历史记录中出现过 `{1717B6FC-E25A-49C8-AF50-B6E661C6A188}`

### 1.4 搜索快捷方式和用户态残留

```powershell
$paths = @(
  "$env:APPDATA\com.ccswitch.desktop",
  "$env:LOCALAPPDATA\com.ccswitch.desktop",
  "$env:APPDATA\Microsoft\Windows\Start Menu\Programs\CC Switch",
  "$env:USERPROFILE\Desktop",
  "D:\CCswitch",
  "D:\CC Switch"
)

$paths | ForEach-Object {
  [PSCustomObject]@{
    Path = $_
    Exists = Test-Path $_
  }
}
```

如需进一步搜索快捷方式：

```powershell
Get-ChildItem "$env:USERPROFILE\Desktop","$env:APPDATA\Microsoft\Windows\Start Menu\Programs" -Recurse -ErrorAction SilentlyContinue |
  Where-Object { $_.Name -match "CC Switch|cc-switch|ccswitch" } |
  Select-Object FullName,Length,LastWriteTime
```

## 六、阶段 2：优先方案 A，临时恢复 `E:` 盘符后正常卸载

如果 `E:\` 不存在，先尝试创建临时盘符，让 MSI 不再因为旧盘符缺失而直接失败。

### 2.1 创建临时 `E:` 映射

```powershell
New-Item -ItemType Directory -Force "C:\Temp\FakeE"
subst E: "C:\Temp\FakeE"
Test-Path "E:\"
```

> [!NOTE]
> 如果 `E:` 已被其他设备占用，不要执行 `subst E:`。直接跳到阶段 3。

### 2.2 尝试正常卸载旧版本

如果阶段 1 找到了产品 GUID：

```powershell
msiexec /x {产品GUID} /L*v "$env:TEMP\ccswitch-uninstall.log"
```

或者用注册表里的 `UninstallString` 执行卸载，但必须加日志：

```powershell
Start-Process msiexec.exe -ArgumentList "/x {产品GUID} /L*v `"$env:TEMP\ccswitch-uninstall.log`"" -Wait
```

检查结果：

```powershell
Get-Content "$env:TEMP\ccswitch-uninstall.log" -Tail 80
```

判断：

- 如果卸载成功，进入阶段 4 验证残留。
- 如果返回 `1605`，说明 MSI 认为产品不存在但注册表残留还在，进入阶段 3。
- 如果返回 `1603` 或仍报 `Invalid Drive`，保留日志，进入阶段 3。

### 2.3 移除临时盘符

```powershell
subst E: /D
Test-Path "E:\"
```

## 七、阶段 3：备用方案 B，手动清理残留

只有在方案 A 失败或没有可用卸载项时执行。

### 3.1 先备份注册表

如果找到的卸载项在 `HKLM`：

```powershell
reg export "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\{产品GUID}" "$env:USERPROFILE\Desktop\ccswitch-uninstall-key-backup.reg" /y
```

如果在 `WOW6432Node`：

```powershell
reg export "HKLM\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\{产品GUID}" "$env:USERPROFILE\Desktop\ccswitch-uninstall-key-backup-wow6432.reg" /y
```

如果在 `HKCU`：

```powershell
reg export "HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\{产品GUID}" "$env:USERPROFILE\Desktop\ccswitch-uninstall-key-backup-hkcu.reg" /y
```

### 3.2 清理用户态残留

```powershell
$userPaths = @(
  "$env:APPDATA\com.ccswitch.desktop",
  "$env:LOCALAPPDATA\com.ccswitch.desktop",
  "$env:APPDATA\Microsoft\Windows\Start Menu\Programs\CC Switch",
  "$env:USERPROFILE\Desktop\cc-switch.exe - 快捷方式.lnk"
)

foreach ($path in $userPaths) {
  if (Test-Path -LiteralPath $path) {
    Remove-Item -LiteralPath $path -Recurse -Force
  }
}
```

如果桌面快捷方式名称不同，用搜索结果中的实际路径删除。

### 3.3 清理手动搬迁后的安装目录

先确认路径确实是 CC Switch，而不是误删其他目录：

```powershell
Get-ChildItem -LiteralPath "D:\CCswitch" -Force -ErrorAction SilentlyContinue | Select-Object Name,Length,LastWriteTime
```

确认后删除：

```powershell
Remove-Item -LiteralPath "D:\CCswitch" -Recurse -Force
```

如果实际目录是 `D:\CC Switch`，按实际路径处理。

### 3.4 删除孤儿卸载注册表项

优先只删除明确匹配 `CC Switch` 的卸载项，不做全注册表大清扫。

```powershell
Remove-Item -LiteralPath "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\{产品GUID}" -Recurse -Force
```

如果卸载项在 `WOW6432Node` 或 `HKCU`，按实际 `PSPath` 删除：

```powershell
Remove-Item -LiteralPath "<阶段1查到的PSPath>" -Recurse -Force
```

> [!warning]
> 删除 `HKLM` 需要管理员 PowerShell。ClaudeCode 如果没有管理员权限，应提示用户以管理员方式运行对应命令，不要静默失败后继续假装清理完成。

## 八、阶段 4：清理后验证

### 4.1 验证文件和目录

```powershell
$checkPaths = @(
  "D:\CCswitch",
  "D:\CC Switch",
  "$env:APPDATA\com.ccswitch.desktop",
  "$env:LOCALAPPDATA\com.ccswitch.desktop",
  "$env:APPDATA\Microsoft\Windows\Start Menu\Programs\CC Switch"
)

$checkPaths | ForEach-Object {
  [PSCustomObject]@{
    Path = $_
    Exists = Test-Path -LiteralPath $_
  }
}
```

预期：清理目标全部为 `False`。

### 4.2 验证注册表卸载项

重新运行阶段 1.3 的注册表查询。

预期：

- 查不到 `CC Switch`
- 查不到 `InstallLocation = E:\CCswitch\`

### 4.3 验证进程

```powershell
Get-Process | Where-Object {
    $_.ProcessName -match "cc|switch|ccswitch"
} | Select-Object Id,ProcessName,Path
```

预期：没有 CC Switch 进程。

## 九、阶段 5：重新安装

1. 使用新的 CC Switch 安装包。
2. 右键安装包，选择“以管理员身份运行”。
3. 安装路径建议选择当前真实存在的目录，例如：
   - `D:\CCswitch`
   - 或默认路径
4. 不要再手动复制整个安装目录到另一个盘。
5. 如果要迁移安装位置，必须先卸载，再重新安装到目标路径。

安装后验证：

```powershell
Get-ChildItem "D:\CCswitch" -Force -ErrorAction SilentlyContinue

$roots = @(
  "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall",
  "HKLM:\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall",
  "HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall"
)

foreach ($root in $roots) {
  if (Test-Path $root) {
    Get-ChildItem $root | ForEach-Object {
      $p = Get-ItemProperty $_.PsPath -ErrorAction SilentlyContinue
      if ($p.DisplayName -match "CC Switch|CCSwitch|ccswitch") {
        $p | Select-Object DisplayName,DisplayVersion,InstallLocation,UninstallString
      }
    }
  }
}
```

预期：

- 安装器不再弹出 `Invalid Drive: E:\`
- `InstallLocation` 指向真实存在的路径
- 开始菜单/桌面快捷方式可以正常启动

## 十、异常分支

### 10.1 如果 `subst E:` 后仍然报错

说明 MSI 残留不只是盘符存在性问题，可能还保存了更具体的旧路径或安装源。处理方式：

1. 保留安装/卸载日志。
2. 执行阶段 3 手动清理。
3. 清理后重启电脑。
4. 再重新安装。

### 10.2 如果删除注册表被拒绝

处理方式：

1. 确认 PowerShell 是否管理员运行。
2. 只对明确匹配 `CC Switch` 的 key 操作。
3. 不要尝试删除整个 `Uninstall` 根目录。

### 10.3 如果新安装包仍引用 `E:\`

可能原因：

- 安装器读取了用户环境变量中的旧路径。
- Windows Installer 缓存中仍有旧产品信息。
- 仍有其他 `CC Switch` 相关注册表项指向 `E:\`。

进一步检查：

```powershell
reg query HKCU /f "E:\CCswitch" /s
reg query HKLM /f "E:\CCswitch" /s
reg query HKCU /f "CC Switch" /s
reg query HKLM /f "CC Switch" /s
```

只删除能确认属于 CC Switch 的项；无法确认的项先截图或导出后询问用户。

## 十一、交付物

ClaudeCode 完成后应交付：

- 诊断结果：是否发现旧 `E:\` 注册表路径。
- 执行方式：方案 A 正常卸载成功，还是方案 B 手动清理。
- 清理列表：删除了哪些文件夹、快捷方式、注册表项。
- 日志位置：`ccswitch-uninstall.log` 或安装日志路径。
- 验证结果：重新安装是否成功，是否还出现 `Invalid Drive: E:\`。

## 十二、给 ClaudeCode 的最终执行提示词

```text
请按这个规划修复 Windows 上 CC Switch 安装报错 `Invalid Drive: E:\` 的问题。

先不要直接删除注册表。请先检查 CC Switch 进程、D 盘残留目录、AppData 残留、开始菜单/桌面快捷方式，以及 HKLM/HKCU 卸载注册表项。不要使用 Win32_Product。

如果 E: 不存在，优先创建临时 subst E: 映射，尝试用注册表中的产品 GUID 走 msiexec 正常卸载，并输出日志。如果 msiexec 返回 1605/1603 或仍失败，再备份注册表并手动清理明确属于 CC Switch 的残留。

清理完成后重新验证：文件路径不存在、卸载注册表项不存在、没有 CC Switch 进程，然后重新运行安装包确认不再报 `Invalid Drive: E:\`。整个过程请记录执行命令、结果和任何需要用户管理员授权的步骤。
```

