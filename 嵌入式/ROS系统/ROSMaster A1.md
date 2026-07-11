---
title: ROSMASTER A1 三天学习记录
---
## 如何看ROS代码

执行基本框架
```
main()
  ↓
rclcpp::init()
  ↓
std::make_shared<MyNode>()
  ↓
进入 MyNode 构造函数
  ↓
创建发布者/订阅者/定时器/服务
  ↓
rclcpp::spin(node)
  ↓
等待事件
  ↓
有消息/定时器/服务请求时，自动调用回调函数
  ↓
rclcpp::shutdown()
```



记住几个常用API：

| API                                                  | 作用                      |
| ---------------------------------------------------- | ----------------------- |
| `create_publisher<MsgType>(topic, qos)`              | 创建发布者                   |
| `create_subscription<MsgType>(topic, qos, callback)` | 创建订阅者                   |
| `create_service<SrvType>(service, callback)`         | 创建服务端                   |
| `create_client<SrvType>(service)`                    | 创建客户端                   |
| `create_wall_timer(period, callback)`                | 创建定时器                   |
| `get_logger()`                                       | 获取日志对象，用于 `RCLCPP_INFO` |

## 底盘控制
### 手柄控制
##### 1.节点通讯图

![[Pasted image 20260708205351.png]]
对应Launch文件
```python
    node1 = Node(
        package='joy',
        executable='joy_node',
    )
    joy_node = Node(
        package='yahboomcar_ctrl',
        executable='yahboom_joy_A1',
    )
    bringup_node = Node(
        package='yahboomcar_bringup',
        executable='Ackman_driver_A1',
    )
```
解读：
`joy_node` 负责读取手柄硬件，并将按键和摇杆状态发布到 `/joy` 话题；`joy_ctrl` 订阅 `/joy`，根据 值解析用户操作，并发布 `/cmd_vel`、`/Servo`、`/Buzzer` 三类控制话题；`driver_node` 订阅这些控制话题后，调用底层驱动控制电机、舵机和蜂鸣器执行相应动作。
#### 2./joy_Ctrl 节点下的数据处理

| 输入            | 处理                                         | 输出                                 |
| ------------- | ------------------------------------------ | ---------------------------------- |
| `buttons[9]`  | 调用 `self.cancel_nav()`，取消导航                | 不直接发布这三个话题，具体看 `cancel_nav()` 内部实现 |
| `buttons[11]` | 翻转 `self.Buzzer_active`，生成 `Bool` 消息       | 直接发布 `/Buzzer`                     |
| `buttons[13]` | 调整 `self.linear_Gear` 线速度档位                |                                    |
| `buttons[14]` | 档位相关处理，代码里也是调整 `self.linear_Gear`          |                                    |
| `axes[6]`     | 更新 `self.servos1`，写入 `self.servo_angle.s1` | 发布 `/Servo`                        |
| `axes[7]`     | 更新 `self.servos2`，写入 `self.servo_angle.s2` | 发布 `/Servo`                        |
| `axes[1]`     | 计算 `xlinear_speed`，写入 `twist.linear.x`     | 发布 `/cmd_vel`                      |
| `axes[2]`     | 计算 `ylinear_speed`，写入 `twist.linear.y`     | 发布 `/cmd_vel`                      |
| `axes[2]`     | 计算 `angular_speed`，写入 `twist.angular.z`    | 发布 `/cmd_vel`                      |

### 键盘控制

#### 1.节点关系图
![[Pasted image 20260708223947.png]]
解读：
	`keyboard_ctrl` 节点直接从终端读取键盘按键，通过 `moveBindings` 和 `speedBindings` 将按键映射为线速度和角速度，并封装成 `geometry_msgs/msg/Twist` 消息发布到 `/cmd_vel`；`driver_node` 订阅 `/cmd_vel` 后调用底层驱动控制小车运动。

#### 2. keyboard_ctrl节点下的数据处理

| 输入       | 处理                           | 输出                           |
| -------- | ---------------------------- | ---------------------------- |
| `i`      | `x = 1`，`th = 0`             | `twist.linear.x = speed`，前进  |
| `,`      | `x = -1`，`th = 0`            | `twist.linear.x = -speed`，后退 |
| `j`      | `x = 0`，`th = 1`             | `twist.angular.z = turn`，左转  |
| `l`      | `x = 0`，`th = -1`            | `twist.angular.z = -turn`，右转 |
| `q`      | `speed *= 1.1`，`turn *= 1.1` | 提高线速度和角速度                    |
| `z`      | `speed *= 0.9`，`turn *= 0.9` | 降低线速度和角速度                    |
| `s`      | `stop = not stop`            | 切换停止/运行                      |
| 空格       | `(x, th) = (0, 0)`           | 发布零速度                        |
| `Ctrl+C` | `break`                      | 退出程序                         |

### 线速度标定

源码解析
```text
calibrate_linear 节点
        │ 发布 /cmd_vel
        ▼
    底盘执行运动
        │ 编码器输出 /odom_raw
        ▼
ekf_filter_node ◄── /imu/data
        │ 发布 /odom 和 TF
        ▼
odom → base_footprint
        │ 查询当前位置
        ▼
calibrate_linear 计算位移误差
        │
        ├── 未到目标：继续发布速度
        └── 到达目标：发布零速度
```

| Python                | C++                           | 含义                 |
| --------------------- | ----------------------------- | ------------------ |
| `self.xxx`            | `this->xxx_`                  | 访问类成员              |
| `def on_timer(self):` | `void onTimer()`              | 定时器回调函数            |
| `Twist()`             | `geometry_msgs::msg::Twist{}` | 创建速度消息             |
| `sqrt()`              | `std::sqrt()`                 | 计算平方根              |
| `copysign(a, b)`      | `std::copysign(a, b)`         | 取 `a` 的大小和 `b` 的符号 |
| `try / except`        | `try / catch`                 | 异常处理               |
| `print()`             | `RCLCPP_INFO()`               | ROS 2 日志输出         |
| `True / False`        | `true / false`                | 布尔值                |


**掌握位移和误差公式**：

从 TF 中获取当前位置 $(x,y)$，与起点 $(x_0,y_0)$ 计算二维直线距离：

$$
d_{odom}=\sqrt{(x-x_0)^2+(y-y_0)^2}
$$

使用比例系数修正：

$$
d_{corrected}=K_{linear}d_{odom}
$$

计算目标距离误差：

$$
e=d_{corrected}-d_{target}
$$

### 角速度标定

> [!abstract] 核心结论
> 教程称为“角速度标定”，实际主要校准的是**里程计累计旋转角度的比例系数**。标定节点发布 `/cmd_vel.angular.z`，从 `odom` 与 `base_footprint` 的 TF 中获取姿态，通过累计偏航角判断是否完成目标旋转角度。

源码解析：
```text
calibrate_angular 节点
        │ 发布 /cmd_vel.angular.z
        ▼
      底盘旋转
        │ 编码器 /odom_raw + IMU /imu/data
        ▼
  ekf_filter_node 数据融合
        │ 发布 /odom 和 TF
        ▼
读取 odom → base_footprint 的四元数
        │ 转换为偏航角 yaw
        ▼
归一化相邻两次角度差并累计
        │
        ├── 未到目标：继续发布角速度
        └── 到达目标：发布零速度
```

1. **理解主要参数**

| 参数 | 作用 | 单位/说明 |
| --- | --- | --- |
| `test_angle` | 目标旋转角度 | RQT 中输入度，程序内部转换为弧度 |
| `speed` | 指令角速度大小 | `rad/s` |
| `tolerance` | 程序内部的角度停止容差 | 应与内部弧度单位保持一致 |
| `odom_angular_scale_correction` | 里程计旋转角度比例系数 | 无量纲 |
| `start_test` | 标定启动开关 | `true` 时开始旋转 |
| `base_frame` | 车体基坐标系 | 通常为 `base_footprint` |
| `odom_frame` | 里程计坐标系 | 通常为 `odom` |

2. **掌握角度与弧度转换**

RQT 中的 `test_angle` 使用角度，ROS 2 控制和计算通常使用弧度：

$$
\theta_{rad}=\theta_{deg}\frac{\pi}{180}
$$

Python 与 C++ 对应关系：

| Python | C++ |
| --- | --- |
| `radians(test_angle)` | `test_angle * kPi / 180.0` |
| `degrees(angle)` | `angle * 180.0 / kPi` |
| `move_cmd.angular.z` | `move_cmd.angular.z` |
| `copysign(speed, error)` | `std::copysign(speed, error)` |

其中 C++17 可自行定义：

```cpp
constexpr double kPi = 3.14159265358979323846;
```

3. **理解四元数转换为偏航角**

TF 返回姿态四元数 $(x,y,z,w)$。源码使用 `PyKDL` 转为 Roll、Pitch、Yaw，并取绕 Z 轴旋转的 `yaw`：

```python
angle_rot = cacl_rot.GetRPY()[2]
```

ROS 2 C++ 中可写为：

```cpp
const double yaw = tf2::getYaw(transform.transform.rotation);
```

| 姿态角 | 含义 | 车辆场景 |
| --- | --- | --- |
| Roll | 绕 X 轴旋转 | 车身侧倾 |
| Pitch | 绕 Y 轴旋转 | 车身俯仰 |
| Yaw | 绕 Z 轴旋转 | 车辆转向，角速度标定使用该值 |

4. **必须理解角度归一化**

`yaw` 通常限制在 $[-\pi,\pi]$。当角度从 $179^\circ$ 变化到 $-179^\circ$ 时，直接相减会错误得到 $-358^\circ$，实际只旋转了 $2^\circ$。

因此每个周期需要计算：

$$
\Delta\theta_k=\operatorname{normalize}(\theta_k-\theta_{k-1})
$$

将角度差归一化到 $[-\pi,\pi]$ 后再累计：

$$
\theta_{turn}=\theta_{turn}+K_{angular}\Delta\theta_k
$$

ROS 2 C++ 中可使用：

```cpp
const double delta_angle = angles::normalize_angle(current_yaw - previous_yaw_);
turn_angle_ += odom_angular_scale_correction_ * delta_angle;
```

> [!note]
> 单次 `yaw` 只能表示有限范围内的朝向，无法直接表示“已经连续转过 360°”。程序必须累计每个控制周期的角度增量。

5. **理解误差与旋转方向控制**

目标角度和累计角度的误差为：

$$
e=\theta_{turn}-\theta_{target}
$$

教程源码使用：

```python
move_cmd.angular.z = copysign(self.speed, self.error)
```

其本质是根据误差符号决定旋转方向，并以固定角速度旋转。完成一次测试后，程序通过 `reverse = -reverse` 切换下一轮的旋转方向。

> [!warning]
> 这种方法属于固定幅值的开关控制，不是 PID。角速度过大、定时器周期过长或容差过小时，车辆可能越过目标角度并在终点附近反复修正。

6. **源码阅读时重点检查的问题**

   1. `get_odom_angle()` 在 TF 查询失败时直接返回空值，后续参与角度减法可能产生异常；工程实现应先停车，再等待下一周期重新查询。
   2. 当前周期先根据旧的 `turn_angle` 计算误差，再更新本周期角度，控制判断存在一个周期的延迟。
   3. `lookup_transform(target_frame, source_frame)` 的参数顺序决定角度正方向，必须通过实际左转、右转验证符号。
   4. 固定角速度接近目标时没有减速过程，容易过冲；可采用分段降速或闭环角度控制。
   5. 仅测试一次 360° 无法判断重复性，应分别进行顺时针、逆时针多次测试。

> [!bug] 教程中的可疑内容
> - “向前直走 1 米”是从线速度教程复制过来的错误描述，角速度标定应测试旋转角度。
> - `odom_angular_scale_correction` 被误写为“线速度比例系数”。
> - 教程要求将结果写入 `linear_scale_y`，参数名与角速度标定不匹配。修改前必须检查 `yahboomcar_bringup_A1_launch.py` 和底盘驱动源码，确认该参数的真实用途。

7. **角速度标定实验记录**

   1. 以车体中心为基准，在地面标出初始车头方向。
   2. 设置 `test_angle=360`，使用较低角速度开始测试。
   3. 每个比例系数分别进行顺、逆时针各 3～5 次测试。
   4. 每次记录实际角度误差、是否过冲以及最终车体位置偏移。
   5. 使用 `90°`、`180°`、`360°` 三组角度验证比例系数是否具有一致性。

| 轮次 | 方向 | 比例系数 | 目标角度/° | 实际角度/° | 误差/° | 位置偏移/mm |
| ---: | --- | ---: | ---: | ---: | ---: | ---: |
| 1 | 逆时针 | 1.000 | 360 |  |  |  |
| 2 | 逆时针 | 1.000 | 360 |  |  |  |
| 3 | 顺时针 | 1.000 | 360 |  |  |  |

8. **本节学习验收标准**

   1. 能解释 `/cmd_vel.angular.z` 的物理含义和单位。
   2. 能说明四元数为什么需要转换为 `yaw`。
   3. 能解释 $179^\circ\rightarrow-179^\circ$ 时为什么必须进行角度归一化。
   4. 能推导角度增量累计和比例修正公式。
   5. 能用 `tf2::getYaw()`、`angles::normalize_angle()` 和 `std::copysign()` 阅读对应的 C++ 实现。
   6. 能通过顺、逆时针重复试验区分比例误差、零偏和随机误差。

### URDF模型

> [!abstract] 核心结论
> URDF 使用 XML 描述机器人的**刚体、关节、坐标系、外观、碰撞和惯性参数**。机器人模型本质上是一棵由 `link` 和 `joint` 组成的树；URDF/Xacro 被加载到 `robot_description` 后，`robot_state_publisher` 根据模型与 `/joint_states` 发布 TF，RViz 再依据 TF 和网格文件显示机器人。

1. **启动模型并查看 TF 树**

   1. 启动文件路径：
```text
~/yahboomcar_ros2_ws/yahboomcar_ws/src/yahboomcar_description/launch/display_A1.launch.py
```
   2. 启动 ROSMASTER A1 模型：
```bash
ros2 launch yahboomcar_description display_A1.launch.py
```
   3. 查看 TF 树：
```bash
ros2 run rqt_tf_tree rqt_tf_tree
```

2. **理解模型显示链路**

```text
URDF/Xacro 文件
      │ 展开并写入 robot_description 参数
      ▼
robot_state_publisher ◄── /joint_states
      │ 计算并发布各坐标系之间的 TF
      ▼
RViz 读取 robot_description、TF 和 mesh
      │
      └── 显示机器人模型和关节运动
```

| 组件                          | 作用                 |
| --------------------------- | ------------------ |
| URDF/Xacro                  | 描述机器人结构和物理属性       |
| `robot_description`         | 保存展开后的完整机器人 XML    |
| `joint_state_publisher_gui` | 通过滑块生成可动关节状态       |
| `/joint_states`             | 发布关节名称、位置、速度和力矩    |
| `robot_state_publisher`     | 根据关节状态和 URDF 计算 TF |
| RViz                        | 根据模型资源和 TF 显示机器人   |

> [!note]
> 固定关节的 TF 可直接由 URDF 确定；可动关节除了需要 URDF 的结构定义，还需要 `/joint_states` 提供当前关节位置。

3. **理解 `link` 与 `joint`**

```text
parent link
    │
    │ joint：规定安装位姿、运动类型、运动轴和限制
    ▼
child link
```

- `link`：刚体，同时对应一个坐标系，例如车身、车轮、IMU、雷达和相机。
- `joint`：连接两个 `link`，描述子刚体相对父刚体如何安装和运动。
- 除根 `link` 外，每个子 `link` 只能有一个父关节，因此 URDF 必须构成树，不能形成闭环。

ROSMaster A1 的模型可抽象为：
```text
base_link
├── imu_link
├── camera_link
├── lidar_link
├── front_left_wheel
├── front_right_wheel
├── rear_left_wheel
└── rear_right_wheel
```

4. **掌握 `link` 的三组核心属性**

| 标签 | 描述内容 | 主要使用者 |
| --- | --- | --- |
| `<visual>` | 外观、颜色、显示网格及其位姿 | RViz、Gazebo 渲染 |
| `<collision>` | 用于碰撞检测的几何形状 | Gazebo、MoveIt、规划器 |
| `<inertial>` | 质量、质心和转动惯量 | Gazebo、动力学计算 |

```xml
<link name="base_link">
    <inertial>
        <origin xyz="0 0 0.04" rpy="0 0 0"/>
        <mass value="1.075"/>
        <inertia ixx="0.0017" ixy="0" ixz="0"
                 iyy="0.0033" iyz="0" izz="0.0045"/>
    </inertial>

    <visual>
        <origin xyz="0 0 0" rpy="0 0 0"/>
        <geometry>
            <mesh filename="package://yahboomcar_description/meshes/A1Ackermann/base_link.STL"/>
        </geometry>
    </visual>

    <collision>
        <origin xyz="0 0 0" rpy="0 0 0"/>
        <geometry>
            <mesh filename="package://yahboomcar_description/meshes/A1Ackermann/base_link.STL"/>
        </geometry>
    </collision>
</link>
```

> [!warning]
> 工程中不建议始终使用高面数 STL 作为碰撞模型。视觉模型可以精细，碰撞模型应优先使用圆柱、长方体或低面数网格，以降低碰撞检测和仿真计算量。

5. **理解 `origin` 的坐标语义**

- `xyz="x y z"`：沿 X、Y、Z 轴的相对平移，单位为 `m`。
- `rpy="r p y"`：Roll、Pitch、Yaw，单位为 `rad`。
- `joint/origin`：关节坐标系相对 `parent link` 坐标系的位姿。
- `visual/origin`：视觉几何体相对当前 `link` 坐标系的位姿。
- `collision/origin`：碰撞几何体相对当前 `link` 坐标系的位姿。
- `inertial/origin`：惯性参考系和质心相对当前 `link` 坐标系的位姿。

> [!warning]
> `origin` 描述的是**相对位姿**，不是机器人在全局地图中的绝对坐标。判断一个 `origin` 时，必须先确认它位于 `joint`、`visual`、`collision` 还是 `inertial` 内部。

6. **掌握关节类型**

| 类型 | 自由度与特点 | 常见场景 |
| --- | --- | --- |
| `fixed` | 不允许运动 | IMU、雷达、相机固定安装 |
| `continuous` | 绕指定轴无限旋转 | 无角度限位的车轮 |
| `revolute` | 绕指定轴旋转，有上下限 | 转向节、机械臂关节 |
| `prismatic` | 沿指定轴直线运动，有行程限制 | 直线滑台 |
| `floating` | 3 个平移 + 3 个旋转自由度 | 自由刚体 |
| `planar` | 在平面内平移和旋转 | 平面移动模型 |

```xml
<joint name="front_right_joint" type="continuous">
    <origin xyz="0.08 -0.0845 -0.0389"
            rpy="-1.5703 0 3.14159"/>
    <parent link="base_link"/>
    <child link="front_right_wheel"/>
    <axis xyz="0 0 1"/>
    <limit effort="100" velocity="1"/>
</joint>
```

| 子标签 | 含义 |
| --- | --- |
| `<parent>` | 参照的父 `link` |
| `<child>` | 相对父节点运动的子 `link` |
| `<origin>` | 关节相对父 `link` 的安装位姿 |
| `<axis>` | 关节运动轴，向量应与所需运动方向一致 |
| `<limit>` | 位置、速度和最大驱动力/力矩限制 |
| `<mimic>` | 让当前关节跟随另一个关节 |

> [!note]
> `revolute/continuous` 关节的 `velocity` 单位是 `rad/s`，`effort` 通常是 `N·m`；`prismatic` 关节的 `velocity` 单位是 `m/s`，`effort` 通常是 `N`。

7. **区分 URDF 与 Xacro**

| URDF | Xacro |
| --- | --- |
| 标准 XML 机器人描述文件 | 带变量、宏和条件逻辑的 URDF 生成工具 |
| 内容展开后可直接解析 | 运行时需要先展开为标准 URDF |
| 重复结构容易产生大量复制代码 | 适合复用左右车轮、传感器等重复结构 |

典型 Xacro 参数与宏：
```xml
<xacro:property name="wheel_radius" value="0.0325"/>

<xacro:macro name="wheel" params="name x y z">
    <!-- 根据参数生成对应的 link 和 joint -->
</xacro:macro>
```

手动展开并检查结果：
```bash
ros2 run xacro xacro yahboomcar_A1.urdf.xacro > /tmp/yahboomcar_A1.urdf
check_urdf /tmp/yahboomcar_A1.urdf
```

8. **按系统方法排查模型问题**

| 现象 | 优先检查 |
| --- | --- |
| RViz 不显示模型 | `robot_description` 是否存在、RobotModel 是否订阅正确 |
| 模型零件飞散 | `joint/origin` 的 `xyz/rpy` 和父子关系 |
| 网格不可见 | `package://` 路径、文件名大小写、STL/DAE 文件是否存在 |
| 车轮旋转轴错误 | `<axis xyz>` 和网格自身坐标方向 |
| TF 缺失 | `/joint_states`、`robot_state_publisher` 和关节名称 |
| 模型抖动或跳变 | 多个节点是否重复发布同一 TF |
| Gazebo 中模型不稳定 | 质量、质心、惯量矩阵和碰撞模型是否合理 |

常用检查命令：
```bash
ros2 param get /robot_state_publisher robot_description
ros2 topic echo /joint_states
ros2 run tf2_ros tf2_echo base_link front_right_wheel
ros2 run rqt_tf_tree rqt_tf_tree
```

> [!bug] 教程中的不严谨表述
> - URDF 与 D-H 参数并不等价：D-H 主要描述串联机械臂运动学，URDF 还能描述树形结构、外观、碰撞和惯性。
> - 教程中的 `mess` 是笔误，正确标签是 `<mass>`。
> - `joint` 描述的是两个 `link` 的连接关系，不是“两个关节之间的关系”。
> - 标准 `<axis>` 主要使用 `xyz`，教程示例中的 `rpy` 不是常规 URDF 属性。
> - 教程将所有关节的速度单位都写成 `m/s` 不准确，旋转关节应使用 `rad/s`。

9. **本节学习验收标准**

   1. 能解释 `link`、`joint`、`parent`、`child` 如何组成机器人树。
   2. 能区分 `visual`、`collision` 和 `inertial` 的用途。
   3. 能根据父坐标系解释 `origin xyz/rpy`，而不是把它当成全局坐标。
   4. 能为车轮、转向节、IMU 和雷达选择正确的关节类型。
   5. 能解释 `robot_description`、`/joint_states`、`robot_state_publisher`、TF 和 RViz 的关系。
   6. 能使用 Xacro 减少重复模型代码，并将其展开为标准 URDF 检查。
   7. 能根据“显示异常、TF 缺失、运动轴错误、仿真不稳定”分类排查问题。
