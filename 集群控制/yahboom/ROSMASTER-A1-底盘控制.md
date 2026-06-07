---
source: https://www.yahboom.com/study/ROSMASTER-A1
category: 线控底盘
tags:
  - ROS2
  - 底盘控制
  - 阿克曼
  - ROSMASTER-A1
  - yahboom
---

# ROSMASTER A1 底盘控制

> [!NOTE] 来源：亚博智能 ROSMASTER A1 教程「底盘控制」板块，共 6 节课程。

---

## 一、ROS控制

### 1.1 功能说明

- 通过 ROS2 topic 工具控制小车速度、蜂鸣器、舵机
- 读取底层数据：雷达数据、IMU 数据、版本信息等

### 1.2 准备工作

#### 1.2.1 使用前说明

- **树莓派 / Jetson-Nano**：需在宿主机终端先进入 Docker 容器，再执行本节指令（参考本产品教程「机器人配置与操作指引」→「5、进入小车Docker」）
- **Orin / RDK 主板**：直接打开终端执行指令即可

> 以下各节（二~六）的主板差异说明与此相同，不再重复。

#### 1.2.2 使用前配置

该车型搭配了 USB 摄像头、深度相机、两种不同型号的激光雷达，无法自动识别产品，需手动设置机器类型和雷达型号。

```bash
root@ubuntu:/# cd
root@ubuntu:~# vim .bashrc
```

找到对应位置，按 `i` 进入编辑模式，修改为实际的相机和雷达型号（默认 tmini、nuwa）。修改完成后保存退出，执行：

```bash
root@raspberrypi:~# source .bashrc
```

配置参数说明：

| 参数 | 可选值 |
|------|--------|
| `my_robot_type` | A1 |
| `my_lidar` | tmini |
| `my_camera` | nuwa |
| `ROS_DOMAIN_ID` | 61 |
| ROS 版本 | humble |

### 1.3 程序启动

#### 1.3.1 启动命令

进入 Docker 容器后（参考「Docker课程」→「4、Docker启动脚本」），所有指令需在同一容器内执行（参考「Docker课程」→「3、Docker提交与多终端进入」）。

启动底盘数据：

```bash
ros2 run yahboomcar_bringup Ackman_driver_A1
```

查看当前节点：

```bash
ros2 node list
```

查看话题列表：

```bash
ros2 topic list
```

主要话题：

| 话题名 | 话题内容 |
|--------|----------|
| `/Buzzer` | 蜂鸣器 |
| `/Servo` | 舵机 S1、S2 |
| `/cmd_vel` | 速度控制 |
| `/edition` | 版本信息 |
| `/imu/data_raw` | IMU 传感器数据 |
| `/imu/mag` | IMU 磁力计数据 |
| `/vel_raw` | 小车速度信息 |
| `/voltage` | 电池电压信息 |

查询节点发布/订阅的话题消息类型：

```bash
ros2 node info /driver_node
```

#### 1.3.2 发布控制指令

使用格式：`ros2 topic pub <话题名> <消息类型> <消息数据> --once`

**控制速度（建议首次测试将小车架起，车轮不着地）：**

小车以线速度 0.1 m/s 前进：

```bash
ros2 topic pub /cmd_vel geometry_msgs/msg/Twist "{linear: {x: 0.1, y: 0.0, z: 0.0}, angular: {x: 0.0, y: 0.0, z: 0.0}}" --once
```

小车以角速度 1.0 rad/s 转弯（阿克曼底盘转弯需同时给线速度）：

```bash
ros2 topic pub /cmd_vel geometry_msgs/msg/Twist "{linear: {x: 0.1, y: 0.0, z: 0.0}, angular: {x: 0.0, y: 0.0, z: 1.0}}" --once
```

停车（线速度和角速度均为 0）：

```bash
ros2 topic pub /cmd_vel geometry_msgs/msg/Twist "{linear: {x: 0.0, y: 0.0, z: 0.0}, angular: {x: 0.0, y: 0.0, z: 0.0}}" --once
```

> `--once` 表示只发送一帧消息。更多参数参考「ROS2基础课程」→「19、ROS2常用命令工具」。

#### 1.3.3 控制蜂鸣器

启动蜂鸣器：

```bash
ros2 topic pub /Buzzer std_msgs/msg/Bool "data: 1" --once
```

关闭蜂鸣器：

```bash
ros2 topic pub /Buzzer std_msgs/msg/Bool "data: 0" --once
```

#### 1.3.4 控制舵机

> [!warning] 仅购买了云台 USB 摄像头版本需要，深度相机版本不需要。

```bash
ros2 topic pub -1 /Servo yahboomcar_msgs/msg/ServoControl "{'s1': 90, 's2': 35}"
```

#### 1.3.5 读取电池电压数据

正常工作电压范围：10.3V ~ 12V。低于 10.3V 蜂鸣器会报警，需充电。

```bash
ros2 topic echo /voltage
```

#### 1.3.6 读取固件版本

```bash
ros2 topic echo /edition
```

### 1.4 程序核心源码解析

以 `Ackman_driver_A1.py` 为例。

**初始化和话题注册：**

```python
from Rosmaster_Lib import Rosmaster  # 导入驱动库

self.car = Rosmaster()  # 实例化 Rosmaster 对象

# 创建订阅者
self.sub_cmd_vel = self.create_subscription(Twist, "cmd_vel", self.cmd_vel_callback, 1)
self.sub_BUzzer = self.create_subscription(Bool, "Buzzer", self.Buzzercallback, 100)

# 创建发布者
self.EdiPublisher = self.create_publisher(Float32, "edition", 100)
self.volPublisher = self.create_publisher(Float32, "voltage", 100)
self.staPublisher = self.create_publisher(JointState, "joint_states", 100)
self.velPublisher = self.create_publisher(Twist, "vel_raw", 50)
self.imuPublisher = self.create_publisher(Imu, "/imu/data_raw", 100)
self.magPublisher = self.create_publisher(MagneticField, "/imu/mag", 100)
```

**调用驱动库读取 ROS 拓展板信息：**

```python
edition.data = self.car.get_version() * 1.0
battery.data = self.car.get_battery_voltage() * 1.0
ax, ay, az = self.car.get_accelerometer_data()
gx, gy, gz = self.car.get_gyroscope_data()
mx, my, mz = self.car.get_magnetometer_data()
vx, vy, angular = self.car.get_motion_data()
```

**发布话题数据：**

```python
self.imuPublisher.publish(imu)
self.magPublisher.publish(mag)
self.volPublisher.publish(battery)
self.EdiPublisher.publish(edition)
self.velPublisher.publish(twist)
```

**订阅者回调函数：**

```python
def cmd_vel_callback(self, msg):
    ...

def Buzzercallback(self, msg):
    ...
```

---

## 二、手柄控制

> 主板差异说明同 [[#1.2.1 使用前说明|第一节]]。

### 2.1 程序功能说明

通过无线手柄控制小车运动，同时支持控制蜂鸣器、舵机等。

### 2.2 程序启动

#### 2.2.1 查看设备

将无线手柄 USB 接收器插入主控，终端输入：

```bash
ls /dev/input
```

显示有 `js0` 即为无线手柄设备。

#### 2.2.2 测试手柄输入

```bash
sudo jstest /dev/input/js0
```

该手柄有 8 个轴向输入、15 个按键输入，可按动按键测试对应数字（按键正常会显示 on）。

> 若未安装 jstest：`sudo apt-get install joystick`

#### 2.2.3 启动命令

进入 Docker 容器后，启动底盘数据 + 手柄控制：

```bash
ros2 launch yahboomcar_ctrl yahboomcar_joy_launch.py
```

**操作流程：**

1. 按下 **START** 按键，听到蜂鸣器响声后开始遥控
2. 遥控一段时间不用会休眠，需再按 **START** 结束休眠
3. 按下 **R2** 键解除运动控制锁，才能用摇杆控制小车移动

**遥控效果说明：**

| 手柄操作 | 效果 |
|----------|------|
| 左摇杆 上/下 | 前进 / 后退直走 |
| 左摇杆按下 | 降速 |
| 右摇杆 左/右 | 左转 / 右转 |
| 右摇杆按下 | 加速 |
| START 按键 | 控制蜂鸣器 / 结束休眠 |
| 左侧方向键 左/右 | 控制 S1 舵机 左/右动 |
| 左侧方向键 上/下 | 控制 S2 舵机 上/下动 |
| R1 键 | 舵机复位居中 |
| R2 键 | 手柄运动控制开关 |

### 2.3 节点通讯图

```bash
ros2 run rqt_graph rqt_graph
```

若一开始没有显示，选择 **Nodes/Topics(all)**，再点击左上角刷新按钮。

### 2.4 代码解析

**Launch 文件**（`yahboomcar_joy_launch.py`）：

```python
from launch import LaunchDescription
from launch_ros.actions import Node

import os

def generate_launch_description():
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
    launch_description = LaunchDescription([node1, joy_node, bringup_node])
    return launch_description
```

运行了 3 个节点：底盘数据节点 `Ackman_driver_A1`、手柄控制节点 `yahboom_joy_A1`、手柄键值读取节点 `joy_node`。

**手柄控制节点核心逻辑**（`yahboom_joy_A1.py`）：

```python
# 订阅 /joy 话题
self.sub_Joy = self.create_subscription(Joy, 'joy', self.buttonCallback, 10)

def user_jetson(self, joy_data):
    # 取消导航
    if joy_data.buttons[9] == 1:
        self.cancel_nav()

    # 蜂鸣器控制 (START 键)
    if joy_data.buttons[11] == 1:
        Buzzer_ctrl = Bool()
        self.Buzzer_active = not self.Buzzer_active
        Buzzer_ctrl.data = self.Buzzer_active
        self.pub_Buzzer.publish(Buzzer_ctrl)

    # 档位调整（按下摇杆）
    if joy_data.buttons[13] == 1:  # 左摇杆按下 → 降速
        if self.linear_Gear == 1.0:
            self.linear_Gear = 1.0 / 5
        elif self.linear_Gear == 1.0 / 3:
            self.linear_Gear = 2.0 / 4
        elif self.linear_Gear == 2.0 / 3:
            self.linear_Gear = 1

    if joy_data.buttons[14] == 1:  # 右摇杆按下 → 加速
        if self.linear_Gear == 1.0:
            self.linear_Gear = 1.0
        elif self.linear_Gear == 1.0 / 5:
            self.linear_Gear = 1.0

    # 舵机控制（方向键映射到 axes[6]/[7]）
    self.servos1 = int(max(0, min(180, self.servos1 + joy_data.axes[6] * 3)))
    self.servos2 = int(max(0, min(100, self.servos2 + joy_data.axes[7] * 3)))
    self.servo_angle.s1 = self.servos1
    self.servo_angle.s2 = self.servos2

    if not 30 <= self.servo_angle.s1 <= 150:
        self.servo_angle.s2 = max(10, self.servo_angle.s2)

    # 速度控制
    xlinear_speed = self.filter_data(joy_data.axes[1]) * self.xspeed_limit * self.linear_Gear
    ylinear_speed = self.filter_data(joy_data.axes[2]) * self.yspeed_limit * self.linear_Gear
    angular_speed = self.filter_data(joy_data.axes[2]) * self.angular_speed_limit * self.angular_Gear

    # 速度限幅
    if xlinear_speed > self.xspeed_limit:
        xlinear_speed = self.xspeed_limit
    elif xlinear_speed < -self.xspeed_limit:
        xlinear_speed = -self.xspeed_limit
    if ylinear_speed > self.yspeed_limit:
        ylinear_speed = self.yspeed_limit
    elif ylinear_speed < -self.yspeed_limit:
        ylinear_speed = -self.yspeed_limit
    if angular_speed > self.angular_speed_limit:
        angular_speed = self.angular_speed_limit
    elif angular_speed < -self.angular_speed_limit:
        angular_speed = -self.angular_speed_limit

    # 发布控制指令
    twist = Twist()
    twist.linear.x = xlinear_speed
    twist.linear.y = ylinear_speed
    twist.angular.z = angular_speed

    if self.Joy_active == True:
        for i in range(3):
            self.pub_cmdVel.publish(twist)
            self.pub_Servo.publish(self.servo_angle)
```

**遥控键值对应变量**（基于默认模式 `Controller`）：

| 遥控事件 | 对应变量 |
|----------|----------|
| 左摇杆往上 | `axes[1] = 1` |
| 左摇杆往下 | `axes[1] = -1` |
| 右摇杆往左 | `axes[2] = 1` |
| 右摇杆往右 | `axes[2] = -1` |
| 按键 X 按下 | `buttons[3] = 1` |
| 按键 B 按下 | `buttons[1] = 1` |
| 按键 Y 按下 | `buttons[4] = 1` |
| 按键 R1 按下 | `buttons[7] = 1` |
| START 按下 | `buttons[11] = 1` |
| 左摇杆按下 | `buttons[13] = 1` |
| 右摇杆按下 | `buttons[14] = 1` |

查看全部按键事件：

```bash
ros2 topic echo /joy
```

---

## 三、键盘控制

> 主板差异说明同第一节。

### 3.1 程序功能说明

通过键盘控制小车运动，同时支持控制蜂鸣器、舵机。实际发布的是 `linear-x`（X 轴线速度）、`linear-y`（Y 轴线速度）、`angular-z`（Z 轴角速度），因为底盘只能在 2D 平面内移动。

### 3.2 启动键盘控制

#### 3.2.1 启动命令

进入 Docker 容器后：

```bash
ros2 run yahboomcar_bringup Ackman_driver_A1
```

启动键盘控制程序：

```bash
ros2 run yahboomcar_ctrl yahboom_keyboard
```

**方向控制：**

| 按键 | 效果 (linear, angular) | 按键 | 效果 (linear, angular) |
|------|------------------------|------|------------------------|
| `i` / `I` | 前进 (1, 0) | `u` / `U` | 前进+左转 (1, 1) |
| `,` | 后退 (-1, 0) | `o` / `O` | 前进+右转 (1, -1) |
| `j` / `J` | 左转 (0, 1) | `m` / `M` | 后退+右转 (-1, -1) |
| `l` / `L` | 右转 (0, -1) | `.` | 后退+左转 (-1, 1) |

**速度控制：**

| 按键 | 效果 | 按键 | 效果 |
|------|------|------|------|
| `q` / `Q` | 线速度和角速度 +10% | `z` / `Z` | 线速度和角速度 -10% |
| `w` / `W` | 仅线速度 +10% | `x` / `X` | 仅线速度 -10% |
| `e` / `E` | 仅角速度 +10% | `c` / `C` | 仅角速度 -10% |
| `t` / `T` | 线速度 X/Y 轴方向切换 | `s` / `S` | 停止键盘控制 |

查看实时速度话题：

```bash
ros2 topic echo /cmd_vel
```

### 3.3 查看节点关系图

```bash
ros2 run rqt_graph rqt_graph
```

节点关系：

- **yahboom_keyboard_ctrl**：发布 `/cmd_vel` 话题控制底盘
- **/driver_node**：底盘节点，订阅 `/cmd_vel`，与 ROS 扩展板通信，控制各轮速度

### 3.4 源码解析

源码路径：`~/yahboomcar_ros2_ws/yahboomcar_ws/src/yahboomcar_ctrl/yahboomcar_ctrl/yahboom_keyboard.py`

**方向键映射字典：**

```python
moveBindings = {
    'i': (1, 0),   'o': (1, -1),  'j': (0, 1),
    'l': (0, -1),  'u': (1, 1),   ',': (-1, 0),
    '.': (-1, 1),  'm': (-1, -1), 'I': (1, 0),
    'O': (1, -1),  'J': (0, 1),   'L': (0, -1),
    'U': (1, 1),   'M': (-1, -1),
}
```

**速度键映射字典：**

```python
speedBindings = {
    'Q': (1.1, 1.1), 'Z': (.9, .9), 'W': (1.1, 1),
    'X': (.9, 1),    'E': (1, 1.1), 'C': (1, .9),
    'q': (1.1, 1.1), 'z': (.9, .9), 'w': (1.1, 1),
    'x': (.9, 1),    'e': (1, 1.1), 'c': (1, .9),
}
```

**获取按键输入：**

```python
def getKey(self):
    tty.setraw(sys.stdin.fileno())
    rlist, _, _ = select.select([sys.stdin], [], [], 0.1)
    if rlist:
        key = sys.stdin.read(1)
    else:
        key = ''
    termios.tcsetattr(sys.stdin, termios.TCSADRAIN, self.settings)
    return key
```

**主循环——判断键值并发布 `/cmd_vel`：**

```python
while (1):
    key = yahboom_keyboard.getKey()
    if key == "t" or key == "T":
        xspeed_switch = not xspeed_switch
    elif key == "s" or key == "S":
        print("stop keyboard control: {}".format(not stop))
        stop = not stop

    if key in moveBindings.keys():
        x = moveBindings[key][0]
        th = moveBindings[key][1]
        count = 0
    elif key in speedBindings.keys():
        speed = speed * speedBindings[key][0]
        turn = turn * speedBindings[key][1]
        count = 0
        if speed > yahboom_keyboard.linenar_speed_limit:
            speed = yahboom_keyboard.linenar_speed_limit
            print("Linear speed limit reached!")
        if turn > yahboom_keyboard.angular_speed_limit:
            turn = yahboom_keyboard.angular_speed_limit
            print("Angular speed limit reached!")
        print(yahboom_keyboard.vels(speed, turn))
        if (status == 14):
            print(msg)
        status = (status + 1) % 15
    elif key == ' ':
        (x, th) = (0, 0)
    else:
        count = count + 1
        if count > 4:
            (x, th) = (0, 0)  # 超时自动停车
        if (key == '\x03'):
            break

    if xspeed_switch:
        twist.linear.x = speed * x
    else:
        twist.linear.y = speed * x
    twist.angular.z = turn * th

    if not stop:
        yahboom_keyboard.pub.publish(twist)
    if stop:
        yahboom_keyboard.pub.publish(Twist())
```

---

## 四、线速度标定

> 主板差异说明同第一节。

### 4.1 程序说明

通过动态参数调节器（rqt_reconfigure）校准小车线速度。直观验证方式：让小车向前直走 1 米的指令，对比实际行驶距离是否在误差范围内。

### 4.2 启动程序

#### 4.2.1 启动命令

进入 Docker 容器后：

```bash
ros2 launch yahboomcar_bringup yahboomcar_bringup_A1_launch.py
ros2 run yahboomcar_bringup calibrate_linear_A1
ros2 run rqt_reconfigure rqt_reconfigure
```

在 rqt 界面左侧选择 **calibrate_linear** 节点（若未显示，点击 Refresh 刷新）。

**rqt 界面参数说明：**

| 参数 | 说明 |
|------|------|
| `test_distance` | 标定测试距离，默认 1 米 |
| `speed` | 线速度大小 |
| `tolerance` | 误差容忍度 |
| `odom_linear_scale_correction` | 线速度比例系数（测试不理想时修改此值） |
| `start_test` | 测试开关（勾选开始） |
| `direction` | 方向（给麦轮结构使用，本车可忽略） |
| `base_frame` | 基坐标系名称 |
| `odom_frame` | 里程计坐标系名称 |

#### 4.2.2 开始标定

1. 在地上选已知长度参照（卷尺、瓷砖等），将 `test_distance` 设为实际测试距离（如 1 米）
2. 勾选 `start_test` 开始标定
3. 小车监听 `base_footprint` 和 `odom` 的 TF 变换，计算理论行驶距离，误差小于 `tolerance` 时打印 `done` 并停车
4. 若实际跑的距离偏小，适当增大 `odom_linear_scale_correction`；修改参数后点击空白处生效，重新勾选 `start_test` 再次测试
5. 测试完毕后，将最终的 `odom_linear_scale_correction` 值写入 launch 文件的 `linear_scale_x` 参数

> 修改参数后需点击空白处才能写入生效，再重新勾选 `start_test`。

配置文件路径：`~/yahboomcar_ros2_ws/yahboomcar_ws/src/yahboomcar_bringup/launch/yahboomcar_bringup_A1_launch.py`

### 4.3 查看节点关系图

```bash
ros2 run rqt_graph rqt_graph
```

节点关系：

- **imu_filter**：对底盘原始 IMU 数据 `/imu/data` 滤波，发布 `/imu/data`（滤波后）
- **/ekf_filter_node**：订阅原始里程计 `/odom_raw` + 滤波后 IMU，数据融合后发布 `/odom`
- **calibrate_linear**：监听 `odom → base_footprint` 的 TF 变换，发布 `/cmd_vel` 控制底盘

### 4.4 程序核心源码解析

通过 TF 监听 `base_footprint` 与 `odom` 之间的坐标变换，让机器人知道"走了多远"。源码路径：

`~/yahboomcar_ros2_ws/yahboomcar_ws/src/yahboomcar_bringup/yahboomcar_bringup/calibrate_linear_A1.py`

**监听 TF 坐标变换（`CalibrateLinear.get_position`）：**

```python
def get_position(self):
    try:
        now = rclpy.time.Time()
        transform = self.tf_buffer.lookup_transform(
            self.base_frame,
            self.odom_frame,
            now,
            timeout=rclpy.duration.Duration(seconds=1.0))
        return transform
    except (LookupException, ConnectivityException, ExtrapolationException):
        self.get_logger().info('transform not ready')
        raise
```

**定时器回调——判断位移并控制底盘（`CalibrateLinear.on_timer`）：**

```python
def on_timer(self):
    move_cmd = Twist()

    self.start_test = self.get_parameter('start_test').get_parameter_value().bool_value
    self.odom_linear_scale_correction = self.get_parameter(
        'odom_linear_scale_correction').get_parameter_value().double_value
    self.rate = self.get_parameter('rate').get_parameter_value().double_value
    self.test_distance = self.get_parameter('test_distance').get_parameter_value().double_value
    self.direction = self.get_parameter('direction').get_parameter_value().double_value
    self.tolerance = self.get_parameter('tolerance').get_parameter_value().double_value
    self.speed = self.get_parameter('speed').get_parameter_value().double_value

    if self.start_test:
        self.position.x = self.get_position().transform.translation.x
        self.position.y = self.get_position().transform.translation.y
        print("self.position.x: ", self.position.x)
        print("self.position.y: ", self.position.y)

        distance = sqrt(pow((self.position.x - self.x_start), 2) +
                        pow((self.position.y - self.y_start), 2))
        distance *= self.odom_linear_scale_correction
        print("distance: ", distance)

        error = distance - self.test_distance
        print("error: ", error)

        if not self.start_test or abs(error) < self.tolerance:
            self.start_test = rclpy.parameter.Parameter(
                'start_test', rclpy.Parameter.Type.BOOL, False)
            all_new_parameters = [self.start_test]
            self.set_parameters(all_new_parameters)
            print("done")
        else:
            move_cmd.linear.x = copysign(self.speed, -1 * error)
        self.cmd_vel.publish(move_cmd)
    else:
        self.x_start = self.get_position().transform.translation.x
        self.y_start = self.get_position().transform.translation.y
        self.cmd_vel.publish(Twist())
```

---

## 五、角速度标定

> 主板差异说明同第一节。

### 5.1 程序说明

通过动态参数调节器校准小车角速度。直观验证方式：让小车原地旋转指定角度（默认 360°），对比实际旋转角度是否在误差范围内。

### 5.2 启动程序

#### 5.2.1 启动命令

进入 Docker 容器后：

```bash
ros2 launch yahboomcar_bringup yahboomcar_bringup_A1_launch.py
ros2 run yahboomcar_bringup calibrate_angular_A1
ros2 run rqt_reconfigure rqt_reconfigure
```

在 rqt 界面左侧选择 **calibrate_angular** 节点（若未显示，点击 Refresh 刷新）。

**rqt 界面参数说明：**

| 参数 | 说明 |
|------|------|
| `test_angle` | 标定测试角度，默认 360° |
| `speed` | 角速度大小 |
| `tolerance` | 误差容忍度 |
| `odom_angular_scale_correction` | 角速度比例系数（测试不理想时修改此值） |
| `start_test` | 测试开关（勾选开始） |
| `base_frame` | 基坐标系名称 |
| `odom_frame` | 里程计坐标系名称 |

#### 5.2.2 开始标定

1. 在 rqt_reconfigure 中选择 `calibrate_angular` 节点，勾选 `start_test` 开始标定
2. 小车监听 `base_footprint` 和 `odom` 的 TF 变换，计算理论旋转角度，误差小于 `tolerance` 时停车
3. 测试完毕后，将最终的 `odom_angular_scale_correction` 值写入 launch 文件的 `linear_scale_y` 参数

配置文件路径：`~/yahboomcar_ros2_ws/yahboomcar_ws/src/yahboomcar_bringup/launch/yahboomcar_bringup_A1_launch.py`

### 5.3 查看节点关系图

```bash
ros2 run rqt_graph rqt_graph
```

节点关系：

- **imu_filter**：对底盘原始 IMU 数据滤波
- **/ekf_filter_node**：订阅原始里程计 `/odom_raw` + 滤波后 IMU，数据融合后发布 `/odom`
- **calibrate_angular**：监听 `odom → base_footprint` 的 TF 变换，发布 `/cmd_vel` 控制底盘旋转

### 5.4 程序核心源码解析

通过 TF 监听 `base_footprint` 与 `odom` 之间的坐标变换，让机器人知道"转了多少度"。源码路径：

`~/yahboomcar_ros2_ws/yahboomcar_ws/src/yahboomcar_bringup/yahboomcar_bringup/calibrate_angular_A1.py`

**获取里程计角度（`CalibrateAngular.get_odom_angle`）：**

```python
def get_odom_angle(self):
    try:
        now = rclpy.time.Time()
        rot = self.tf_buffer.lookup_transform(
            self.base_frame,
            self.odom_frame,
            now,
            timeout=rclpy.duration.Duration(seconds=1.0))
        cacl_rot = PyKDL.Rotation.Quaternion(
            rot.transform.rotation.x, rot.transform.rotation.y,
            rot.transform.rotation.z, rot.transform.rotation.w)
        angle_rot = cacl_rot.GetRPY()[2]
    except (LookupException, ConnectivityException, ExtrapolationException):
        return
```

**定时器回调——判断旋转角度并控制底盘（`CalibrateAngular.on_timer`）：**

```python
def on_timer(self):
    self.start_test = self.get_parameter('start_test').get_parameter_value().bool_value
    self.odom_angular_scale_correction = self.get_parameter(
        'odom_angular_scale_correction').get_parameter_value().double_value
    self.test_angle = self.get_parameter('test_angle').get_parameter_value().double_value
    self.test_angle = radians(self.test_angle)  # 角度转弧度
    self.speed = self.get_parameter('speed').get_parameter_value().double_value

    move_cmd = Twist()
    self.test_angle *= self.reverse

    if self.start_test:
        self.error = self.turn_angle - self.test_angle

        if abs(self.error) > self.tolerance:
            move_cmd.angular.z = copysign(self.speed, self.error)
            self.cmd_vel.publish(move_cmd)
            self.odom_angle = self.get_odom_angle()
            self.delta_angle = self.odom_angular_scale_correction * \
                self.normalize_angle(self.odom_angle - self.first_angle)
            self.turn_angle += self.delta_angle
            print("turn_angle: ", self.turn_angle, flush=True)
            print("error: ", self.error, flush=True)
            self.first_angle = self.odom_angle
        else:
            self.error = 0.0
            self.turn_angle = 0.0
            print("done", flush=True)
            self.first_angle = 0
            self.reverse = -self.reverse
            self.start_test = rclpy.parameter.Parameter(
                'start_test', rclpy.Parameter.Type.BOOL, False)
            all_new_parameters = [self.start_test]
            self.set_parameters(all_new_parameters)
    else:
        self.error = 0.0
        self.cmd_vel.publish(Twist())
        self.turn_angle = 0.0
        self.start_test = rclpy.parameter.Parameter(
            'start_test', rclpy.Parameter.Type.BOOL, False)
        all_new_parameters = [self.start_test]
        self.set_parameters(all_new_parameters)
```

---

## 六、URDF模型

> 主板差异说明同第一节。

### 6.1 程序功能说明

- 在 RViz 中显示车型的 URDF 模型文件
- 提供 GUI 调试工具窗，通过滑动条驱动模型运动

### 6.2 程序代码参考路径

`~/yahboomcar_ros2_ws/yahboomcar_ws/src/yahboomcar_description/launch/display_A1.launch.py`

### 6.3 程序启动

进入 Docker 容器后：

```bash
ros2 launch yahboomcar_description display_A1.launch.py
```

查看 TF 树：

```bash
ros2 run rqt_tf_tree rqt_tf_tree
```

### 6.4 URDF简介

URDF（Unified Robot Description Format，统一机器人描述格式）是一种使用 XML 格式描述的机器人模型文件，类似于 D-H 参数。

```xml
<?xml version="1.0" encoding="utf-8"?>
<robot name="yahboomcar_A1" xmlns:xacro="http://ros.org/wiki/xacro">
```

- 第一行为 XML 必填项，描述 XML 版本信息
- 第二行描述机器人名称；所有机器人信息包含在 `<robot>` 标签内

#### 6.4.1 组成部分概述

URDF 由两个核心元素构成：

- **link（连杆）**：类比人的手臂，描述物理特性
- **joint（关节）**：类比人的手肘关节，描述两个 link 之间的连接关系

两个 link 通过 joint 连接——类比小臂（link）和大臂（link）通过肘关节（joint）连接。

#### 6.4.2 link 详解

##### 6.4.2.1 简介

link 用于描述物理特性，包含三个主要标签：

| 标签 | 用途 |
|------|------|
| `<visual>` | 描述视觉显示（尺寸、颜色、形状） |
| `<collision>` | 描述碰撞属性 |
| `<inertial>` | 描述物理惯性（不常用） |

每个 link 会成为一个坐标系。

##### 6.4.2.2 示例代码（yahboomcar_A1.urdf.xacro）

```xml
<link name="imu_link"/>

<link name="base_link">
  <inertial>
    <origin xyz="-0.015746541514953 -3.81194310309278E-06 0.0445016032560171" rpy="0 0 0" />
    <mass value="1.07553948051665" />
    <inertia
      ixx="0.00172418331028207"
      ixy="-2.35223116839001E-07"
      ixz="8.3813050960105E-05"
      iyy="0.00329378069831256"
      iyz="-2.25863771079264E-07"
      izz="0.00445732461717744" />
  </inertial>
  <visual>
    <origin xyz="0 0 0" rpy="0 0 0" />
    <geometry>
      <mesh filename="package://yahboomcar_description/meshes/A1Ackermann/base_link.STL" />
    </geometry>
    <material name="">
      <color rgba="0.898039215686275 0.917647058823529 0.929411764705882 1" />
    </material>
  </visual>
  <collision>
    <origin xyz="0 0 0" rpy="0 0 0" />
    <geometry>
      <mesh filename="package://yahboomcar_description/meshes/A1Ackermann/base_link.STL" />
    </geometry>
  </collision>
</link>
```

##### 6.4.2.3 标签介绍

| 标签 | 说明 |
|------|------|
| `origin` | 位姿信息：`xyz` 描述坐标位置，`rpy` 描述自身姿态 |
| `mass` | link 的质量 |
| `inertia` | 惯性参考系，利用对称性只需 6 个上三角元素：`ixx, ixy, ixz, iyy, iyz, izz` |
| `geometry` | 形状描述；`mesh` 属性加载纹理文件，`filename` 指定纹理路径 |
| `material` | 材质描述；`name` 必填（可为空、可重复）；`color` 子标签的 `rgba` 描述红/绿/蓝/透明度，范围 [0, 1]，空格分隔 |

#### 6.4.3 joint 详解

##### 6.4.3.1 简介

描述两个关节之间的运动学/动力学关系，包括运动位置、速度限制。

关节类型：

| 类型 | 说明 |
|------|------|
| `fixed` | 固定关节，不允许运动，仅起连接作用 |
| `continuous` | 旋转关节，无角度限制，可连续旋转 |
| `revolute` | 旋转关节，有角度限制 |
| `prismatic` | 滑动关节，沿某一轴线移动，有位置限制 |
| `floating` | 悬浮关节，6 自由度（3T + 3R） |
| `planar` | 平面关节，允许在平面正交方向平移或旋转 |

##### 6.4.3.2 示例代码（yahboomcar_A1.urdf.xacro）

```xml
<joint name="front_right_joint" type="continuous">
    <origin xyz="0.08 -0.0845 -0.0389" rpy="-1.5703 0 3.14159"/>
    <parent link="base_link"/>
    <child link="front_right_wheel"/>
    <axis xyz="0 0 1" rpy="0 0 0"/>
    <limit effort="100" velocity="1"/>
</joint>
```

- `name`：必填，关节名称，必须唯一
- `type`：填写六大关节类型之一

##### 6.4.3.3 标签介绍

| 标签 | 说明 |
|------|------|
| `origin` | 子标签，旋转关节在 parent 坐标系中的相对位置 |
| `parent` / `child` | 两个要连接的 link；parent 是参照物，child 围绕 parent 旋转 |
| `axis` | child 围绕哪个轴（xyz）旋转及绕固定轴的旋转量 |
| `limit` | 限制 child 的运动范围：`lower`/`upper` 限制旋转弧度，`effort` 限制受力（N），`velocity` 限制转速（m/s） |
| `mimic` | 描述该关节与已有关节的关系 |
| `safety_controller` | 安全控制器参数，保护关节运动 |

---

## 参考链接

- [ROSMASTER A1 课程主页](https://www.yahboom.com/study/ROSMASTER-A1)
- [亚博智能官网](https://www.yahboom.com)

> [!warning] 注意
> 本笔记内容来源于亚博智能 ROSMASTER A1 官方教程，仅供学习参考。完整教程需购买产品后获取提取码访问。
