# colcon 指令集

> [!NOTE]
> 参考资料：
> - [colcon 官方安装文档](https://colcon.readthedocs.io/en/released/user/installation.html)
> - [colcon build 官方文档](https://colcon.readthedocs.io/en/released/reference/verb/build.html)
> - [colcon list 官方文档](https://colcon.readthedocs.io/en/released/reference/verb/list.html)
> - [colcon test 官方文档](https://colcon.readthedocs.io/en/released/reference/verb/test.html)
> - [colcon package selection arguments 官方文档](https://colcon.readthedocs.io/en/released/reference/package-selection-arguments.html)

## 一、核心理解

**`colcon` 是 ROS2 常用的工作空间构建工具**，主要负责把 `src` 目录中的功能包编译到 `build/`、`install/`、`log/` 等目录中。

可以这样理解：
```text
src/       源码区：放功能包源码
build/     构建区：放编译过程中的中间文件
install/   安装区：放编译后的可运行结果和环境脚本
log/       日志区：放构建过程日志
```

## 二、常用指令速查

| 指令 | 作用 | 重要性 |
| ---- | ---- | ------ |
| **`colcon build`** | 构建当前工作空间中的功能包 | 常用 |
| **`colcon build --packages-select <package_name>`** | 只构建指定功能包 | 常用 |
| **`colcon build --packages-up-to <package_name>`** | 构建指定包及其递归依赖 | 常用 |
| **`colcon build --symlink-install`** | 使用符号链接安装，适合开发调试 | 常用 |
| **`source install/setup.bash`** | 加载当前工作空间环境 | 常用 |
| `colcon list` | 列出工作空间中的功能包 | 常用 |
| `colcon info <package_name>` | 查看功能包详细信息 | 常用 |
| `colcon graph` | 查看功能包依赖关系 | 调试 |
| `colcon test` | 运行测试 | 测试 |
| `colcon test-result` | 汇总测试结果 | 测试 |

## 三、安装与帮助

1. **安装 colcon**

   Ubuntu/ROS2 环境下常用安装方式：
   ```bash
   sudo apt update
   sudo apt install python3-colcon-common-extensions
   ```

   `python3-colcon-common-extensions` 是一组常用 Colcon 扩展集合，适合 ROS2 学习阶段直接安装。

2. **查看帮助**

   查看 Colcon 总帮助：
   ```bash
   colcon --help
   ```

   查看某个子命令帮助：
   ```bash
   colcon build --help
   ```

## 四、构建工作空间

1. **构建整个工作空间**

   在工作空间根目录下执行：
   ```bash
   colcon build
   ```

   执行后通常生成：
   ```text
   build/
   install/
   log/
   ```

2. **使用符号链接安装**

   开发调试时常用：
   ```bash
   colcon build --symlink-install
   ```

   **作用**：减少文件复制，修改 Python 脚本或资源文件后更方便调试。

3. **只构建指定功能包**

   只编译某一个包：
   ```bash
   colcon build --packages-select <package_name>
   ```

   示例：
   ```bash
   colcon build --packages-select my_robot_pkg
   ```

4. **构建指定包及其依赖**

   当某个包依赖其他包时，使用：
   ```bash
   colcon build --packages-up-to <package_name>
   ```

   **适合场景**：只想构建目标包相关的最小依赖集合。

5. **跳过指定功能包**

   不构建某些包：
   ```bash
   colcon build --packages-skip <package_name>
   ```

6. **构建失败后继续构建其他包**

   某个包失败时，继续构建其他不依赖它的包：
   ```bash
   colcon build --continue-on-error
   ```

## 五、加载工作空间环境

1. **加载当前工作空间**

   编译完成后，如果要让终端识别当前工作空间中的功能包，需要执行：
   ```bash
   source install/setup.bash
   ```

2. **常见 source 顺序**

   使用 ROS2 Foxy + 自己工作空间时，一般顺序是：
   ```bash
   source /opt/ros/foxy/setup.bash
   source install/setup.bash
   ```

   **理解**：
   ```text
   /opt/ros/foxy/setup.bash = 加载 ROS2 系统环境
   install/setup.bash       = 加载当前工作空间环境
   ```

## 六、查看功能包信息

1. **列出工作空间中的功能包**

   查看包路径、包名和构建类型：
   ```bash
   colcon list
   ```

2. **只显示包名**

   ```bash
   colcon list --names-only
   ```

3. **按依赖拓扑顺序显示**

   ```bash
   colcon list --topological-order
   ```

4. **查看功能包详细信息**

   ```bash
   colcon info <package_name>
   ```

   可用于查看包名、类型、依赖和元数据等信息。

## 七、查看依赖关系

1. **查看依赖图**

   ```bash
   colcon graph
   ```

2. **显示图例**

   ```bash
   colcon graph --legend
   ```

3. **输出 DOT 格式**

   ```bash
   colcon graph --dot
   ```

   DOT 格式适合进一步用图形工具渲染依赖图。

## 八、测试相关

1. **运行测试**

   ```bash
   colcon test
   ```

2. **只测试指定功能包**

   ```bash
   colcon test --packages-select <package_name>
   ```

3. **查看测试结果**

   ```bash
   colcon test-result
   ```

4. **显示详细测试结果**

   ```bash
   colcon test-result --verbose
   ```

## 九、常用工作流

1. **第一次构建工作空间**

   ```bash
   cd ~/turtle_ws
   colcon build --symlink-install
   source install/setup.bash
   ```

2. **修改某个功能包后重新构建**

   ```bash
   colcon build --packages-select <package_name> --symlink-install
   source install/setup.bash
   ```

3. **构建并测试指定功能包**

   ```bash
   colcon build --packages-select <package_name>
   colcon test --packages-select <package_name>
   colcon test-result --verbose
   ```

> [!warning]
> `colcon build` 通常要在工作空间根目录执行，也就是包含 `src/` 的目录。不要在 `src/` 目录里直接构建整个工作空间。
