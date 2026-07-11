---
title: ROS 入门
tags:
  - ROS
  - 嵌入式
  - 机器人
---
# 第一章 概述与环境搭建

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

| 没有 ROS 的情况   | 使用 ROS 的情况                             |
| :----------- | :------------------------------------- |
| 每个项目自己定义通信格式 | 大家按 `Topic`、`Service`、`Action` 等标准接口通信 |
| 算法和硬件强绑定     | 驱动、算法、控制模块可以拆开替换                       |
| 换项目就大改代码     | 功能包可以迁移、组合、二次开发                        |

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

## 二、ROS 环境搭建

### 2.1 创建 HelloWorld 项目

#### 2.1.1 创建工作空间并初始化

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

#### 2.1.2 创建 ROS 功能包

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

#### 2.1.3 编写 C++ 节点

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

#### 2.1.4 配置 CMakeLists.txt

在功能包的 `CMakeLists.txt` 中添加节点编译规则：

```cmake
add_executable(helloworld_c
  src/helloworld_c.cpp
)

target_link_libraries(helloworld_c
  ${catkin_LIBRARIES}
)
```

#### 2.1.5 编译工作空间

回到工作空间根目录：

```bash
cd 自定义空间名称
catkin_make
```

编译通过后会在终端看到 `[100%]` 成功提示。

#### 2.1.6 运行节点

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

### 2.2 ROS 集成开发环境搭建

#### 2.2.1 安装 Terminator

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

| 快捷键                      | 作用        |
| :----------------------- | :-------- |
| `Ctrl+Shift+O`           | 水平分割，上下分屏 |
| `Ctrl+Shift+E`           | 垂直分割，左右分屏 |
| `Alt+Up/Down/Left/Right` | 在分屏终端之间移动 |
| `Ctrl+Shift+W`           | 关闭当前终端    |
| `Ctrl+Shift+Q`           | 关闭当前窗口    |
| `Ctrl+Shift+X`           | 最大化当前终端   |
| `Ctrl+Shift+C/V`         | 复制 / 粘贴   |
| `Ctrl+Shift+T`           | 打开新标签     |
| `F11`                    | 全屏开关      |

> [!note] Super 键
> `Super` 键一般就是键盘上的 `Win` 键。Terminator 还支持用 `Super+G` 绑定所有终端，实现广播输入。

#### 2.2.2 安装 VS Code

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

#### 2.2.3 安装 ROS 开发插件

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

#### 2.2.4 使用 VS Code 打开 ROS 工作空间

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

#### 2.2.5 配置 VS Code 编译任务

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

#### 2.2.6 在 VS Code 中创建并运行节点

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

### 2.3 Launch 文件

#### 2.3.1 Launch 文件的作用

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

#### 2.3.2 需求场景

一个程序可能需要同时启动多个 ROS 节点。以小乌龟案例为例，如果要控制乌龟运动，通常需要分别启动：

- `roscore`
- 乌龟界面节点
- 键盘控制节点
- 自己编写的业务节点

如果每次都手动用多个终端执行 `rosrun`，效率很低，也不利于工程部署。官方推荐的优化方式是使用 `launch` 文件，一次性启动多个 ROS 节点。

#### 2.3.3 创建 Launch 文件

在 VS Code 中创建 launch 文件的一般步骤：

1. 选中功能包，右键添加 `launch` 文件夹。
2. 选中 `launch` 文件夹，右键添加 `.launch` 文件。
3. 编辑 `.launch` 文件内容。

示例目录：

```text
demo02_ws/
└── src/
    └── hello_vscode/
        └── launch/
            └── start_turtle.launch
```

#### 2.3.4 编写 Launch 文件

示例：

```xml
<launch>
    <node pkg="helloworld" type="demo_hello" name="hello" output="screen" />
    <node pkg="turtlesim" type="turtlesim_node" name="t1" />
    <node pkg="turtlesim" type="turtle_teleop_key" name="key1" />
</launch>
```

节点标签说明：

| 属性       | 含义                        |
| -------- | ------------------------- |
| `node`   | 表示 launch 文件中包含的某个节点      |
| `pkg`    | 节点所在功能包                   |
| `type`   | 被运行的节点文件，也就是可执行文件名        |
| `name`   | 给节点起的运行时名称                |
| `output` | 设置日志输出目标，`screen` 表示输出到终端 |

> [!note] Launch 文件的本质
> `launch` 文件不是重新写节点逻辑，而是把多个节点的启动方式集中写成一份配置。工程中常用它管理多节点启动顺序、参数和命名。

#### 2.3.5 运行 Launch 文件

运行格式：

```bash
roslaunch 包名 launch文件名
```

示例：

```bash
cd ~/demo02_ws
source ./devel/setup.bash
roslaunch hello_vscode start_turtle.launch
```

运行后会启动 `roslaunch` 服务，并自动检查 ROS 日志目录。如果当前没有运行 `roscore`，`roslaunch` 会自动启动 ROS Master。

### 2.4 常见问题

#### 2.4.1 没有代码提示

修改 `.vscode/c_cpp_properties.json`，确认 C++ 标准设置为：

```json
"cppStandard": "c++17"
```

#### 2.4.2 `main` 函数参数不能被 `const` 修饰

ROS 节点入口函数保持下面这种写法：

```cpp
int main(int argc, char *argv[])
```

#### 2.4.3 `ROS_INFO` 输出中文乱码

在函数开头加入下面任意一句：

```cpp
setlocale(LC_CTYPE, "zh_CN.utf8");
```

或：

```cpp
setlocale(LC_ALL, "");
```

#### 2.4.4 VS Code 或 VMware 卡顿

可参考原教程视频：

- [VMware 虚拟机经常性卡死、Hyper-V 冲突问题解决](https://www.bilibili.com/video/BV1sr42187Cb/?share_source=copy_web&vd_source=f4ecd7e50821fdecda2ed9065f0bb39c)

> [!warning] 注意 Ubuntu 版本
> 用 `lsb_release -a` 查看当前 Ubuntu 版本，不同 Ubuntu / ROS 组合对应的安装方式可能不同。

#### 2.4.5 VMware Ubuntu 虚拟机磁盘扩容

详见：[[GpartedLiveISO扩容的笔记]]

#### 2.4.6 Ubuntu 无法联网

方法 1：打开网络管理。

```bash
nmcli network on
```

方法 2：升级内核。可参考原教程视频：

- [Ubuntu 安装后，没有网络连接怎么办？](https://www.bilibili.com/video/BV11X4y1h7qN/?share_source=copy_web&vd_source=f4ecd7e50821fdecda2ed9065f0bb39c)

## 三、ROS 架构

### 3.1 ROS 文件系统

ROS 工程不是随便堆文件，而是按“工作空间 → 功能包 → 节点/消息/配置”的层级组织。

```text
catkin_ws/
├── src/                  # 源码空间：放功能包
│   └── package_name/
│       ├── CMakeLists.txt
│       ├── package.xml
│       ├── src/          # C++ 源文件
│       ├── scripts/      # Python 脚本
│       ├── msg/          # 自定义消息
│       ├── srv/          # 自定义服务
│       └── launch/       # launch 启动文件
├── build/                # 编译中间文件
└── devel/                # 开发空间：生成可运行环境
```

![[Pasted image 20260617184327.png|500]]

| 文件 / 目录 | 作用 | 工程注意点 |
| :--- | :--- | :--- |
| `package.xml` | 声明包名、版本、作者、依赖 | 依赖没写全时，别人换机器编译容易失败 |
| `CMakeLists.txt` | 描述如何编译节点、生成消息、链接库 | C++ 节点、自定义消息都要在这里配置 |
| `src/` | 放 C++ 节点源码 | 节点源码不建议直接丢在包根目录 |
| `scripts/` | 放 Python 节点脚本 | Python 脚本要有可执行权限 |
| `msg/` | 放 `.msg` 自定义消息文件 | 文件名必须和 `CMakeLists.txt` 完全一致 |
| `launch/` | 放 `.launch` 文件 | 用于一次性启动多个节点 |

#### 3.1.1 `package.xml`

`package.xml` 重点看依赖关系。比如自定义消息一般需要：

```xml
<build_depend>message_generation</build_depend>
<exec_depend>message_runtime</exec_depend>
```

![[Pasted image 20260617190202.png|500]]

#### 3.1.2 `CMakeLists.txt`

`CMakeLists.txt` 决定“哪些源码会被编译、哪些消息会被生成、节点链接哪些库”。

![[Pasted image 20260617190401.png|500]]

> [!warning] 常见坑
> `package.xml` 管依赖声明，`CMakeLists.txt` 管实际构建。两个文件要配套改，只改其中一个经常会导致编译找不到包、找不到消息头文件或节点无法生成。

### 3.2 ROS 文件系统常用命令

ROS 提供了一组命令帮助定位功能包和文件，避免在复杂工作空间里手动找路径。

| 命令 | 作用 | 示例 |
| :--- | :--- | :--- |
| `rospack list` | 列出当前环境可找到的所有功能包 | `rospack list` |
| `rospack find 包名` | 查找某个功能包路径 | `rospack find turtlesim` |
| `roscd 包名` | 进入某个功能包目录 | `roscd turtlesim` |
| `rosls 包名` | 查看某个功能包内容 | `rosls turtlesim` |
| `rosed 包名 文件名` | 编辑功能包中的文件 | `rosed turtlesim Color.msg` |

![[Pasted image 20260617191727.png|500]]
![[Pasted image 20260617191739.png|500]]
![[Pasted image 20260617191831.png|500]]

> [!note] 关于端口
> 指定 ROS Master 端口号不算入门阶段高频操作，先掌握默认 `ROS_MASTER_URI=http://主机IP:11311` 的含义即可。

![[Pasted image 20260617191845.png|500]]

### 3.3 ROS 计算图

ROS 计算图描述的是运行时的通信关系：有哪些节点、有哪些话题、谁在发布、谁在订阅。

```text
Publisher Node  --Topic /fang-->  Subscriber Node
       |                              |
       |                              v
       └---------- ROS Master 负责发现关系，不负责转发数据
```

![[Pasted image 20260617193149.png|500]]
![[Pasted image 20260617193300.png|500]]

| 概念 | 含义 | 入门理解 |
| :--- | :--- | :--- |
| `Node` | 节点，独立运行的进程 | 一个功能模块 |
| `Topic` | 话题，异步消息通道 | 广播式数据流 |
| `Message` | 消息，话题中传输的数据结构 | 通信协议字段 |
| `Service` | 服务，同步请求-响应 | 问一次，答一次 |
| `Action` | 动作，带反馈的长任务 | 导航、机械臂动作常用 |
| `ROS Master` | 名称注册与发现中心 | 让节点互相找到对方 |

# 第二章 ROS 通信机制

> [!tip] 核心结论
> ==通信机制是 ROS 的核心==。学 ROS 不是只学命令，而是学会把系统拆成节点，并用稳定的消息接口把节点连接起来。

![[Pasted image 20260618053545.png|500]]

## 一、话题通信

### 1.1 话题通信总览

📌 **一句话理解**：话题通信就是“一个节点发布消息，另一个或多个节点订阅消息”的异步通信方式。

话题通信适合 ==单向、异步、持续发送== 的数据，例如传感器数据、底盘速度指令、状态广播。

#### 1.1.1 通信模型

```text
发布方 Publisher
      |
      |  Topic：/fang
      v
订阅方 Subscriber
```

工程上可以这样理解：

- **发布方**只管把数据发到某个 `Topic`。
- **订阅方**只管订阅同名 `Topic` 并解析消息。
- **发布方和订阅方不直接调用彼此**，因此耦合度低。
- 一个话题可以有多个发布者和多个订阅者，但工程中要避免多个发布者同时写同一控制指令导致责任不清。
- 适用场景是不断更新、少逻辑处理的数据传输，例如激光雷达、摄像头、GPS、底盘状态和速度指令。

![[Pasted image 20260618055952.png|500]]

#### 1.1.2 核心角色

话题通信中的三个核心角色如下：

| 角色 | 作用 | 示例 |
| :--- | :--- | :--- |
| `Master` | 管理话题注册和发布订阅匹配 | 只负责发现关系，不转发业务数据 |
| `Talker` | 发布者，向话题发送消息 | 发布 `/fang` 文本消息 |
| `Listener` | 订阅者，从话题接收消息 | 订阅 `/fang` 并打印 |

#### 1.1.3 连接建立流程

🛠️ 连接建立流程：

1. `Talker` 向 `Master` 注册：我能发布 `/fang`。
2. `Listener` 向 `Master` 注册：我要订阅 `/fang`。
3. `Master` 把 `Talker` 的地址告诉 `Listener`。
4. `Listener` 和 `Talker` 直接建立 TCP 连接。
5. 后续数据在发布者和订阅者之间直接传输，`Master` 不再转发数据。

> [!note] 工程理解
> `Master` 主要负责**发现关系**，不是数据中转站。发布者和订阅者建立连接后，数据在两者之间直接传输，不是每帧都经过 `Master`。

#### 1.1.4 工程检查点

✅ 实现话题通信时真正需要关注四件事：

- **话题名是否一致**：例如发布 `/fang`，订阅也必须订阅 `/fang`。
- **发布者实现是否正确**：是否创建 `Publisher`，是否调用 `publish()`。
- **订阅者实现是否正确**：是否创建 `Subscriber`，是否调用 `ros::spin()`。
- **消息类型是否完全一致**：发布 `std_msgs/String`，订阅也必须按 `std_msgs/String` 接收。

### 1.2 话题通信基本操作（C++）

🎯 **示例目标**：发布方持续向 `/fang` 话题发送字符串，订阅方接收并打印。

#### 1.2.1 编写发布方

发布方的核心任务是：==创建发布者对象，并在循环中持续发布消息==。

实现步骤：

1. 包含头文件：`ros/ros.h` 和具体消息类型头文件。
2. 初始化 ROS 节点：`ros::init(...)`。
3. 创建节点句柄：`ros::NodeHandle`。
4. 创建发布者对象：`nh.advertise<消息类型>(话题名, 队列长度)`。
5. 编写发布循环：填充消息并调用 `publish()`。

```cpp
#include "ros/ros.h"
#include "std_msgs/String.h"

#include <sstream>

int main(int argc, char *argv[])
{
    setlocale(LC_ALL, "");

    // 初始化 ROS 节点
    ros::init(argc, argv, "erGouZi");

    // 创建节点句柄
    ros::NodeHandle nh;

    // 创建发布者对象：话题名为 fang，队列长度为 10
    ros::Publisher pub = nh.advertise<std_msgs::String>("fang", 10);

    // 以 10 Hz 的频率发布数据
    ros::Rate rate(10);
    std_msgs::String msg;
    int count = 0;

    while (ros::ok())
    {
        count++;

        std::stringstream ss;
        ss << "hello---->" << count;
        msg.data = ss.str();

        pub.publish(msg);
        ROS_INFO("发布的数据是：%s", ss.str().c_str());

        rate.sleep();
    }

    return 0;
}
```

关键 API：

| API | 作用 |
| :--- | :--- |
| `ros::init(argc, argv, "erGouZi")` | 初始化节点并设置节点名 |
| `ros::NodeHandle nh` | 创建节点句柄，用于和 ROS 系统交互 |
| `nh.advertise<std_msgs::String>("fang", 10)` | 创建发布者，发布 `std_msgs/String` 类型消息 |
| `pub.publish(msg)` | 向话题发布消息 |
| `ros::Rate rate(10)` | 控制循环频率为 `10 Hz` |

#### 1.2.2 编写订阅方

订阅方的核心任务是：==创建订阅者对象，并通过回调函数处理收到的数据==。

实现步骤：

1. 包含头文件：`ros/ros.h` 和具体消息类型头文件。
2. 初始化 ROS 节点：`ros::init(...)`。
3. 创建节点句柄：`ros::NodeHandle`。
4. 创建订阅者对象：`nh.subscribe(话题名, 队列长度, 回调函数)`。
5. 编写回调函数，处理订阅到的数据。
6. 调用 `ros::spin()`，持续等待回调触发。

```cpp
#include "ros/ros.h"
#include "std_msgs/String.h"

void doMsg(const std_msgs::String::ConstPtr &msgs)
{
    ROS_INFO("翠花订阅的数据：%s", msgs->data.c_str());
}

int main(int argc, char *argv[])
{
    setlocale(LC_ALL, "");

    ros::init(argc, argv, "cuiHua");
    ros::NodeHandle nh;

    // 订阅 fang 话题，队列长度为 10，收到消息后调用 doMsg
    ros::Subscriber sub = nh.subscribe("fang", 10, doMsg);

    // 持续等待回调函数被触发
    ros::spin();

    return 0;
}
```

关键 API：

| API | 作用 |
| :--- | :--- |
| `nh.subscribe("fang", 10, doMsg)` | 订阅 `fang` 话题，并绑定回调函数 |
| `doMsg(...)` | 收到消息后自动执行的回调函数 |
| `ros::spin()` | 进入循环，持续处理回调 |

#### 1.2.3 编译与运行

编译运行分为两步：

- 在 `CMakeLists.txt` 中声明可执行文件和链接库。
- 启动 `roscore`，再分别运行发布方和订阅方节点。

在功能包 `CMakeLists.txt` 中添加：

```cmake
add_executable(demo01_pub src/demo01_pub.cpp)
add_executable(demo02_sub src/demo02_sub.cpp)

target_link_libraries(demo01_pub
  ${catkin_LIBRARIES}
)

target_link_libraries(demo02_sub
  ${catkin_LIBRARIES}
)
```

运行步骤：

1. 终端 1 启动 ROS Master：

```bash
roscore
```

2. 终端 2 启动发布方：

```bash
cd 工作空间
source ./devel/setup.bash
rosrun 包名 demo01_pub
```

3. 终端 3 启动订阅方：

```bash
cd 工作空间
source ./devel/setup.bash
rosrun 包名 demo02_sub
```

4. 调试话题：

```bash
rostopic list
rostopic echo /fang
rostopic info /fang
rostopic hz /fang
```

> [!warning] 发布方启动后订阅方收不到最开始几帧是正常现象
> ROS 话题连接建立需要一点时间。普通话题默认不会补发历史数据，所以订阅方晚启动时，前面已经发布的消息不会再收到。

### 1.3 自定义 `msg` 消息

📌 **使用场景**：当标准消息类型不够用时，通过 `.msg` 文件定义自己的消息结构，例如人员信息、车辆状态、底盘控制指令等。

#### 1.3.1 为什么需要自定义消息

`std_msgs` 封装了一些基础消息类型，例如 `String`、`Int32`、`Bool`、`Empty`。这些消息通常只有一个 `data` 字段，适合简单数据传输。

如果要表达下面这类结构化数据，就应该定义自定义消息：

- 人员信息：姓名、年龄、身高。
- 车辆状态：速度、档位、故障码。
- 底盘控制指令：目标速度、目标转角、控制模式。

#### 1.3.2 `.msg` 字段格式

`.msg` 文件本质上是文本文件，每一行描述一个字段：

```msg
字段类型 字段名
```

常用字段类型：

| 类型 | 说明 | 示例 |
| :--- | :--- | :--- |
| 整型 | `int8`、`int16`、`int32`、`int64`、`uint8`、`uint16`、`uint32`、`uint64` | `uint16 age` |
| 浮点型 | `float32`、`float64` | `float64 height` |
| 字符串 | `string` | `string name` |
| 时间类型 | `time`、`duration` | `time stamp` |
| 其他消息类型 | 引用其他 `.msg` 文件 | `std_msgs/Header header` |
| 数组 | 变长数组 `type[]`，定长数组 `type[N]` | `float64[] points` |

💡 `Header` 是 ROS 中常见的特殊字段，通常包含**时间戳**和**坐标系信息**，常放在传感器消息第一行。

#### 1.3.3 自定义消息配置流程

自定义消息的基本流程：

1. 在功能包下创建 `msg` 目录。
2. 按固定格式编写 `.msg` 文件。
3. 修改 `package.xml`，添加消息生成和运行依赖。
4. 修改 `CMakeLists.txt`，配置消息生成规则。
5. 编译工作空间，生成 C++ / Python 可以调用的中间文件。

#### 1.3.4 创建消息文件

在功能包下创建 `msg/Person.msg`：

```msg
string name
uint16 age
float64 height
```

目录结构应为：

```text
plumbing_pub_sub/
├── CMakeLists.txt
├── package.xml
├── msg/
│   └── Person.msg
└── src/
    ├── demo01_pub.cpp
    └── demo02_sub.cpp
```

> [!warning] 文件名必须完全一致
> Linux 区分大小写和拼写。`Person.msg`、`Persion.msg`、`person.msg` 是不同文件。若 `CMakeLists.txt` 写了 `Persion.msg`，但实际文件叫 `Person.msg`，就会报 `message file not found`。

#### 1.3.5 修改 `package.xml`

添加消息生成依赖：

```xml
<build_depend>message_generation</build_depend>
<exec_depend>message_runtime</exec_depend>
```

如果自定义消息字段里使用了 `std_msgs` 等外部消息类型，也要保证对应依赖存在。

#### 1.3.6 修改 CMakeLists.txt

核心配置如下：

```cmake
find_package(catkin REQUIRED COMPONENTS
  roscpp
  rospy
  std_msgs
  message_generation
)

add_message_files(
  FILES
  Person.msg
)

generate_messages(
  DEPENDENCIES
  std_msgs
)

catkin_package(
  CATKIN_DEPENDS roscpp rospy std_msgs message_runtime
)
```

如果 C++ 节点要使用自定义消息，还建议给节点添加生成依赖：

```cmake
add_executable(demo01_pub src/demo01_pub.cpp)
add_executable(demo02_sub src/demo02_sub.cpp)

add_dependencies(demo01_pub ${PROJECT_NAME}_generate_messages_cpp)
add_dependencies(demo02_sub ${PROJECT_NAME}_generate_messages_cpp)

target_link_libraries(demo01_pub
  ${catkin_LIBRARIES}
)

target_link_libraries(demo02_sub
  ${catkin_LIBRARIES}
)
```

> [!note] 为什么要加 `add_dependencies`
> 自定义消息会先生成 C++ 头文件，例如 `plumbing_pub_sub/Person.h`。如果节点编译早于消息生成，就可能出现头文件找不到的问题。

#### 1.3.7 编译并验证消息

```bash
cd ~/demo03_ws
catkin_make
source ./devel/setup.bash
rosmsg show plumbing_pub_sub/Person
```

如果修改过 `.msg`、`package.xml` 或 `CMakeLists.txt` 后仍然报旧错误，可以清理缓存后重编译：

```bash
cd ~/demo03_ws
rm -rf build devel
catkin_make
source ./devel/setup.bash
```

编译后生成的中间文件位置：

| 语言 | 生成位置 | 调用方式 |
| :--- | :--- | :--- |
| C++ | `devel/include/包名/消息名.h` | `#include "包名/消息名.h"` |
| Python | `devel/lib/python3/dist-packages/包名/msg/_消息名.py` | `from 包名.msg import 消息名` |

### 1.4 自定义消息的发布与订阅

自定义消息生成后，C++ 中按“包名/消息名.h”包含头文件。

🎯 **实现目标**：发布方以 `10 Hz` 频率发布自定义消息，订阅方订阅该消息并打印内容。

实现流程：

1. 编写发布方实现。
2. 编写订阅方实现。
3. 编辑 `CMakeLists.txt`，加入可执行文件、链接库和消息生成依赖。
4. 编译并运行。

发布方示例：

```cpp
#include "ros/ros.h"
#include "plumbing_pub_sub/Person.h"

int main(int argc, char *argv[])
{
    setlocale(LC_ALL, "");

    ros::init(argc, argv, "person_pub");
    ros::NodeHandle nh;

    ros::Publisher pub = nh.advertise<plumbing_pub_sub::Person>("person", 10);
    ros::Rate rate(1);

    plumbing_pub_sub::Person person;
    person.name = "zhangsan";
    person.age = 18;
    person.height = 1.75;

    while (ros::ok())
    {
        pub.publish(person);
        ROS_INFO("发布人员信息：name=%s, age=%d, height=%.2f",
                 person.name.c_str(),
                 person.age,
                 person.height);

        rate.sleep();
    }

    return 0;
}
```

订阅方示例：

```cpp
#include "ros/ros.h"
#include "plumbing_pub_sub/Person.h"

void doPerson(const plumbing_pub_sub::Person::ConstPtr &person)
{
    ROS_INFO("收到人员信息：name=%s, age=%d, height=%.2f",
             person->name.c_str(),
             person->age,
             person->height);
}

int main(int argc, char *argv[])
{
    setlocale(LC_ALL, "");

    ros::init(argc, argv, "person_sub");
    ros::NodeHandle nh;

    ros::Subscriber sub = nh.subscribe("person", 10, doPerson);
    ros::spin();

    return 0;
}
```

调试命令：

```bash
rostopic list
rostopic echo /person
rostopic info /person
rosmsg show plumbing_pub_sub/Person
```

> [!warning] 自定义消息排错顺序
> 先查 `msg/Person.msg` 文件是否存在，再查 `CMakeLists.txt` 中 `add_message_files` 的文件名是否一致，然后查 `package.xml` 是否有 `message_generation` 和 `message_runtime`，最后清理 `build/devel` 重新编译。







## 闲聊：ROS、Rviz、rqt、Gazebo
ROS： 像是一个通信和编程的接口
rqt： 调试ROS的可视化界面
Rviz：ROS中数据的可视化
Gazebo：进行物理仿真，可替代真实机器人
