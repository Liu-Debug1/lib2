---
title: ROS 入门
tags:
  - ROS
  - 嵌入式
  - 机器人
---

# ROS 入门

> [!tip] 一句话理解 ROS
> ROS 不是“把所有机器人功能都写好的大软件”，而是一套让机器人程序更容易**拆开、通信、复用、测试和集成**的工程框架。

ROS 可以先理解为：

```text
ROS = 通信机制 + 工具链 + 功能包生态 + 工程组织方式
```

从工程实践看，ROS 更适合放在上位机、工控机或域控制器里做复杂计算、任务调度、算法集成和系统调试。真正强实时的电机控制、采样中断、保护逻辑，通常还是放在 MCU / RTOS / 下位机里完成。

## 一、ROS 概述

### 1.1 ROS 的核心价值

可以把 ROS 想成机器人软件里的“插线板 + 快递站 + 工具箱”：

- **插线板**：每个功能模块都拆成独立节点，后期便于替换和维护。
- **快递站**：节点之间不需要直接调用对方，只要按约定格式收发消息。
- **工具箱**：调试、可视化、仿真、测试等常用工具已经准备好。

| 没有 ROS 的情况 | 使用 ROS 的情况 |
| :--- | :--- |
| 每个项目自己定义通信格式 | 大家按 `Topic`、`Service`、`Action` 等标准接口通信 |
| 算法和硬件强绑定 | 驱动、算法、控制模块可以拆开替换 |
| 换项目就大改代码 | 功能包可以迁移、组合、二次开发 |

> [!note] 工程理解
> ROS 的价值不在于“帮你写完机器人”，而在于让你写出来的模块能被别人用，也能把别人写好的模块接进自己的系统。

### 1.2 分布式：节点就是独立运行单元

ROS 是一个**基于进程的分布式框架**，运行单元叫 `Node`（节点）。一个节点通常就是一个独立进程，例如：

- 摄像头节点：采集图像。
- 识别节点：做目标检测。
- 控制节点：输出速度、转角等控制量。
- 可视化节点：在 `RViz` 中显示状态。

```text
摄像头 Node  --->  图像消息  --->  识别 Node
                                  |
                                  v
底盘控制 Node <--- 控制指令 <--- 路径规划 Node
```

节点不一定都跑在同一台电脑上，也可以分布在不同主机上：

```text
工控机：感知 / 规划 / RViz
   |
   |  网络通信
   v
下位机：底盘控制 / 电机驱动 / 传感器采集
```

> [!warning] 注意
> `Node` 不是普通函数调用。节点之间靠消息通信，天然适合分布式，但也会带来网络延迟、消息频率、时间同步等工程问题。

### 1.3 松耦合：只认接口，不管内部实现

ROS 中的功能通常封装成**功能包（package）**，功能包里再包含节点、消息定义、配置文件、启动文件等。

节点之间通过 ROS 标准 I/O 通信：

```text
发布者 Node  --Topic-->   订阅者 Node
服务端 Node <--Service--> 客户端 Node
动作服务端  <--Action-->  动作客户端
```

只要接口对得上，内部怎么实现并不重要：

- 感知节点可以用 C++ 写，也可以用 Python 写。
- 控制节点可以先用仿真版，后面再换成真实底盘版。
- 同一个 `/cmd_vel` 控制接口，可以接差速底盘、麦轮底盘、仿真机器人。

> [!tip] 类比
> ROS 的接口像汽车线束插头：只要针脚定义和电气协议一致，后面的模块可以换厂家、换版本，但整车系统还能接得上。

### 1.4 语言独立性

ROS 支持 C++、Python、Java 等语言。工程里最常用的是 C++ 和 Python：

| 语言 | 常见用途 |
| :--- | :--- |
| C++ | 实时性要求较高、计算量较大、底层驱动、控制算法 |
| Python | 快速验证、脚本工具、实验节点、简单逻辑 |

ROS 的做法是：先用中立的 `.msg`、`.srv`、`.action` 文件描述通信接口，再自动生成不同语言可用的代码。

```text
Python 识别节点  --->  /target_msg  --->  C++ 控制节点
```

### 1.5 生态工具

ROS 本身尽量保持精简，不把所有机器人能力都塞进核心框架，而是通过工具和功能包生态完成系统集成。

| 工具 / 机制 | 作用 |
| :--- | :--- |
| `RViz` | 3D 可视化，查看机器人模型、点云、路径、坐标系等 |
| 仿真工具 | 在真实硬件前验证算法和流程 |
| 消息查看工具 | 查看 Topic 数据、节点连接关系、通信频率 |
| 启动文件 | 一次性启动多个节点，管理复杂系统 |
| `rostest` | 单元测试和集成测试 |

学习 ROS 时不要只记命令，更要理解背后的工程思想：

- 如何把复杂系统拆成节点。
- 如何设计稳定的消息接口。
- 如何让模块可替换、可测试、可复用。
- 如何处理上位机和下位机之间的边界。

## 二、创建 HelloWorld 项目

### 2.1 创建工作空间并初始化

```bash
mkdir -p 自定义空间名称/src
cd 自定义空间名称
catkin_make
```

上述命令先创建 `src` 子目录，再调用 `catkin_make` 编译。编译后会生成 `build`、`devel` 等目录。

典型工作空间结构：

```text
demo01_ws/
├── src/
├── build/
└── devel/
```

### 2.2 创建 ROS 功能包

进入 `src` 目录，创建功能包并添加依赖：

```bash
cd src
catkin_create_pkg 自定义ROS包名 roscpp rospy std_msgs
```

| 依赖 | 语言 | 定位 |
| :--- | :--- | :--- |
| `roscpp` | C++ | 高性能库，运行效率高，但编码效率低 |
| `rospy` | Python | 开发效率高，适合对性能要求不高的脚本和实验节点 |
| `std_msgs` | 通用 | 标准消息库 |

### 2.3 编写 C++ 节点

进入功能包目录：

```bash
cd 自定义ROS包名
```

新建 `src/helloworld_c.cpp`：

```cpp
#include "ros/ros.h"

int main(int argc, char *argv[])
{
    // 执行 ROS 节点初始化
    ros::init(argc, argv, "hello");

    // 创建 ROS 节点句柄
    ros::NodeHandle n;

    // 控制台输出 hello world
    ROS_INFO("hello world!");

    return 0;
}
```

### 2.4 配置 CMakeLists.txt

在功能包的 `CMakeLists.txt` 中添加节点编译规则：

```cmake
add_executable(helloworld_c
  src/helloworld_c.cpp
)

target_link_libraries(helloworld_c
  ${catkin_LIBRARIES}
)
```

### 2.5 编译工作空间

回到工作空间根目录：

```bash
cd 自定义空间名称
catkin_make
```

编译通过后会在终端看到 `[100%]` 成功提示。

### 2.6 运行节点

1. 启动终端 1，启动 ROS Master：

```bash
roscore
```

2. 启动终端 2，导入工作空间环境并运行节点：

```bash
cd 工作空间
source ./devel/setup.bash
rosrun 包名 helloworld_c
```

执行成功后，终端会输出 `hello world!`。

> [!tip] 自动加载工作空间环境
> 如果每次都要使用同一个工作空间，可以把 `source` 命令追加到 `~/.bashrc`：
>
> ```bash
> echo "source ~/工作空间/devel/setup.bash" >> ~/.bashrc
> ```

## 三、ROS 集成开发环境搭建

### 3.1 安装 Terminator

ROS 开发经常需要同时打开多个终端，例如：

- `roscore`
- `rosrun`
- `rostopic`
- `roslaunch`

Ubuntu 自带终端在多窗口切换时不够方便，`Terminator` 可以在一个窗口内分屏管理多个终端会话。

安装命令：

```bash
sudo apt install terminator
```

添加到收藏夹：

1. 打开“显示应用程序”。
2. 搜索 `terminator`。
3. 右键选择“添加到收藏夹”。

常用快捷键：

| 快捷键 | 作用 |
| :--- | :--- |
| `Ctrl+Shift+O` | 水平分割，上下分屏 |
| `Ctrl+Shift+E` | 垂直分割，左右分屏 |
| `Alt+Up/Down/Left/Right` | 在分屏终端之间移动 |
| `Ctrl+Shift+W` | 关闭当前终端 |
| `Ctrl+Shift+Q` | 关闭当前窗口 |
| `Ctrl+Shift+X` | 最大化当前终端 |
| `Ctrl+Shift+C/V` | 复制 / 粘贴 |
| `Ctrl+Shift+T` | 打开新标签 |
| `F11` | 全屏开关 |

> [!note] Super 键
> `Super` 键一般就是键盘上的 `Win` 键。Terminator 还支持用 `Super+G` 绑定所有终端，实现广播输入。

### 3.2 安装 VS Code

VS Code 适合用来开发 ROS 的 C++ / Python 节点，核心优势是插件生态、代码补全、内置终端、CMake 支持和 Git 集成。

下载地址：

- 当前版本：<https://code.visualstudio.com/docs?start=true>
- 历史版本：<https://code.visualstudio.com/updates>

Ubuntu 推荐下载 `.deb` 安装包。命令行安装：

```bash
sudo dpkg -i xxxx.deb
```

如需卸载：

```bash
sudo dpkg --purge code
```

### 3.3 安装 ROS 开发插件

VS Code 用来写 ROS 节点时，主要提供：

- 代码补全：识别 ROS 头文件、消息类型和 C++ 语法。
- 工程跳转：快速定位函数、类、头文件。
- 内置终端：直接执行 `catkin_make`、`roscore`、`rosrun`。
- 编译任务：通过快捷键触发构建。

建议安装插件：

| 插件 | 作用 |
| :--- | :--- |
| `C/C++` | C++ 语法高亮、智能补全、调试和代码跳转 |
| `Chinese (Simplified) Language Pack for Visual Studio Code` | VS Code 中文语言包 |
| `CMake Tools` | 辅助配置和构建 CMake 工程 |
| `Python` | Python 代码补全、调试、格式化和单元测试 |
| `ROS` / `Robot Developer Extensions for ROS 1` | ROS 1 包、消息、节点相关辅助功能 |
| `Robot Developer Extensions for ROS 2` | ROS 2 项目开发辅助 |

> [!warning] ROS 插件选择
> 老教程中的 Microsoft `ROS` 插件可能已经不是唯一选择。ROS Noetic / Ubuntu 20.04 优先选择 ROS 1 相关插件；ROS 2 项目选择 ROS 2 相关插件。

### 3.4 使用 VS Code 打开 ROS 工作空间

进入 ROS 工作空间根目录后启动 VS Code：

```bash
cd xxx_ws
code .
```

示例：

```bash
cd ~/demo01_ws
code .
```

> [!NOTE] 工程目录选择原则
> 用 VS Code 打开的应该是**工作空间根目录**，不是单独打开某个 `src` 下的功能包。这样 VS Code 才更容易识别完整编译关系。

典型目录结构：

```text
demo01_ws/
├── .vscode/
│   ├── c_cpp_properties.json
│   ├── settings.json
│   └── tasks.json
├── src/
├── build/
└── devel/
```

### 3.5 配置 VS Code 编译任务

按 `Ctrl + Shift + B` 调用编译任务，选择 `catkin_make:build`。如果需要设置为默认构建任务，可以修改 `.vscode/tasks.json`：

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "catkin_make:debug",
      "type": "shell",
      "command": "catkin_make",
      "args": [],
      "group": {
        "kind": "build",
        "isDefault": true
      },
      "presentation": {
        "reveal": "always"
      },
      "problemMatcher": "$msCompile"
    }
  ]
}
```

配置含义：

- `label`：任务名称，显示在 VS Code 构建任务列表中。
- `type: shell`：在终端 shell 中执行命令。
- `command: catkin_make`：真正执行的构建命令。
- `args`：命令参数，例如 `-DCATKIN_WHITELIST_PACKAGES=xxx`。
- `isDefault: true`：设置为默认构建任务。
- `reveal: always`：构建时总是显示终端输出。

### 3.6 在 VS Code 中创建并运行节点

创建功能包：

```bash
cd ~/demo01_ws/src
catkin_create_pkg hello_vscode roscpp rospy std_msgs
```

> [!tip] 包名和节点名
> 包名建议用小写字母和下划线，例如 `hello_vscode`。节点可执行文件也建议保持类似命名，后面用 `rosrun 包名 节点名` 运行时更清晰。

新建 C++ 文件：

```text
demo01_ws/src/hello_vscode/src/hello_vscode_c.cpp
```

示例代码：

```cpp
/*
 * 控制台输出 HelloVSCode
 */
#include "ros/ros.h"

int main(int argc, char *argv[])
{
    setlocale(LC_ALL, "");

    // 执行节点初始化
    ros::init(argc, argv, "HelloVSCode");

    // 输出日志
    ROS_INFO("Hello VSCode");

    return 0;
}
```

在功能包的 `CMakeLists.txt` 中配置节点编译规则：

```cmake
add_executable(hello_vscode_c src/hello_vscode_c.cpp)

target_link_libraries(hello_vscode_c
  ${catkin_LIBRARIES}
)
```

编译工作空间：

```bash
cd ~/demo01_ws
catkin_make
```

运行节点：

```bash
roscore
```

新开终端：

```bash
cd ~/demo01_ws
source ./devel/setup.bash
rosrun hello_vscode hello_vscode_c
```

运行成功时，终端会看到类似输出：

```text
[ INFO] [1781316635.439881321]: Hello VSCode
```

> [!warning] 每个新终端都要重新 source
> 如果没有执行 `source ./devel/setup.bash`，系统可能找不到刚编译出来的 ROS 包或节点。

## 四、Launch 文件

### 4.1 Launch 文件的作用

`launch` 文件用于一次性启动多个 ROS 节点，适合管理复杂系统。

普通启动方式：

```text
终端 1：roscore
终端 2：rosrun 节点A
终端 3：rosrun 节点B
终端 4：rosrun 节点C
```

使用 `roslaunch` 后：

```text
一个 launch 文件
     |
     v
自动启动 ROS Master + 多个节点 + 参数配置
```

> [!note] 关键点
> 执行 `roslaunch` 时，如果当前没有运行 `roscore`，它会自动启动 ROS Master。因此可以简单理解为：`roslaunch` 包含了启动 `roscore` 的能力。

### 4.2 原始截图记录

![[Pasted image 20260613101959.png|500]]

![[Pasted image 20260613105358.png|500]]

![[Pasted image 20260613102622.png|500]]

## 五、常见问题

### 5.1 没有代码提示

修改 `.vscode/c_cpp_properties.json`，确认 C++ 标准设置为：

```json
"cppStandard": "c++17"
```

### 5.2 `main` 函数参数不能被 `const` 修饰

ROS 节点入口函数保持下面这种写法：

```cpp
int main(int argc, char *argv[])
```

### 5.3 `ROS_INFO` 输出中文乱码

在函数开头加入下面任意一句：

```cpp
setlocale(LC_CTYPE, "zh_CN.utf8");
```

或：

```cpp
setlocale(LC_ALL, "");
```

### 5.4 VS Code 或 VMware 卡顿

可参考原教程视频：

- [VMware 虚拟机经常性卡死、Hyper-V 冲突问题解决](https://www.bilibili.com/video/BV1sr42187Cb/?share_source=copy_web&vd_source=f4ecd7e50821fdecda2ed9065f0bb39c)

> [!warning] 注意 Ubuntu 版本
> 用 `lsb_release -a` 查看当前 Ubuntu 版本，不同 Ubuntu / ROS 组合对应的安装方式可能不同。

### 5.5 VMware Ubuntu 虚拟机磁盘扩容

详见：[[GpartedLiveISO扩容的笔记]]

### 5.6 Ubuntu 无法联网

方法 1：打开网络管理。

```bash
nmcli network on
```

方法 2：升级内核。可参考原教程视频：

- [Ubuntu 安装后，没有网络连接怎么办？](https://www.bilibili.com/video/BV11X4y1h7qN/?share_source=copy_web&vd_source=f4ecd7e50821fdecda2ed9065f0bb39c)

