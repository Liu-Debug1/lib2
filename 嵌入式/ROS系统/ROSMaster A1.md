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



### 角速度标定

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


### URDF模型
> URDF 使用 XML 描述机器人的**刚体、关节、坐标系、外观、碰撞和惯性参数**。机器人模型本质上是一棵由 `link` 和 `joint` 组成的树；URDF/Xacro 被加载到 `robot_description` 后，`robot_state_publisher` 根据模型与 `/joint_states` 发布 TF，RViz 再依据 TF 和网格文件显示机器人。

1. **启动模型并查看 TF 树**
```bash
ros2 run rqt_tf_tree rqt_tf_tree
```

2. **流程**

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

3. 组成部分：**`link` 与 `joint`**

```text
parent link
    │
    │ joint：规定安装位姿、运动类型、运动轴和限制
    ▼
child link
```

**（1）Link：**
```xml
在URDF描述性语言中，link是用来描述物理特性，
描述视觉显示：<visual> 标签
描述碰撞属性：<collision> 标签
描述物理惯性：<inertial> 标签
Links还可以描述连杆尺寸(size)\颜色(color)\形状(shape)\惯性矩阵(inertial matrix)\碰撞参数(collision properties)等，每个Link会成为一个坐标系
```

**标签说明：**
```
origin ->描述的是位姿信息； xyz 属性描述的是在大环境中的坐标位置， rpy 属性描述的是自身的姿态。
mess   ->描述的是link的质量。
inertia->惯性参考系，由于转动惯性矩阵的对称性，只需要6个上三角元素 ixx, ixy, ixz, iyy, iyz, izz作为属性。
geometry->标签描述的是形状； mesh 属性主要的功能是去加载纹理文件的， filename 属性纹理路径的文件地址。
material->标签描述的是材质； name 属性为必填项，可以为空，可以重复 。通过【color】标签中的 rgba 属性来描述红、绿、蓝、透明度，中间用空格分隔。颜色的范围为[0-1]。
```


**（2）Joint：**
```
描述两个 link 之间的连接关系、相对安装位姿、运动方式与限制。
```

**关节类型**：

| 类型           | 自由度与特点           | 常见场景          |
| ------------ | ---------------- | ------------- |
| `fixed`      | 不允许运动            | IMU、雷达、相机固定安装 |
| `continuous` | 绕指定轴无限旋转         | 无角度限位的车轮      |
| `revolute`   | 绕指定轴旋转，有上下限      | 转向节、机械臂关节     |
| `prismatic`  | 沿指定轴直线运动，有行程限制   | 直线滑台          |
| `floating`   | 3 个平移 + 3 个旋转自由度 | 自由刚体          |
| `planar`     | 在平面内平移和旋转        | 平面移动模型        |

**标签说明：**

| 子标签                   | 作用                            | 关键属性与工程注意                                                                                                                               |
| --------------------- | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `<origin>`            | 定义关节坐标系相对 `parent link` 的安装位姿 | `xyz` 为平移，单位 `m`；`rpy` 为姿态，单位 `rad`。它是相对父坐标系，不是全局坐标。                                                                                    |
| `<parent>`            | 指定父 `link`                    | `link` 属性填写父刚体名称，是坐标变换的参考对象。                                                                                                            |
| `<child>`             | 指定子 `link`                    | `link` 属性填写相对父节点运动的子刚体名称；每个子 `link` 只能有一个直接父关节。                                                                                         |
| `<axis>`              | 定义关节运动轴                       | 使用 `xyz="x y z"` 表示轴方向；适用于 `revolute`、`continuous` 和 `prismatic`。标准 URDF 的 `<axis>` 不使用 `rpy`。                                          |
| `<limit>`             | 限制关节运动范围、速度和最大输出              | `revolute/prismatic` 可用 `lower/upper` 限制行程；旋转关节 `velocity` 单位为 `rad/s`、`effort` 为 `N·m`，滑动关节分别为 `m/s`、`N`；`continuous` 无 `lower/upper`。 |
| `<mimic>`             | 让当前关节跟随另一个关节                  | `joint` 指定被跟随关节，`multiplier` 和 `offset` 定义比例与偏置；适合联动机构。                                                                                 |
| `<safety_controller>` | 定义软限位和速度保护参数                  | 常用于机械臂等有硬件限位的关节；移动底盘的车轮模型通常不需要。                                                                                                         |


常用检查命令：
```bash
ros2 param get /robot_state_publisher robot_description
ros2 topic echo /joint_states
ros2 run tf2_ros tf2_echo base_link front_right_wheel
ros2 run rqt_tf_tree rqt_tf_tree
```





### TF坐标变换
#### 1.TF介绍

**TF树是ROS中描述多个坐标系之间空间关系的数据结构**：
>某个坐标系相对于另一个坐标系在哪里、朝向如何？

- 存在一个根坐标系
- 父子坐标系关系是一对多
- 任意两个坐标系应只存在唯一的变换路径
- 不能形成闭环

#### 2.TF中的变换

 1. 平移
 $$
\mathbf{t} =
\begin{bmatrix}
x \\
y \\
z
\end{bmatrix}
$$>
>  \(x\)：沿父坐标系 X 轴移动，单位 `m`
>  \(y\)：沿父坐标系 Y 轴移动，单位 `m`
>  \(z\)：沿父坐标系 Z 轴移动，单位 `m`
 
 2. 旋转
$$
\mathbf{q}=(q_x,q_y,q_z,q_w)
$$



#### 3.常见坐标系



## 激光雷达

## 深度相机

## 多车功能






















