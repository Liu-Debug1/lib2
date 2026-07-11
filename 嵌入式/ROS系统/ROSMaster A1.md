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
#### 源码分析

> [!abstract] 核心结论
> 教程虽然称为“线速度标定”，但程序实际是在校准**纵向里程计的距离比例系数**：标定节点发布 `/cmd_vel` 驱动小车，通过监听 `odom` 与 `base_footprint` 的 TF 变换计算位移，到达目标距离后停车，再用卷尺测量的真实距离修正 `linear_scale_x`。

1. **先看懂程序的数据闭环**

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

2. **把 Python 语法映射成 C++**

| Python | C++ | 含义 |
| --- | --- | --- |
| `self.xxx` | `this->xxx_` | 访问类成员 |
| `def on_timer(self):` | `void onTimer()` | 定时器回调函数 |
| `Twist()` | `geometry_msgs::msg::Twist{}` | 创建速度消息 |
| `sqrt()` | `std::sqrt()` | 计算平方根 |
| `copysign(a, b)` | `std::copysign(a, b)` | 取 `a` 的大小和 `b` 的符号 |
| `try / except` | `try / catch` | 异常处理 |
| `print()` | `RCLCPP_INFO()` | ROS 2 日志输出 |
| `True / False` | `true / false` | 布尔值 |

3. **理解两个运行状态**

```text
start_test = false
    ├── 记录起点 x_start、y_start
    └── 发布零速度，等待开始

start_test = true
    ├── 查询当前 TF 位置
    ├── 计算位移和误差
    ├── 未到目标：发布运动速度
    └── 到达目标：停车并复位 start_test
```

4. **掌握位移和误差公式**

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

当 $|e|<tolerance$ 时，程序认为已经到达目标并停车。

> [!warning]
> `tolerance` 只是程序内部基于里程计的停车容差，不等于卷尺测得的实际距离误差。实际精度必须通过多次外部测量验证。

5. **用 C++ 理解核心控制逻辑**

```cpp
/*
 * 功能：执行一次底盘纵向里程计标定控制周期。
 * 适用场景：ROS 2 定时器回调，根据 TF 位移误差发布 /cmd_vel。
 * 参数：无；测试距离、速度、容差和比例系数来自节点成员或 ROS 2 参数。
 * 返回值：无；通过发布 Twist 消息输出运动或停车指令。
 * 数据修改：更新测试状态；不修改输入数据。
 * 前置条件：odom 到 base_footprint 的 TF 有效，参数已经初始化。
 * 边界情况：TF 无效或参数越界时应发布零速度并退出本周期。
 * 复杂度：时间 O(1)，空间 O(1)。
 * 工程约束：不在中断上下文调用；多线程执行器下需保护共享状态；
 *           控制周期内不应进行不必要的动态内存分配。
 */
void onTimer()
{
    geometry_msgs::msg::Twist move_cmd{};  // 默认值全为 0，即停车指令

    if (!start_test_) {
        start_x_ = current_x_;
        start_y_ = current_y_;
        cmd_vel_pub_->publish(move_cmd);
        return;
    }

    const double delta_x = current_x_ - start_x_;
    const double delta_y = current_y_ - start_y_;
    double distance = std::sqrt(delta_x * delta_x + delta_y * delta_y);
    distance *= odom_linear_scale_correction_;

    const double error = distance - test_distance_;

    if (std::abs(error) < tolerance_) {
        start_test_ = false;
        cmd_vel_pub_->publish(move_cmd);
        RCLCPP_INFO(this->get_logger(), "Linear calibration completed");
        return;
    }

    // 距离不足时前进，超过目标时后退。
    move_cmd.linear.x = std::copysign(speed_, -error);
    cmd_vel_pub_->publish(move_cmd);
}
```

6. **理解 `std::copysign()` 的控制作用**

```cpp
move_cmd.linear.x = std::copysign(speed_, -error);
```

| 当前状态 | `error` | `-error` | 发布速度 |
| --- | ---: | ---: | --- |
| 距离不足 | `< 0` | `> 0` | 正速度，继续前进 |
| 超过目标 | `> 0` | `< 0` | 负速度，向后修正 |

该方法属于固定速度的**开关控制**，不是 PID。速度过大、控制周期过长或 `tolerance` 过小时，可能在目标点附近往复振荡。

7. **对应掌握 ROS 2 C++ API**

| 功能 | C++ API |
| --- | --- |
| 声明参数 | `declare_parameter<double>("speed", 0.1)` |
| 读取参数 | `get_parameter("speed").as_double()` |
| 创建发布器 | `create_publisher<geometry_msgs::msg::Twist>()` |
| 创建定时器 | `create_wall_timer()` |
| 发布速度 | `cmd_vel_pub_->publish(move_cmd)` |
| 查询 TF | `tf_buffer_->lookupTransform()` |
| 输出日志 | `RCLCPP_INFO()`、`RCLCPP_WARN()` |

8. **源码阅读时重点检查工程问题**

   1. 原程序连续调用两次 `get_position()` 获取 `x`、`y`，两次 TF 可能来自不同时刻；更合理的做法是一次查询，同时读取两个坐标。
   2. TF 查询失败后直接 `raise` 可能使回调异常退出；底盘控制程序应先发布零速度，再记录警告并等待下一周期重试。
   3. 欧氏距离只表示起点到终点的直线距离，无法反映弯曲轨迹的实际路程，因此标定时还要观察横向偏移和航向误差。
   4. 固定速度控制接近终点时没有减速过程，容易过冲或打滑；工程实现可增加速度斜坡或分段降速。
   5. 参数需要检查有效范围，例如 `speed > 0`、`test_distance > 0`、`tolerance > 0`。
   6. 教程给出的源码路径是 `calibrate_angular_A1.py`，与线速度标定内容不一致，疑似文档笔误，应在工作空间中查找实际的 `calibrate_linear` 文件。

> [!bug] 参数调整方向需要实测确认
> 教程说实际距离不足时增大 `odom_linear_scale_correction`，但展示的源码执行 `distance *= odom_linear_scale_correction`。按照该停车逻辑，增大系数可能使程序更早停车。应分别测试 `K=1.00` 和 `K=1.05`，确认实际距离变化方向后再调整，不能机械照抄教程。

9. **完成一次可复现的标定实验**

   1. 在平整地面标出 `1.000 m`，选择车体上固定参考点对齐起点。
   2. 设置 `test_distance=1.0`、`speed=0.1`，比例系数从 `1.0` 开始。
   3. 每个系数至少重复测试 3～5 次，记录实际距离、误差和横向偏移。
   4. 每次只调整 `2%～5%`，先验证参数调整方向，再逐步收敛。
   5. 标定后使用 `2 m` 距离独立验证，并分别测试正向和反向运动。

| 轮次 | 比例系数 | 目标距离/m | 实际距离/m | 误差/mm | 横向偏移/mm | 备注 |
| ---: | ---: | ---: | ---: | ---: | ---: | --- |
| 1 | 1.000 | 1.000 |  |  |  |  |
| 2 | 1.000 | 1.000 |  |  |  |  |
| 3 | 1.000 | 1.000 |  |  |  |  |

10. **本节学习验收标准**

    1. 能画出 `/cmd_vel → 底盘 → /odom_raw → EKF → /odom → TF → 标定节点` 的闭环。
    2. 能解释 `odom`、`base_footprint` 和 `lookupTransform()` 的作用。
    3. 能推导位移、比例修正和误差公式。
    4. 能把 Python 中的核心逻辑口头翻译成 ROS 2 C++。
    5. 能解释为什么比例误差可以标定，而随机打滑不能靠固定比例系数消除。
    6. 能指出 TF 异常、过冲、走偏和参数方向错误时的排查方法。






