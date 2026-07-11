# ros2 指令集

> [!NOTE]
> 参考资料：
> - [ROS2 Colcon Tutorial 官方文档](https://docs.ros.org/en/foxy/Tutorials/Colcon-Tutorial.html)
> - [ros2cli 官方仓库](https://github.com/ros2/ros2cli)
> - [ROS2 Actions 设计文档](https://design.ros2.org/articles/actions.html)

## 一、核心理解

**`ros2` 是 ROS2 的命令行入口**。它下面有很多子命令，用来运行节点、查看节点、查看话题、调用服务、发送动作目标、管理参数、查看功能包等。

官方 `ros2cli` 仓库给出的基本用法是：
```bash
ros2 --help
ros2 <command> --help
ros2 <command> <verb> --help
```

可以这样理解：
```text
ros2 = 总入口
node/topic/service/action/param/pkg = 子命令
list/info/echo/call/pub = 具体动作
```

## 二、常用指令速查

| 指令                                              | 作用             | 重要性 |
| ----------------------------------------------- | -------------- | --- |
| **`ros2 --help`**                               | 查看 ros2 总帮助    | 常用  |
| **`ros2 run <package_name> <executable_name>`** | 运行某个功能包中的节点程序  | 常用  |
| **`ros2 node list`**                            | 查看当前运行的节点      | 常用  |
| **`ros2 topic list`**                           | 查看当前话题         | 常用  |
| **`ros2 topic echo <topic_name>`**              | 查看话题实时数据       | 常用  |
| **`ros2 service list`**                         | 查看服务列表         | 常用  |
| **`ros2 param list`**                           | 查看参数列表         | 常用  |
| **`ros2 pkg list`**                             | 查看功能包列表        | 常用  |
| **`ros2 launch <package_name> <launch_file>`**  | 启动 launch 文件   | 常用  |
| **`ros2 bag record <topic_name>`**              | 录制话题数据         | 常用  |
| `ros2 doctor`                                   | 检查 ROS2 环境问题   | 调试  |
| `ros2 daemon start/status/stop`                 | 管理 ROS2 daemon | 调试  |

## 三、帮助与环境检查

1. **查看 ros2 总帮助**

   ```bash
   ros2 --help
   ```

2. **查看某个子命令帮助**

   ```bash
   ros2 node --help
   ```

3. **查看某个子命令动作的帮助**

   ```bash
   ros2 topic echo --help
   ```

4. **检查 ROS2 环境**

   ```bash
   ros2 doctor
   ```

   `ros2 doctor` 适合在环境异常、命令不可用、通信异常时使用。

## 四、运行节点

1. **运行功能包中的可执行文件**

   ```bash
   ros2 run <package_name> <executable_name>
   ```

   示例：
   ```bash
   ros2 run turtlesim turtlesim_node
   ```

2. **重映射节点名称**

   ```bash
   ros2 run turtlesim turtlesim_node --ros-args --remap __node:=my_turtle
   ```

   **作用**：同一个可执行文件可以用不同节点名启动，便于多节点实验。

## 五、节点 node

1. **查看节点列表**

   ```bash
   ros2 node list
   ```

2. **查看节点信息**

   ```bash
   ros2 node info <node_name>
   ```

   示例：
   ```bash
   ros2 node info /turtlesim
   ```

> [!NOTE]
> `ros2 node list` 只显示当前正在运行的节点。没有启动节点时，列表为空是正常的。

## 六、话题 topic

1. **查看话题列表**

   ```bash
   ros2 topic list
   ```

2. **查看话题列表并显示类型**

   ```bash
   ros2 topic list -t
   ```

3. **查看话题数据**

   ```bash
   ros2 topic echo <topic_name>
   ```

   示例：
   ```bash
   ros2 topic echo /turtle1/pose
   ```

4. **查看话题类型**

   ```bash
   ros2 topic type <topic_name>
   ```

5. **查看话题详细信息**

   ```bash
   ros2 topic info <topic_name>
   ```

6. **发布一次或持续发布话题数据**

   ```bash
   ros2 topic pub <topic_name> <msg_type> "<data>"
   ```

   示例：
   ```bash
   ros2 topic pub /chatter std_msgs/msg/String "data: Hello world"
   ```

7. **查看话题发布频率**

   ```bash
   ros2 topic hz <topic_name>
   ```

## 七、服务 service

1. **查看服务列表**

   ```bash
   ros2 service list
   ```

2. **查看服务列表并显示类型**

   ```bash
   ros2 service list -t
   ```

3. **查看服务类型**

   ```bash
   ros2 service type <service_name>
   ```

4. **调用服务**

   ```bash
   ros2 service call <service_name> <service_type> "<request>"
   ```

   示例：
   ```bash
   ros2 service call /clear std_srvs/srv/Empty "{}"
   ```

## 八、动作 action

1. **查看 action 列表**

   ```bash
   ros2 action list
   ```

2. **查看 action 列表并显示类型**

   ```bash
   ros2 action list -t
   ```

3. **查看 action 信息**

   ```bash
   ros2 action info <action_name>
   ```

4. **发送 action 目标**

   ```bash
   ros2 action send_goal <action_name> <action_type> "<goal>"
   ```

   **适合场景**：导航到目标点、机械臂执行动作、需要反馈和结果的耗时任务。

## 九、参数 param

1. **查看参数列表**

   ```bash
   ros2 param list
   ```

2. **获取参数值**

   ```bash
   ros2 param get <node_name> <parameter_name>
   ```

3. **设置参数值**

   ```bash
   ros2 param set <node_name> <parameter_name> <value>
   ```

4. **导出参数文件**

   ```bash
   ros2 param dump <node_name>
   ```

5. **加载参数文件**

   ```bash
   ros2 param load <node_name> <parameter_file>
   ```

## 十、功能包 pkg

1. **创建功能包**

   ```bash
   ros2 pkg create <package-name> --build-type {ament_cmake,ament_python} --dependencies <依赖名字>
   ```

2. **查看所有功能包**

   ```bash
   ros2 pkg list
   ```

3. **查看功能包中的可执行文件**

   ```bash
   ros2 pkg executables <package_name>
   ```

   示例：
   ```bash
   ros2 pkg executables turtlesim
   ```

4. **查看功能包安装路径前缀**

   ```bash
   ros2 pkg prefix <package_name>
   ```

5. **查看功能包清单 XML**

   ```bash
   ros2 pkg xml <package_name>
   ```

## 十一、接口 interface

1. **查看接口列表**

   ```bash
   ros2 interface list
   ```

2. **查看某个接口定义**

   ```bash
   ros2 interface show <interface_type>
   ```

   示例：
   ```bash
   ros2 interface show geometry_msgs/msg/Twist
   ```

3. **查看接口原型**

   ```bash
   ros2 interface proto <interface_type>
   ```

## 十二、launch

1. **运行 launch 文件**

   ```bash
   ros2 launch <package_name> <launch_file>
   ```

   示例：
   ```bash
   ros2 launch turtlebot3_gazebo turtlebot3_world.launch.py
   ```

2. **查看 launch 命令帮助**

   ```bash
   ros2 launch --help
   ```

## 十三、bag 数据录制

1. **录制指定话题**

   ```bash
   ros2 bag record <topic_name>
   ```

2. **录制所有话题**

   ```bash
   ros2 bag record -a
   ```

3. **指定输出包名**

   ```bash
   ros2 bag record -o <bag_name> <topic_name>
   ```

4. **查看 bag 信息**

   ```bash
   ros2 bag info <bag_file_name>
   ```

5. **回放 bag**

   ```bash
   ros2 bag play <bag_file_name>
   ```

## 十四、daemon

1. **启动 daemon**

   ```bash
   ros2 daemon start
   ```

2. **查看 daemon 状态**

   ```bash
   ros2 daemon status
   ```

3. **停止 daemon**

   ```bash
   ros2 daemon stop
   ```

> [!NOTE]
> ROS2 daemon 可以加快节点发现相关的 CLI 查询。遇到节点列表异常时，可以尝试重启 daemon。

## 十五、常用排查组合

1. **确认 ROS2 命令是否可用**

   ```bash
   ros2 --help
   printenv ROS_DISTRO
   ```

2. **确认节点是否启动**

   ```bash
   ros2 node list
   ```

3. **确认话题是否存在**

   ```bash
   ros2 topic list -t
   ```

4. **确认话题是否有数据**

   ```bash
   ros2 topic echo <topic_name>
   ```

5. **确认功能包是否存在**

   ```bash
   ros2 pkg list
   ros2 pkg executables <package_name>
   ```

> [!warning]
> `ros2` 指令查询到的是当前终端环境能发现的 ROS2 资源。如果没有先 `source /opt/ros/foxy/setup.bash` 或 `source install/setup.bash`，可能会出现功能包、节点或接口找不到的情况。
