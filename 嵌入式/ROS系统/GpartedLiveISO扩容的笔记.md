# GpartedLiveISO扩容的笔记

## 一、结论

- VMware 中给虚拟磁盘增加容量后，Ubuntu 里通常只会看到一段“未分配空间”，系统根分区 `/` 不会自动变大。
- 如果 GParted 中根分区 `/` 后面没有紧贴“未分配空间”，就不能直接扩容。
- 对于 `extended + logical partition` 结构，需要先扩展外层扩展分区，再扩展里面真正的根分区。
- 正在运行的 Ubuntu 不能稳定调整自己的根分区 `/`，推荐用 **GParted Live ISO** 启动后操作。

## 二、GParted Live ISO 是什么

- GParted Live ISO 是一个专门用于磁盘分区管理的小型启动系统。
- 它不是安装在 Ubuntu 里的普通软件，而是一个 `.iso` 镜像文件。
- 把 ISO 挂载到虚拟机光驱后，可以让虚拟机从它启动。
- 这样原 Ubuntu 系统不会运行，根分区 `/` 不会被占用，GParted 就能安全调整分区。

## 三、下载 GParted Live ISO

1. 打开 GParted 官网下载页：
	- `https://gparted.org/livecd.php`
2. 下载最新版的 `gparted-live-xxx.iso`。
3. ISO 文件保存到 Windows 主机本地，例如：
	- `D:\软件\gparted-live-xxx.iso`

> [!NOTE] 也可以用 Ubuntu 安装镜像
> 如果已经有 Ubuntu 安装 ISO，也可以从安装镜像启动后选择 `Try Ubuntu`，再打开 GParted 操作。但专门扩容时，GParted Live ISO 更轻量。

## 四、操作前准备

1. 正常关闭 Ubuntu：

```bash
poweroff
```

2. 在 VMware 中给虚拟机做快照。
3. 确认 VMware 已经把虚拟磁盘容量调大。

> [!warning] 一定先做快照
> 分区调整属于高风险操作。快照相当于后悔药，操作失败时可以回滚。

## 五、挂载 GParted Live ISO

1. 关闭虚拟机。
2. 打开 VMware 虚拟机设置。
3. 选择 `CD/DVD`。
4. 选择 `Use ISO image file`。
5. 选择下载好的 `gparted-live-xxx.iso`。
6. 勾选 `Connect at power on`。
7. 启动虚拟机。

如果启动后还是进入原 Ubuntu，说明没有从 ISO 启动，需要调整启动顺序，让光驱优先启动。

## 六、进入 GParted Live

启动过程中一般保持默认选项即可：

```text
GParted Live Default settings
Don't touch keymap
Start X to use GParted automatically
```

进入桌面后，通常会自动打开 GParted。

## 七、确认当前分区结构

在 GParted 右上角确认当前磁盘是 `/dev/sda`。

本次扩容对应的典型结构是：

```text
/dev/sda 40G
├─ /dev/sda1        EFI/boot 启动分区，不动
├─ /dev/sda2        extended 扩展分区
│  └─ /dev/sda5     ext4，挂载点为 /
└─ 未分配空间        新增出来的磁盘空间
```

关键判断：

- `/dev/sda5` 是真正的 Ubuntu 根分区。
- `/dev/sda2` 是包住 `/dev/sda5` 的扩展分区容器。
- 未分配空间如果在 `/dev/sda2` 外面，`/dev/sda5` 无法直接使用它。

## 八、扩容操作

### 8.1 扩大 `/dev/sda2 extended`

1. 选中 `/dev/sda2 extended`。
2. 右键选择 `Resize/Move`。
3. 把右边界拖到最右侧。
4. 或把 `Free space following` 改为 `0`。
5. 点击 `Resize/Move`。

这一步的作用是让扩展分区容器先吃掉右侧未分配空间。

### 8.2 扩大 `/dev/sda5 ext4`

1. 选中 `/dev/sda5 ext4`。
2. 右键选择 `Resize/Move`。
3. 把右边界拖到最右侧。
4. 或把 `Free space following` 改为 `0`。
5. 点击 `Resize/Move`。

这一步才是真正扩大 Ubuntu 根分区 `/`。

### 8.3 应用操作

1. 点击顶部绿色对勾 `Apply All Operations`。
2. 确认执行。
3. 等待操作完成。
4. 中途不要强制关机或重启。

## 九、重新正常启动 Ubuntu

1. 关闭 GParted Live。
2. 关闭虚拟机。
3. 在 VMware 设置中移除或取消挂载 GParted Live ISO。
4. 从原来的虚拟硬盘启动 Ubuntu。

启动成功后，检查根分区容量：

```bash
df -h /
```

查看完整分区结构：

```bash
lsblk
```

如果 `/` 的容量已经变大，说明扩容成功。

## 十、原理复盘

扩容前：

```text
[sda1 boot] [sda2 extended [sda5 /]] [未分配空间]
```

扩容后：

```text
[sda1 boot] [sda2 extended [sda5 / + 新增空间]]
```

核心逻辑：

- 先扩 `/dev/sda2`：扩大容器边界。
- 再扩 `/dev/sda5`：扩大真正的根分区。
- 最后重启 Ubuntu：让系统从扩容后的虚拟硬盘正常启动。

## 十一、常见坑

- 不要动 `/dev/sda1`，它通常是启动相关分区。
- 不要在原 Ubuntu 正在运行时强行调整 `/` 根分区。
- 不要忘记点击绿色对勾，GParted 中的调整默认只是加入待执行队列。
- 如果重启后又进入 GParted Live，说明 ISO 还挂在光驱里，需要取消挂载。
