# ROS2 入门

## 一、软件安装与环境搭建

### 1. VMware + Ubuntu 安装

| Ubuntu 版本    | 推荐 ROS                |
| ------------ | --------------------- |
| Ubuntu 20.04 | ROS1 Noetic、ROS2 Foxy |
| Ubuntu 22.04 | ROS2 Humble           |
| Ubuntu 24.04 | ROS2 Jazzy            |

### 2.Ubuntu 镜像下载地址

如果按照 **ROS1 Noetic** 或 **ROS2 Foxy** 的老教程学习，可以使用 ==Ubuntu 20.04 系列镜像==：

- 中科大镜像站 Ubuntu 20.04 目录：[https://mirrors.ustc.edu.cn/ubuntu-releases/20.04/](https://mirrors.ustc.edu.cn/ubuntu-releases/20.04/)
- Ubuntu 20.04.3 桌面版 ISO：[ubuntu-20.04.3-desktop-amd64.iso](https://mirrors.ustc.edu.cn/ubuntu-releases/20.04/ubuntu-20.04.3-desktop-amd64.iso)
- Ubuntu 20.04.2 官方旧版本目录：[https://old-releases.ubuntu.com/releases/20.04.2/](https://old-releases.ubuntu.com/releases/20.04.2/)
- Ubuntu 20.04.2 桌面版 ISO：[ubuntu-20.04.2-desktop-amd64.iso](https://old-releases.ubuntu.com/releases/20.04.2/ubuntu-20.04.2-desktop-amd64.iso)

> [!NOTE]
> 学 ROS、RViz、Gazebo 时优先下载 ==`desktop-amd64.iso` 桌面版==。Server 版没有完整图形界面，后续使用 RViz 和 Gazebo 会更麻烦。

如果后续主学 **ROS2 Humble**，建议新建 ==Ubuntu 22.04 虚拟机==：

- Ubuntu 22.04 官方下载页：[https://releases.ubuntu.com/jammy/](https://releases.ubuntu.com/jammy/)

### 3 ROS2 Foxy 一键安装指令

该指令适用于 ==Ubuntu 20.04 安装 ROS2 Foxy==：
```bash
sudo apt-get install curl && curl http://fishros.com/tools/install/ros-foxy | bash
```

运行前先确认 **Ubuntu 版本**：
```bash
lsb_release -a
```

> [!warning]
> **ROS2 Foxy 对应 Ubuntu 20.04；ROS2 Humble 对应 Ubuntu 22.04。** 不要在 Ubuntu 22.04 上用 Foxy 的一键安装指令，也不要在 Ubuntu 20.04 上硬装 Humble。

## 二、ROS2 基础

### 1.节点
#### 1.1 节点定义

**节点 = ROS 系统中一个独立运行的功能单元**，负责完成某个具体任务，并通过 ==话题、服务或动作== 与其他节点通信。

```text
ROS 系统 = 一个工厂
节点 = 工厂里的不同岗位
话题 topic = 传送带 / 广播频道
消息 message = 传送带上的零件 / 广播里的内容
```

#### 1.2 节点之间如何通信

节点之间常见的通信方式：

- **话题**：`topic`
- **服务**：`services`
- **动作**：`action`
- **参数**：`parameters`

#### 1.3 通过命令行界面查看节点信息

**ROS2 的 CLI 是和 ROS2 相关的命令行操作。** CLI 全称是 `Command-Line Interface`，GUI 全称是 `Graphical User Interface`。

- **GUI**：图形用户界面，例如 Windows 里可视化的窗口和按钮，可以通过鼠标点击完成交互。
- **CLI**：命令行界面，例如终端、黑框程序，没有图形化界面，主要通过输入命令完成操作。

ROS2 提供了一系列命令，通过这些命令可以 ==获取和设置 ROS2 相关模块的信息==。

节点相关的常用 CLI：

运行节点：
```bash
ros2 run <package_name> <executable_name>
```

查看节点列表：
```bash
ros2 node list
```

查看节点信息：
```bash
ros2 node info <node_name>
```

重映射节点名称：
```bash
ros2 run turtlesim turtlesim_node --ros-args --remap __node:=my_turtle
```

ROS2 命令行工具源码：

- [ros2/ros2cli: ROS 2 command line interface tools](https://github.com/ros2/ros2cli)

### 2.工作空间与功能包

#### 2.1 工作空间

1. **从运行节点的命令理解工作空间**

   运行一个节点时，常用命令格式是：
   ```bash
   ros2 run 包名字 可执行文件名字
   ```

   这条命令背后的逻辑是：==先找到功能包，再找到功能包里的可执行文件，最后运行节点==。
   ```text
   ros2 run 包名字 可执行文件名字
            │      │
            │      └── 节点对应的可执行程序
            └── 节点所在的功能包
   ```

2. **为什么要理解工作空间**

   如果想找到某个节点，也就是找到某个 **可执行文件**，就需要先知道它在哪个 **功能包** 里。进一步说，功能包又放在 **工作空间** 中，所以学习 ROS2 时要先理解 ==工作空间和功能包之间的层级关系==。

   > [!NOTE]
   > 一个工作空间下面可以有多个功能包，一个功能包里面可以有多个节点。

3. **创建工作空间**
   工作空间可以先理解成一个 **“大项目文件夹”**，它里面通常会有一个 `src` 目录，用来存放各个功能包。
   创建工作空间的常用命令：
   ```bash
   mkdir -p turtle_ws/src
   cd turtle_ws/src
   ```

   其中：
   - **`mkdir`**：创建目录。
   - **`-p`**：递归创建目录。*即使上级目录不存在，也会自动创建。*
   - **`turtle_ws`**：工作空间目录。
   - **`src`**：用于存放功能包的目录。

4. **工作空间、功能包、节点的层级关系**

   工作空间、功能包和节点之间的关系可以这样理解：
   ```text
   工作空间 = 一个实验室
   src 目录 = 实验室里的项目资料柜
   功能包 = 资料柜里的一个项目文件夹
   节点 = 项目文件夹里真正可以运行的程序
   ```

   对应到 ROS2 的目录层级：
   ```text
   turtle_ws/                  工作空间
   └── src/                    存放功能包
       ├── 功能包 A/            一个功能模块
       │   ├── package.xml
       │   ├── CMakeLists.txt
       │   └── 节点程序
       └── 功能包 B/
           ├── package.xml
           ├── CMakeLists.txt
           └── 节点程序
   ```

   所以 ==`ros2 run` 的查找逻辑== 可以理解为：
   ```text
   先找功能包 -> 再找这个功能包里的可执行文件 -> 运行这个节点
   ```

#### 2.2 功能包
1. **功能包的定义**

   **功能包可以理解为存放节点的地方。** 它把某一类功能相关的代码、配置、依赖信息组织到一起，方便 ROS2 查找、编译和运行。

   可以把功能包理解成一个 **工具箱**：
   ```text
   功能包 = 工具箱
   节点 = 工具箱里真正能拿出来使用的工具
   ```

2. **功能包的三种类型**

   ROS2 中，功能包会根据 ==编译方式== 的不同分为三种类型：

   | 功能包类型 | 适用场景 | 说明 |
   | ---------- | -------- | ---- |
   | `ament_python` | Python 程序 | 适合写 Python 节点 |
   | `cmake` | C++ 程序 | 传统 CMake 构建方式 |
   | `ament_cmake` | C++ 程序 | `cmake` 的增强版，更常用于 ROS2 C++ 功能包 |

3. **功能包和节点的运行关系**

   运行节点时写的：
   ```bash
   ros2 run 包名字 可执行文件名字
   ```

   本质上就是：**先找到功能包，再运行功能包里的某个节点程序**。
   ```text
   工作空间
      ↓
   功能包
      ↓
   可执行文件
      ↓
   节点运行起来
   ```

#### 2.3 获取功能包的两种方式

获取功能包主要有两种方式：**安装获取** 和 **手动编译获取**。

1. **安装获取**
   安装获取一般使用 `apt`：
   ```bash
   sudo apt install ros-<version>-package_name
   ```

   例如 ROS2 Foxy 中，`<version>` 通常对应 `foxy`，安装后的功能包一般会放在系统目录中，例如：
   ```text
   /opt/ros/foxy/
   ```

   这种方式的特点：

   - **优点**：安装简单，适合直接使用已经发布好的功能包。
   - **特点**：安装完成后会自动放到系统目录中，通常不用每次手动 `source` 工作空间。


2. **手动编译获取**
   手动编译相对麻烦一些，需要先下载源码，然后编译生成相关文件。

   通常在这些场景下需要手动编译：

   - 作者还没有把功能包编译并上传到软件仓库，导致 `apt` 找不到对应包。
   - 功能包源码需要自己修改，修改后必须重新编译。

   > [!NOTE]
   > 手动编译之后，需要手动 `source` 工作空间的 `install` 目录，否则终端可能找不到新编译出来的功能包。

#### 2.4与功能包相关的指令ros2 pkg

`ros2 pkg` 是 ROS2 中和 **功能包管理** 相关的命令。

常用子命令：

| 指令            | 作用                 |
| ------------- | ------------------ |
| `create`      | 创建一个新的 ROS2 功能包    |
| `executables` | 输出功能包中的可执行文件       |
| `list`        | 输出当前可用的功能包列表       |
| `prefix`      | 输出某个功能包所在路径的前缀     |
| `xml`         | 输出功能包清单文件中的 XML 信息 |

1. **创建功能包**

   使用 `ros2 pkg create` 可以创建新的 ROS2 功能包：
   ```bash
   ros2 pkg create <package-name> --build-type {cmake,ament_cmake,ament_python} --dependencies <依赖名字>
   ```

   其中：

   - **`<package-name>`**：功能包名字。
   - **`--build-type`**：指定功能包的构建类型，例如 `ament_python`、`ament_cmake`。
   - **`--dependencies`**：指定该功能包依赖的其他包。

2. **列出所有可执行文件**

   使用 `ros2 pkg executables` 可以列出当前环境中所有功能包提供的可执行文件：
   ```bash
   ros2 pkg executables
   ```

3. **列出某个功能包中的可执行文件**

   如果只想查看某一个功能包中的可执行文件，可以在命令后面加上功能包名：
   ```bash
   ros2 pkg executables turtlesim
   ```

   示例输出：
   ```text
   turtlesim draw_square
   turtlesim mimic
   turtlesim turtle_teleop_key
   turtlesim turtlesim_node
   ```

4. **列出所有功能包**

   使用 `ros2 pkg list` 可以查看当前环境中可用的功能包列表：
   ```bash
   ros2 pkg list
   ```

5. **输出某个功能包所在路径的前缀**

   使用 `ros2 pkg prefix` 可以查看某个功能包所在路径的前缀：
   ```bash
   ros2 pkg prefix <package-name>
   ```

   例如查看小乌龟功能包：
   ```bash
   ros2 pkg prefix turtlesim
   ```

6. **查看功能包的清单描述文件**

   使用 `ros2 pkg xml` 可以查看功能包的清单描述文件：
   ```bash
   ros2 pkg xml turtlesim
   ```

> [!NOTE]
> 每一个功能包都有一个清单描述文件，用来记录这个包的 **名字、构建工具、编译信息、拥有者、依赖项** 等。通过这些信息，ROS2 才能在安装依赖和构建时确定编译顺序。

### 3. ROS2构建工具-Colcon

#### 3.1 Colcon定义
1. **Colcon 的作用**

   **Colcon 是 ROS2 中常用的功能包构建工具**，主要用于 ==编译工作空间中的功能包==。

   前面已经创建了 ROS2 工作空间，但创建工作空间只是在准备目录结构；如果要让源码真正变成可以运行的程序，就需要进行编译，ROS2 中常用的编译工具就是 `colcon`。

2. **Colcon 和 ROS1 catkin 的关系**

   如果把 ROS1 和 ROS2 对照理解：
   ```text
   ROS1：catkin 负责构建功能包
   ROS2：colcon 负责构建功能包
   ```

   可以简单记成：**Colcon 相当于 ROS1 中的 catkin 工具**。没有学过 ROS1 也没关系，只需要知道它是 ROS2 里用于构建功能包的工具。

3. **为什么要单独学习 Colcon**

   ROS2 默认不一定已经安装 `colcon`，所以在学习功能包编译之前，需要先确认并安装它。

#### 3.2 安装colcon

1. **安装命令**

   安装 ROS2 时不会自动安装所有 Colcon 工具，因此需要手动安装：
   ```bash
   sudo apt-get install python3-colcon-common-extensions
   ```

2. **安装过程**

   执行命令后，终端会提示输入当前用户密码：
   ```text
   [sudo] ros2 的密码：
   ```

   然后系统会读取软件包列表、分析依赖关系，并安装相关依赖。

3. **命令含义**

   - **`sudo`**：使用管理员权限执行安装。
   - **`apt-get install`**：通过 Ubuntu 软件包管理器安装软件。
   - **`python3-colcon-common-extensions`**：Colcon 的常用扩展集合。

> [!NOTE]
> 安装完成后，后续就可以在 ROS2 工作空间中使用 `colcon build` 来编译功能包。

#### 3.3 常用指令集
1. **只编译一个功能包**

   当工作空间里有多个功能包，但只想编译其中一个时，使用 `--packages-select`：
   ```shell
   colcon build --packages-select YOUR_PKG_NAME
   ```

   例如只编译 `village_wang`：
   ```shell
   colcon build --packages-select village_wang
   ```

2. **编译时不构建测试单元**

   如果当前阶段只是学习节点运行，不关心测试，可以关闭测试构建：
   ```shell
   colcon build --packages-select YOUR_PKG_NAME --cmake-args -DBUILD_TESTING=0
   ```

   **作用**：跳过测试相关构建，减少初学阶段的干扰。

3. **运行已编译功能包的测试**

   如果需要运行测试，使用：
   ```shell
   colcon test
   ```

   也可以只测试指定功能包：
   ```shell
   colcon test --packages-select YOUR_PKG_NAME
   ```

4. **使用符号链接安装**

   开发调试时常用：
   ```shell
   colcon build --symlink-install
   ```

   **作用**：允许通过修改 `src` 下的部分文件来影响 `install` 中的结果。对于 Python 脚本或资源文件，常常不需要每次都重新完整构建。

> [!NOTE]
> 初学阶段最常用的是 **`colcon build --packages-select 包名`** 和 **`colcon build --symlink-install`**。

### 4. POP方法搭建ROS2基本工程
#### 1.创建工作空间

```shell
mkdir -p town_ws/src
cd town_ws
code ./
```

#### 2. 创建一个功能包

打开vscode后，在集成终端中`cd src`

然后创建功能包：
```shell
ros2 pkg create village_wang --dependencies rclcpp
```

`village_wang`是功能包的名称，可随意命名

在`src`新建`wang2.cpp`文件

输入基本工程代码
```cpp
#include "rclcpp/rclcpp.hpp"
int main(int argc, char **argv)
{
    rclcpp::init(argc, argv);
    /*产生一个Wang2的节点*/
    auto node = std::make_shared<rclcpp::Node>("wang2");
    // 打印一句自我介绍
    RCLCPP_INFO(node->get_logger(), "大家好,我是单身狗wang2.");
    /* 运行节点，并检测退出信号*/
    rclcpp::spin(node);
    rclcpp::shutdown();
    return 0;
}
```

#### 3. 配置CMakelist
1. **在 `CMakeLists.txt` 中添加可执行文件**

   在 `wang2.cpp` 写好之后，还需要修改功能包中的 `CMakeLists.txt`，让编译系统知道：==这个 `.cpp` 文件需要被编译成一个可运行节点==。

   在 `CMakeLists.txt` 的最后添加：
   ```cmake
   add_executable(wang2_node src/wang2.cpp)
   ament_target_dependencies(wang2_node rclcpp)
   ```

   这两行的含义：

   - **`add_executable(wang2_node src/wang2.cpp)`**：把 `src/wang2.cpp` 编译成名为 `wang2_node` 的可执行文件。
   - **`ament_target_dependencies(wang2_node rclcpp)`**：声明 `wang2_node` 依赖 `rclcpp`，因为代码中使用了 ROS2 C++ 客户端库。

2. **安装可执行文件**

   只写 `add_executable` 还不够。C++ 节点编译出来后，还需要安装到 ROS2 能找到的位置，否则后面可能无法通过 `ros2 run` 运行。

   接着在上面两行代码下面添加：
   ```cmake
   install(TARGETS
     wang2_node
     DESTINATION lib/${PROJECT_NAME}
   )
   ```

   这段代码的作用是：**把编译生成的 `wang2_node` 安装到当前功能包的 `lib/${PROJECT_NAME}` 目录下**。

   对于本例来说，安装路径可以理解为：
   ```text
   install/village_wang/lib/village_wang/
   ```

3. **完整配置片段**

   最终需要添加的 `CMakeLists.txt` 配置如下：
   ```cmake
   add_executable(wang2_node src/wang2.cpp)
   ament_target_dependencies(wang2_node rclcpp)

   install(TARGETS
     wang2_node
     DESTINATION lib/${PROJECT_NAME}
   )
   ```

> [!warning]
> `install(TARGETS ...)` 中的 **`TARGETS` 不能拼错**。如果写成 `TARGERTS`，编译时会报错：`install does not recognize sub-command TARGERTS`。



#### 4. 运行节点
依次运行以下命令：
```shell
colcon build --packages-select village_wang 
source install/setup.bash
ros2 run village_wang wang2_node
```

可以成功看到日志输出如下图:
![[Pasted image 20260627144152.png]]

### 5.OOP方法搭建ROS2基本工程

与4同理
只需要把主程序改写为
```cpp
#include "rclcpp/rclcpp.hpp"
class SingleDogNode : public rclcpp::Node
{
private:
    /* data */
public:                                                        
    SingleDogNode(std::string name):Node(name)
    {
        RCLCPP_INFO(this->get_logger(),"hello!I'm the SingleDog%s",name.c_str());
    }
};

int main(int argc, char **argv)
{
    rclcpp::init(argc, argv);
    /*产生一个Wang2的节点*/
    auto node = std::make_shared<SingleDogNode>("wang2");
    // 打印一句自我介绍
    RCLCPP_INFO(node->get_logger(), "大家好,我是单身狗wang2.");
    /* 运行节点，并检测退出信号*/
    rclcpp::spin(node);
    rclcpp::shutdown();
    return 0;
}
```


### 6 运行一个节点的基本流程

1. **创建工作空间和 `src` 目录**

   工作空间是存放功能包的“大项目目录”，`src` 用来放功能包源码。
   ```bash
   mkdir -p spacename/src
   cd spacename
   ```

2. **进入 `src` 目录创建功能包**
   `ros2 pkg create` 的作用是 ==创建功能包==，不是创建节点文件。
   ```bash
   cd src
   ros2 pkg create <package_name> --build-type ament_cmake --dependencies rclcpp
   ```

   如果节点代码中用到了 `std_msgs`，创建功能包时应**加入依赖**：
   ```bash
   ros2 pkg create <package_name> --build-type ament_cmake --dependencies rclcpp std_msgs
   ```

3. **创建节点源文件**

   节点源文件通常放在功能包内部的 `src/` 目录下，例如：
   ```text
   spacename/src/<package_name>/src/wang2.cpp
   ```


4. **配置 `CMakeLists.txt`**
   对于 C++ 节点，需要在 `CMakeLists.txt` 中注册可执行文件、声明依赖并安装目标：
   ```cmake
   add_executable(wang2_node src/wang2.cpp)
   ament_target_dependencies(wang2_node rclcpp std_msgs)
   install(TARGETS
     wang2_node
     DESTINATION lib/${PROJECT_NAME}
   )
   ```
   如果代码没有使用 `std_msgs`，可以去掉 `std_msgs`：
   ```cmake
   ament_target_dependencies(wang2_node rclcpp)
   ```

5. **回到工作空间根目录编译**

   `colcon build` 应该在 ==工作空间根目录== 执行，也就是包含 `src/` 的目录。
   ```bash
   cd ~/spacename
   colcon build --packages-select <package_name>
   ```

6. **更新当前终端环境**

   编译完成后，需要让当前终端识别新编译出的功能包和可执行文件：
   ```bash
   source install/setup.bash
   ```

7. **运行节点**
   `ros2 run` 后面跟的是 ==功能包名称 + 可执行文件名称==：
   ```bash
   ros2 run <package_name> <executable_name>
   ```

> [!NOTE]
> 最容易混淆的是：**功能包名不是节点名**，`ros2 run` 的格式也不是“节点名称 + 执行文件名称”，而是 `ros2 run 功能包名称 可执行文件名称`。

****
## 三、ROS2通信机制

### 1.话题 Topic

#### 1.1 话题的发布订阅模型

1. **话题通信的基本关系**
   话题通信用于节点之间传递数据。一个节点可以作为 **发布者 Publisher**，另一个节点可以作为 **订阅者 Subscriber**。
   ```text
   发布者节点--发布消息-->  话题--订阅消息-->  订阅者节点
   ```

2. **发布者和订阅者**
   - **发布者 Publisher**：负责向某个话题发布数据。
   - **订阅者 Subscriber**：负责订阅某个话题，并接收该话题中的数据。
   - **话题 Topic**：发布者和订阅者之间的数据通道。
   
3. **话题通信不是只能一对一**
   图中的例子是一个发布者和一个订阅者，但 ROS2 中的话题通信还可以是：
   - **1 对 1**：一个发布者，一个订阅者。
   - **1 对 n**：一个发布者，多个订阅者。
   - **n 对 1**：多个发布者，一个订阅者。
   - **n 对 n**：多个发布者，多个订阅者。

#### 1.2 话题通信的注意规则
1. **话题名字要一致**
2. **消息类型要一致**
3. **一个节点可以连接多个话题**
4. **同一个话题可以有多个发布者**

#### 1.3 相关工具
##### 1. rqt_graph
1. **rqt_graph 的作用**
   `rqt_graph` 是 ROS2 中用于查看节点和话题关系的图形化工具。
   在程 序运行过程中，可视化显示节点之间通过哪些话题连接。

2. **运行 demo 节点**
   分别打开三个终端，运行下面三个命令：
   ```shell
   ros2 run demo_nodes_py listener
   ros2 run demo_nodes_cpp talker
   rqt_graph
   ```

3. **观察结果**
   打开 `rqt_graph` 后，可以看到：
   - 哪些节点正在运行。
   - 节点之间通过哪些话题通信。
   - 发布者和订阅者之间的数据关系。

> [!NOTE]
> 学 ROS2 话题通信时，`rqt_graph` 很适合用来检查“节点是否真的连上了话题”。


##### 2. ROS2话题相关命令行（CLI）工具
1. **查看 `ros2 topic` 帮助**
   ```shell
   ros2 topic -h
   ```

   常用子命令：

| 子命令       | 作用                  |
| --------- | ------------------- |
| `list`    | 查看当前系统中活动的话题列表      |
| `list -t` | 查看话题列表，并显示每个话题的消息类型 |
| `echo`    | 打印某个话题的实时数据         |
| `info`    | 查看某个话题的发布者和订阅者数量    |
| `pub`     | 手动向某个话题发布数据         |
| `type`    | 查看某个话题的消息类型         |
| `hz`      | 查看话题发布频率            |
| `bw`      | 查看话题占用带宽            |

2. **查看当前活动的话题列表**
   使用 `ros2 topic list` 可以返回系统中当前活动的所有话题：
   ```shell
   ros2 topic list
   ```

3. **查看话题列表和消息类型**
   使用 `-t` 参数可以同时显示话题的消息类型：
   ```shell
   ros2 topic list -t
   ```
   **重点**：话题通信时，==发布者和订阅者的话题名、消息类型都要匹配==。

4. **打印实时话题内容**
   ```shell
   ros2 topic echo /chatter
   ```

5. **查看话题信息**
   使用 `ros2 topic info` 可以查看某个话题的发布者和订阅者数量：
   ```shell
   ros2 topic info /chatter
   ---------------------------------
    Type: std_msgs/msg/String
   Publisher count: 1
   Subscription count: 1
   ```
   其中：
   - **`Type`**：话题消息类型。
   - **`Publisher count`**：发布者数量。
   - **`Subscription count`**：订阅者数量。

6. **查看消息类型定义**

   已知 `/chatter` 的消息类型是 `std_msgs/msg/String`，可以继续查看这个消息类型内部有什么字段：
   ```shell
   ros2 interface show std_msgs/msg/String
   ```

   对于 `std_msgs/msg/String`，核心字段就是字符串数据：
   ```text
   string data
   ```

7. **手动发布话题数据**

   关闭原发布者后，也可以用命令行手动向话题发布数据：
   ```shell
   ros2 topic pub /chatter std_msgs/msg/String 'data: "123"'
   ```

   可以这样理解：
   ```text
   /chatter              话题名
   std_msgs/msg/String   消息类型
   'data: "123"'         消息内容
   ```

####  1.4 C++订阅者实现

1. **C++ 订阅话题的一般流程**

   在 C++ 中实现话题订阅，一般按下面流程写：
   1. 导入订阅所需的消息类型头文件。
   2. 创建节点类，并继承 `rclcpp::Node`。
   3. 声明订阅者成员变量。
   4. 在构造函数中创建订阅者。
   5. 编写收到消息后的回调函数。

2. **节点类继承 `rclcpp::Node`**

   ```cpp
   class SingleDogNode : public rclcpp::Node
   ```

   这样 `SingleDogNode` 就拥有了 ROS2 节点的能力，例如：
   - 创建发布者。
   - 创建订阅者。
   - 获取日志器。
   - 创建定时器。

3. **订阅话题所需头文件**
   如果要订阅 `std_msgs/msg/String` 类型的话题，需要包含字符串消息类型头文件：
   ```cpp
   #include "rclcpp/rclcpp.hpp"
   #include "std_msgs/msg/string.hpp"
   ```
   如果后续还要发布 `UInt32` 类型数据，可以额外包含：
   ```cpp
   #include "std_msgs/msg/u_int32.hpp"
   ```

4. **创建订阅者**
   订阅者成员变量一般写成：
   ```cpp
   rclcpp::Subscription<std_msgs::msg::String>::SharedPtr sub_novel;
   ```
   在构造函数中创建订阅者：
   ```cpp
   sub_novel = this->create_subscription<std_msgs::msg::String>(
     "sexy_girl",
     10,
     std::bind(&SingleDogNode::topic_callback, this, std::placeholders::_1)
   );
   
   ```
   - **`std_msgs::msg::String`**：订阅的消息类型。
   - **`"sexy_girl"`**：订阅的话题名。
   - **`10`**：队列深度。
   - **`topic_callback`**：收到话题数据后执行的回调函数。
   - **`std::placeholders::_1`**：把收到的消息对象传给回调函数。

5. **编写回调函数**
   回调函数用于处理订阅到的数据：
   ```cpp
   void topic_callback(const std_msgs::msg::String::SharedPtr msg)
   {
     RCLCPP_INFO(this->get_logger(), "朕已阅：%s", msg->data.c_str());
   }
   ```

6. **完整示例代码**

   下面是一个订阅字符串话题的 C++ 节点示例：
   ```cpp
   #include "rclcpp/rclcpp.hpp"
   #include "std_msgs/msg/string.hpp"

   using std::placeholders::_1;

   class SingleDogNode : public rclcpp::Node
   {
   public:
     SingleDogNode(std::string name) : Node(name)
     {
       RCLCPP_INFO(this->get_logger(), "大家好，我是单身狗%s.", name.c_str());

       sub_novel = this->create_subscription<std_msgs::msg::String>(
         "sexy_girl",
         10,
         std::bind(&SingleDogNode::topic_callback, this, _1)
       );
     }

   private:
     rclcpp::Subscription<std_msgs::msg::String>::SharedPtr sub_novel;

     void topic_callback(const std_msgs::msg::String::SharedPtr msg)
     {
       RCLCPP_INFO(this->get_logger(), "朕已阅：%s", msg->data.c_str());
     }
   };

   int main(int argc, char **argv)
   {
     rclcpp::init(argc, argv);
     auto node = std::make_shared<SingleDogNode>("wang2");
     rclcpp::spin(node);
     rclcpp::shutdown();
     return 0;
   }
   ```

> [!NOTE]
> 订阅者节点本身不会主动产生数据，它只是等待话题中有消息时触发回调函数。真正的数据来源通常是另一个发布者节点，或者 `ros2 topic pub` 手动发布的数据。

#### 1.5 C++发布者实现
1. **创建发布者**

   C++ 中创建发布者使用 `create_publisher`：
   ```cpp
   pub_money = this->create_publisher<std_msgs::msg::UInt32>("sexy_girl_money", 10);
   ```

   这行代码的含义是：创建一个发布者，向 `sexy_girl_money` 话题发布 `std_msgs::msg::UInt32` 类型的数据。

   参数含义：

   - **`std_msgs::msg::UInt32`**：发布的数据类型。
   - **`"sexy_girl_money"`**：发布的话题名。
   - **`10`**：队列深度，也就是 QoS 队列长度。

2. **声明发布者成员变量**

   发布者也需要保存成类的成员变量，否则创建后可能无法持续使用：
   ```cpp
   rclcpp::Publisher<std_msgs::msg::UInt32>::SharedPtr pub_money;
   ```

   可以这样理解：
   ```text
   pub_money = 这个节点持有的发布器
   ```

3. **在构造函数中创建发布者**

   发布者通常在节点类的构造函数中创建：
   ```cpp
   SingleDogNode(std::string name) : Node(name)
   {
     RCLCPP_INFO(this->get_logger(), "大家好，我是单身狗%s.", name.c_str());

     sub_novel = this->create_subscription<std_msgs::msg::String>(
       "sexy_girl",
       10,
       std::bind(&SingleDogNode::topic_callback, this, _1)
     );

     pub_money = this->create_publisher<std_msgs::msg::UInt32>("sexy_girl_money", 10);
   }
   ```

   这里这个节点同时具备两个能力：

   - **订阅者能力**：订阅 `sexy_girl`，接收小说内容。
   - **发布者能力**：发布 `sexy_girl_money`，发送打赏金额。

4. **在回调函数中发布消息**

   收到 `sexy_girl` 话题的数据后，可以在回调函数中创建一条 `UInt32` 消息并发布出去：
   ```cpp
   void topic_callback(const std_msgs::msg::String::SharedPtr msg)
   {
     std_msgs::msg::UInt32 money;
     money.data = 10;

     pub_money->publish(money);

     RCLCPP_INFO(
       this->get_logger(),
       "朕已阅：%s，打赏李四：%d 元的稿费",
       msg->data.c_str(),
       money.data
     );
   }
   ```

   这段代码的执行逻辑：
   ```text
   收到 sexy_girl 话题消息
       ↓
   进入 topic_callback()
       ↓
   创建 UInt32 类型的 money 消息
       ↓
   money.data = 10
       ↓
   发布到 sexy_girl_money 话题
   ```

5. **需要包含的消息头文件**

   因为这里同时用到了 `String` 和 `UInt32` 两种消息类型，所以需要包含两个消息头文件：
   ```cpp
   #include "std_msgs/msg/string.hpp"
   #include "std_msgs/msg/u_int32.hpp"
   ```

6. **发布者和订阅者的关系**

   一个节点可以同时是订阅者和发布者：
   ```text
   SingleDogNode
      ├── 订阅 sexy_girl
      └── 发布 sexy_girl_money
   ```

   **重点**：发布者和订阅者不一定要写在两个功能包里，也不一定要写在两个节点里。是否拆开，取决于功能边界和工程结构。

> [!NOTE]
> 这段代码属于“收到一个话题后，再发布另一个话题”的模式。工程里很常见，例如：订阅传感器数据，处理后再发布控制指令。

### 2.接口

#### 2.1 接口定义
##### 2.1.1 接口定义
1. **接口本质上是一种通信规范**
	用于规定节点之间传递的数据格式。可以把它理解为：**通信双方提前约定好的“数据模板”**。
2. **接口可以屏蔽不同编程语言之间的差异**
	不同语言对字符串、整数等类型的定义方式并不完全相同，而 ROS2 通过统一接口来解决这个问题, 只要双方使用同一个接口类型，就可以通过 ROS2 正常通信。：
   ```text
   Python 节点 ── 使用同一种接口 ── C++ 节点
   ```
	
3. **接口对机器人开发的意义**
   机器人系统里会使用大量传感器和执行器，例如激光雷达、相机、IMU、底盘等。不同厂家的设备实现方式不同，如果没有统一接口，每换一个设备都可能需要重新适配程序。
   例如激光雷达数据通常统一为：
   ```text
   sensor_msgs/msg/LaserScan
   ```
   这样做的好处是：
   - **设备厂家**：把自己的雷达数据转换成 `LaserScan` 格式。
   - **上层算法**：只需要读取 `LaserScan`，不用关心雷达是哪一家生产的。
   - **工程维护**：更换硬件时，上层代码的改动更少。

> [!NOTE]
> 可以把 ROS2 接口类比为 USB 接口规范：不同厂家生产的设备，只要遵守同一套接口标准，就能被系统识别和使用。

##### 2.1.2 接口介绍

1. **ROS2 自带常用接口包**
   安装 ROS2 时会自动安装一些基础接口包，前面用到的 `String` 和 `UInt32` 就来自 `std_msgs`。
   常见接口包：

| 接口包 | 作用 |
|---|---|
| `std_msgs` | 标准基础消息，例如字符串、整数、布尔值等 |
| `sensor_msgs` | 传感器相关消息，例如激光雷达、相机、点云、IMU 等 |
| `geometry_msgs` | 几何相关消息，例如位置、姿态、速度等 |
| `nav_msgs` | 导航相关消息，例如里程计、路径、地图等 |

2. **查看某个接口包下的所有接口**
使用 `ros2 interface package` 可以查看指定接口包中包含哪些接口：

   ```bash
   ros2 interface package sensor_msgs
   ```

`sensor_msgs` 中常见接口示例：

| 接口                            | 含义         |
| ----------------------------- | ---------- |
| `sensor_msgs/msg/JointState`  | 机器人关节状态    |
| `sensor_msgs/msg/Temperature` | 温度数据       |
| `sensor_msgs/msg/Joy`         | 手柄输入数据     |
| `sensor_msgs/msg/PointCloud2` | 点云数据       |
| `sensor_msgs/msg/CameraInfo`  | 相机参数信息     |
| `sensor_msgs/msg/LaserScan`   | 激光雷达扫描数据   |
| `sensor_msgs/msg/Imu`         | IMU 惯性测量数据 |


   **重点**：接口名字通常由三部分组成：
   ```text
   接口包名 / 接口类型 / 接口名称 
   ```

   例如：
   ```text
   sensor_msgs/msg/LaserScan
      │       │       └── 具体接口名称
      │       └── 接口类型：消息 msg
      └── 接口包名
   ```

#### 2.2 自定义接口
1. **ROS2 中支持自定义接口的通信方式:**
```
话题 Topics
服务 Services
动作 Action
参数 Parameters
```
其中，除了参数之外，**话题、服务、动作都支持自定义接口**。

2. **三类自定义接口文件**
   不同通信方式对应不同的接口文件后缀：

| 通信方式       | 接口文件      | 典型用途         |
| ---------- | --------- | ------------ |
| 话题 Topic   | `.msg`    | 连续发布/订阅数据    |
| 服务 Service | `.srv`    | 一次请求，一次响应    |
| 动作 Action  | `.action` | 长时间任务，带反馈和结果 |

3. **话题接口格式：`.msg`**
   `.msg` 文件用于定义话题通信中传递的数据结构：   `int64 num`

4. **服务接口格式：`.srv`**
`.srv` 文件分为 **请求** 和 **响应** 两部分，中间使用 `---` 分隔：
   ```text
   int64 a
   int64 b
   ---
   int64 sum

   请求：a + b
    ↓
   响应：sum
   ```
重点：`---` 上面是客户端发给服务端的数据，下面是服务端返回给客户端的数据。

5. **动作接口格式：`.action`**
   `.action` 文件通常包含 **目标、结果、反馈** 三部分，每部分之间也用 `---` 分隔：
   - **目标 Goal**：希望动作完成什么任务，例如 `order`。
   - **结果 Result**：任务最终完成后的结果，例如 `sequence`。
   - **反馈 Feedback**：任务执行过程中的中间状态，例如 `partial_sequence`。
   ```text
   int32 order
   ---
   int32[] sequence
   ---
   int32[] partial_sequence
   ```
   

6. **自定义接口如何被程序调用**
   自定义接口文件不能直接被 C++ 或 Python 使用，需要先经过 ROS2 的 IDL 转换流程：
   ```text
   .msg / .srv / .action
           ↓
      ROS2 IDL 转换器
           ↓
   Python 的 .py 文件、C++ 的 .h 头文件
   ```
   转换完成后，程序才能通过 `#include` 或 `import` 的方式使用这些接口。
> [!NOTE]
> 写自定义接口时，本质是在定义“节点之间能传什么数据”。接口定义清楚了，后面写发布者、订阅者、服务端、客户端时才不会混乱。

#### 2.3 ROS2接口常用CLI命令

1. **查看当前环境下的接口列表**
   使用 `ros2 interface list` 可以查看当前 ROS2 环境中可用的全部接口：
   ```bash
   ros2 interface list
   ```
   这个命令适合用来确认：**当前系统里到底有哪些接口可以直接使用**。

2. **查看所有接口包**
   使用 `ros2 interface packages` 可以查看当前环境中的所有接口包：
   ```bash
   ros2 interface packages
   ```

3. **查看某个接口包下的所有接口**
   使用 `ros2 interface package` 可以查看指定接口包中的全部接口：
   ```bash
   ros2 interface package std_msgs
   ```

4. **查看某一个接口的详细内容**
   使用 `ros2 interface show` 可以查看某个接口内部到底有哪些字段：
   ```bash
   ros2 interface show std_msgs/msg/String
   ```
   这表示 `std_msgs/msg/String` 这个消息类型内部只有一个字段：
   - **字段类型**：`string`
   - **字段名称**：`data`

5. **输出某个接口的所有属性**
   使用 `ros2 interface proto` 可以查看某个接口的完整属性模板：
   ```bash
   ros2 interface proto sensor_msgs/msg/Image
   ```
   这个命令适合在写代码前快速查看某个复杂接口应该填哪些字段。

6. **常用命令速查**

| 指令                                          | 作用            | 常用程度 |     |
| ------------------------------------------- | ------------- | ---- | --- |
| **`ros2 interface list`**                   | 查看当前环境下所有接口   | 常用   |     |
| **`ros2 interface packages`**               | 查看所有接口包       | 常用   |     |
| **`ros2 interface package <package_name>`** | 查看某个接口包下的所有接口 | 常用   |     |
| **`ros2 interface show <interface_name>`**  | 查看某个接口的字段定义   | 很常用  |     |
| `ros2 interface proto <interface_name>`     | 输出某个接口的属性模板   | 常用   |     |

> [!tip]
> 写发布者或订阅者前，如果不确定消息类型里有哪些字段，优先用 `ros2 interface show` 查。例如 `std_msgs/msg/String` 查出来是 `string data`，所以代码里才写 `msg->data`。


#### 2.4 C++实现自定义话题接口

##### 2.4.1. 自定义接口的意义：

1. 统一数据格式
2. 让不同语言的节点使用同一套数据结构`struct`
3.  支持ROS2传输和解析
4. 让调试工具能够看得懂数据

##### 2.4.2 新建话题接口：

1.  工作空间的`src`下新建功能包 ros2 
2.   新建`msg`文件夹，并且在文件夹下面新建 `xxx.msg`
3. 在 `xxx.msg`下编写消息内容并保存
4. 在`CMakeList.txt`添加依赖和`msg`文件目录 
	-  修改文件如图所示
	- ![[Pasted image 20260629172620.png]]
5. 在`package.xlm`中添加`xxx.msg`所需依赖
```XML
<-- 如果自定义接口里用到了 sensor_msgs，才写这一行 -->
<depend>sensor_msgs</depend>

<-- 下面三行自定义接口包基本固定要写 -->
<build_depend>rosidl_default_generators</build_depend>
<exec_depend>rosidl_default_runtime</exec_depend>
<member_of_group>rosidl_interface_packages</member_of_group>
```
6. 编译功能包生成头文件
```shell
cd ~/town_ws
colcon build --packages-select village_interface
source install/setup.bash
ros2 interface show village_interface/msg/Novel
```

> [!info] 注意
> 1. msg文件中的注释为`#`
> 2. 最终都是由以下原始数据类型组合而成
> ```cpp
> bool、byte、char、string、float32、float64
> int8、uint8、int16、uint16、int64、uint64
> ```
> 3. 查看数据包下的数据类型 `ros2 interface package <接口包名>`

### 3. 服务 Service

#### 3.1 服务定义

**定义：**

1. 服务 = 请求 + 响应
2. 服务 = 服务端 Server + 客户端 Clinet 

**作用：**
	 让一个节点**主动调用**另一个节点的功能，并得到**返回结果**。

```cpp
Client
  │
  │  Request：a, b
  ↓
Server
  │
  │  Response：sum
  ↓
Client
```

#### 3.2 服务使用

1. 启动自带ROS2服务实例
```cpp
	ros2 run examples_rclpy_minimal_service service
```
2. 使用命令查看服务列表
```cpp
	ros2 service list
```
3. 手动调用服务
	方法1：使用命令行工具
	方法2：使用rqt工具
4. 查看服务接口类型
```cpp
ros2 service type /add_two_ints
```
5. 查找使用某一接口服务
```cpp
ros2 service find example_interfaces/srv/AddTwoInts
```
6. 查看某个接口的具体字段定义
```cpp
ros2 interface show example_interfaces/srv/AddTwoInts
```

#### 3.3 自定义服务接口

1. 在工作空间 `src` 下创建接口功能包，在接口功能包下新建 `srv` 文件夹，在 `srv` 文件夹下新建 `xxx.srv` 文件
2. 编辑 `xxx.srv`，定义**请求和响应**字段
3. 修改接口功能包的 `CMakeLists.txt`
```cpp
   - 添加 `rosidl_default_generators`
   - 添加 `rosidl_generate_interfaces()`
   - 写入 `srv/xxx.srv` 文件路径
   - 如果 `srv` 里用到其他消息包，添加 `DEPENDENCIES`
```
4. 修改接口功能包的 `package.xml`
```
  - 添加 `rosidl_default_generators`
  - 添加 `rosidl_default_runtime`
  - 添加 `rosidl_interface_packages`
  - 如果用到其他接口包，添加对应 depend
```
5. 回到工作空间根目录**编译**接口功能包，生成对应头文件
6. 修改使用方功能包的 `CMakeLists.txt` 和 `package.xml`，添加对接口包的依赖；代码中通过 `#include` 引入生成的服务头文件。
7. 编译使用方功能包并 source

#### 3.4 死锁和多线程

> [!NOTE] 死锁
> 由于ROS2是单线程，各个节点需要相互等待对方发送数据，造成程序阻塞无法执行的过程
> 为了解决死锁问题，需要通过 **多线程执行器**+**回调函数组** 来实现多线操作
> 


### 4. 参数 Parameter
#### 4.1参数的定义与作用

节点运行时，有些值**不应该写死**在代码里面，应该在运行时灵活配置，这种**在节点运行时可以读取和修改的配置项**称为节点

#### 4.2 参数相关命令

1. 查看节点有哪些参数
```
ros2 param list
```
2. 查看节点参数的详细信息
```
ros2 param describe <node_naem> <parameter_name>
```
3. 参看参数值
```
ros2 param get <node_naem> <parameter_name>
```
4. 设置参数值（临时设置，无法永久保留）
```
ros2 param set <node_naem> <parameter_name> <value>
```
5. 保存参数
- 对当前参数值进行快照操作
```
ros2 param dump <node_name>
```
- 文件被保存为yaml格式，可用以下指令查看
```
cat ./<node_name>.yaml
```
- 使用快照的参数值
```
ros2 param load <node_name> <node_name>.yaml
```
- 启动节点时，加载参数快照
```
ros2 run <package_name> <executable_name> --ros-args --params-file <file_name>
```


### 5.动作 Action 
#### 5.1 Action定义与作用

- 用于处理 “耗时任务” 的通信机制
- 客户端给服务端发送一个目标，服务端**执行任务**，执行过程中持续**反馈进度**，最后**返回执行结果**，并且任务**中途可以取消**

> [!NOTE]
> Topic：传连续数据
> Service：短任务请求响应
> Action：长任务 = 请求目标 + 过程反馈 + 最终结果 + 可取消

#### 5.2 Action的CLI工具

1. 获取目前系统中的action列表
```
ros2 action list
ros2 action list -t //查看接口类型
```
注：得知接口类型后，可通过 `ros2 interface show <动作接口类型>` 来获取接口信息

2. 获取客户端和服务端的数量+名字
```
ros2 action info <action_name>
```

3. 发送Action请求到服务端
```
ros2 action send_goal <action_name> <action_type> <goal>
```


## 四、ROS常用工具

### 1. Launch文件

#### 1.1 Launch的介绍

通过Launch文件是用于**一键启动和配置多个节点**的启动脚本

- 同时启动多个节点
- 设置节点名称和命名空间
- 启动Rviz、Gazebo等工具
- 统一管理系统启动流程
> [!NOTE] 常用Python编写Launch文件

#### 1.2 Launch的使用

1. 功能包下新建`launch`文件夹
2. 编写`<name>.launch.py`文件
```python
# 导入库
from launch import LaunchDescription
from launch_ros.actions import Node
# 定义函数名称，必须叫 generate_launch_description
def generate_launch_description():
    # 创建一个 Node 对象 li4_node，表示李四所在位置
    li4_node = Node(
        package="village_li",
        executable="li4_node"
    )
    # 创建一个 Node 对象 wang2_node，表示王二所在位置
    wang2_node = Node(
        package="village_wang",
        executable="wang2_node"
    )
    # 创建 LaunchDescription 对象，用于描述 launch 文件
    launch_description = LaunchDescription([li4_node, wang2_node])
    # 返回给 ROS2，ROS2 根据 launch 描述执行节点
    return launch_description
```

3. 将`launch`文件拷贝到`/install`下面
- 对于`python`功能包——修改`setup.py`文件
![[Pasted image 20260701122306.png]]
```python
from glob import glob
import os
(os.path.join('share', package_name, 'launch'), glob('launch/*.launch.py')),
```

- 对于`Cpp`功能包——修改`CmakeList。txt`文件
```cpp
install(DIRECTORY launch
  DESTINATION share/${PROJECT_NAME}
)
```

4. 编译执行对应的launch文件
```
colcon build --packages-select <功能包> <launch文件>
```

### 2. rosbag2

#### 2.1 rosbag2介绍

rosbag2是用于**数据录制和回放**的工具
将话题数据记录下来后，可以反复回放，方便后续的**调试、分析、debug和复现**实验

#### 2.2 rosbag2常用指令

1.记录某一个话题
```
ros2 bag record <topic_name>
```
2.记录多个话题
```
ros2 bag record <topic_name1>  <topic_name2>
```
3.记录所有话题
```
ros2 bag record -a
```
4自定义文件名字
```
ros2 abag record -o <file-name>  <topic_name> 
```
5.查看录制出话题的信息
```
ros2 bag info <bag-file>
```
6.播放话题信息
```
ros2 bag play <xxx.db3>
```

| 功能      | 命令                                           |
| ------- | -------------------------------------------- |
| 倍速播放 -r | ros2 bag play <xxx.db3> -r 10                |
| 循环播放 -l | ros2 bag play <xxx.db3> -l                   |
| 播放单个话题  | ros2 bag play <xxx.db3> --topic <topic_name> |

### 3. RQT工具

#### 3.1 RQT工具介绍

**一套图形化调试工具集合**，
它不是单独一个功能，而是一个 **GUI 工具平台**，可以配置许多插件，这些插件可以帮你用图形界面查看 ROS2 系统状态、话题数据、日志、曲线、图像等

#### 3.2 RQT常见插件工具

| 插件工具              | 主要作用                            | 适合排查的问题                  |
| ----------------- | ------------------------------- | ------------------------ |
| **`rqt_graph`**   | 图形化查看 **节点、话题、发布者、订阅者** 的连接关系   | 节点是否启动、话题是否连通、发布订阅关系是否正确 |
| **`rqt_console`** | 图形化查看节点日志，并按日志等级过滤              | 节点报错、警告信息、回调函数是否正常执行     |
| **`rqt_plot`**    | 将数值型话题数据绘制成曲线                   | 车速、转角、横摆角速度、控制误差等随时间变化   |
| `rqt_image_view`  | 查看 `sensor_msgs/msg/Image` 图像话题 | 摄像头、仿真相机、视觉节点输出是否正常      |
| `rqt_bag`         | 图形化查看 rosbag 数据和时间轴             | 回放实验数据、查看某一时刻的话题变化       |
| `rqt`             | 打开 RQT 总入口，再从菜单选择插件             | 不确定用哪个插件时，从总入口进入         |

### 4.RVIZ2工具

**RViz2 是 ROS2 的三维数据可视化工具**,**RViz2 本身不是仿真器，也不负责产生物理环境**。把这些抽象数据变成图形，帮助定位问题。

   ```text
   ROS2 话题 / TF / 传感器数据
             ↓
           RViz2
             ↓
       三维可视化显示
   ```
****

| 数据类型  | 常见接口/来源                       | RViz2 中的作用    |
| ----- | ----------------------------- | ------------- |
| 机器人模型 | `robot_description` / URDF    | 显示机器人结构、连杆、关节 |
| 坐标变换  | `/tf`、`/tf_static`            | 显示各坐标系之间的位置关系 |
| 激光雷达  | `sensor_msgs/msg/LaserScan`   | 显示雷达扫描点       |
| 点云    | `sensor_msgs/msg/PointCloud2` | 显示三维点云        |
| 图像    | `sensor_msgs/msg/Image`       | 显示相机图像        |
| 位姿    | `geometry_msgs/msg/Pose`      | 显示机器人或目标的位置姿态 |
| 路径    | `nav_msgs/msg/Path`           | 显示规划路径或运动轨迹   |
| 地图    | `nav_msgs/msg/OccupancyGrid`  | 显示二维栅格地图      |


   终端输入：
   ```bash
   rviz2
   ```

   常见使用流程：
   ```text
   启动 ROS2 节点
       ↓
   启动 rviz2
       ↓
   Add 添加显示项
       ↓
   选择 Topic / Fixed Frame
       ↓
   观察数据是否正常
   ```

### 5. Gazebo 


常用的机器人三维物理仿真平台，**模拟一个真实环境，让机器人在里面运动、碰撞、感知、执行任务**。


安装指令
```
sudo apt install gazebo11
```



## 五、ROS2命令行工具


1. **查看 ROS2 命令总览**
   在终端中直接输入 `ros2`，可以查看 ROS2 命令行工具的总入口：
   ```bash
   ros2
   ```

   终端会显示类似信息：
   ```text
   usage: ros2 [-h] Call `ros2 <command> -h` for more detailed usage. ...

   ros2 is an extensible command-line tool for ROS 2.

   optional arguments:
     -h, --help    show this help message and exit

   Commands:
     action       Various action related sub-commands
     bag          Various rosbag related sub-commands
     component    Various component related sub-commands
     daemon       Various daemon related sub-commands
     doctor       Check ROS setup and other potential issues
     interface    Show information about ROS interfaces
     launch       Run a launch file
     lifecycle    Various lifecycle related sub-commands
     multicast    Various multicast related sub-commands
     node         Various node related sub-commands
     param        Various param related sub-commands
     pkg          Various package related sub-commands
     run          Run a package specific executable
     security     Various security related sub-commands
     service      Various service related sub-commands
     topic        Various topic related sub-commands
     wtf          Use `wtf` as alias to `doctor`
   ```

2. **常见命令作用速查**

   每一个 `command` 都对应 ROS2 的一类工具，前面学习过的大部分 CLI 命令都属于这些分类。

| 命令                   | 作用                              | 常用程度  |
| -------------------- | ------------------------------- | ----- |
| **`ros2 run`**       | 运行某个功能包中的可执行文件                  | 很常用   |
| **`ros2 node`**      | 查看和管理节点信息                       | 很常用   |
| **`ros2 topic`**     | 查看、发布、回显话题数据                    | 很常用   |
| **`ros2 service`**   | 查看和调用服务                         | 常用    |
| **`ros2 action`**    | 查看和发送 Action 目标任务               | 常用    |
| **`ros2 interface`** | 查看 `.msg`、`.srv`、`.action` 接口信息 | 很常用   |
| **`ros2 param`**     | 查看、设置、保存节点参数                    | 常用    |
| **`ros2 launch`**    | 运行 launch 文件，一次启动多个节点           | 很常用   |
| **`ros2 bag`**       | 录制和回放 ROS2 话题数据                 | 常用    |
| **`ros2 pkg`**       | 创建、查看功能包相关信息                    | 常用    |
| `ros2 doctor`        | 检查 ROS2 环境和潜在问题                 | 排错时使用 |
| `ros2 component`     | 管理组件化节点                         | 后期使用  |
| `ros2 lifecycle`     | 管理生命周期节点                        | 后期使用  |
| `ros2 daemon`        | 管理 ROS2 后台守护进程                  | 排错时使用 |

3. **查看某个命令的具体用法**

   如果忘记某个命令怎么用，可以在命令后面加 `-h` 查看帮助：
   ```bash
   ros2 <command> -h
   ```





