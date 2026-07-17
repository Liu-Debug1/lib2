---
title: ROSMASTER A1 三天学习记录
---
## 一、小车使用

### 基本信息

ip地址：
```
192.168.2.35
```
账号：
```
jetson
```
密码：
```
yahboom
```

主板：Jetson Orin Nano
深度相机：Nuwa-HP60C
激光雷达：T-MINI PLUS 	//使用的时候需要把HUB板上的电源开关打开，进行供电


### 远程控制
对于CLI命令可直接通过`PuTTY`进行操作：![[Pasted image 20260717121653.png]]

如果需要图形化操作，则需要VNC连接主板Ubuntu操作：![[Pasted image 20260717121748.png]]

### 核心程序

**核心工作空间下的含有的功能包**：
![[图片/Pasted image 20260717132847.png]]

| 功能包                                | 类型与主要作用                           | 包内可执行节点/入口                                                                                                                                                                                                                                    |
| ---------------------------------- | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `auto_drive`                       | 摄像头自动驾驶、车道中线标定、YOLO 检测、录像         | `auto_drive`、`cali_midline`、`yolo_detect`、`record_video`、`pub_video`                                                                                                                                                                          |
| `auto_interfaces`                  | 自动驾驶和大模型使用的自定义接口包                 | 无节点；提供 `Rot.action`、`DetectionObject.msg`、`RoadRoute.msg`、`LlmRequest.msg`、`LlmAutoDrive.msg`、`WebSaveMap.srv`                                                                                                                                |
| `interfaces`                       | 语音、大模型、视觉服务接口                     | 无节点；提供 `Audio.srv`、`Audio2.srv`、`Vision.srv`、`LargeScaleModel.srv`、`Qwen25.srv`、`Rot.action`                                                                                                                                                  |
| `largemodel`                       | 语音识别、大模型服务、动作指令执行                 | `asr`、`model_service`、`action_service_usb`、`action_service_nuwa`                                                                                                                                                                              |
| `laserscan_to_point_publisher`     | 将 `/scan` 的激光极坐标数据转换并发布为空间点       | `laserscan_to_point_publish`                                                                                                                                                                                                                  |
| `multi_brains`                     | 多模态大模型智能体，负责模型推理和动作编排             | `model_service`、`action_service_usb`、`action_service_nuwa`、`follow_line`、`kcf_track`                                                                                                                                                          |
| `robot_pose_publisher_ros2`        | 从 TF/定位信息中提取并发布机器人位姿              | `robot_pose_publisher`（C++）                                                                                                                                                                                                                   |
| `text_chat`                        | 文本输入的大模型聊天节点                      | `text_chat`                                                                                                                                                                                                                                   |
| `yahboom_yolov8`                   | YOLOv8 目标检测与目标跟踪                  | `yolov8_detect`、`yolov8_track`                                                                                                                                                                                                                |
| `yahboomcar_app_save_map`          | 为 App/网页提供地图保存服务                  | `server`、`client`                                                                                                                                                                                                                             |
| `yahboomcar_astra`                 | Astra 相机视觉识别、目标跟踪和跟随              | `colorTracker`、`qrTracker`、`monoTracker`、`faceTracker`、`apriltagTracker`、`gestureTracker`、`poseTracker`、`colorFollow`、`faceFollow`、`qrFollow`、`monoFollow`、`gestureFollow`、`poseFollow`、`apriltagFollow`、`follow_line`、`HandCtrl`、`qrCtrl`    |
| `yahboomcar_base_node`             | 底盘核心驱动，处理串口、`cmd_vel`、编码器、里程计和 TF | `base_node_A1`、`base_node_R2`（C++）                                                                                                                                                                                                            |
| `yahboomcar_bringup`               | 底盘启动、运动学转换、里程计标定和巡航测试             | `Ackman_driver_A1`、`A1_descri_Ackman_driver`、`calibrate_linear_A1`、`calibrate_angular_A1`、`patrol_A1`                                                                                                                                         |
| `yahboomcar_ctrl`                  | 人工遥控                              | `yahboom_keyboard`、`yahboom_joy_A1`                                                                                                                                                                                                           |
| `yahboomcar_depth`                 | RGB-D 深度视觉、测距、体积估计及深度辅助跟随         | `depth_to_color`、`get_center_dis`、`calculate_volume`、`depth_colorTracker`、`depth_faceFollow`、`depth_qrFollow`、`depth_apriltagFollow`、`KCF_Tracker`、`depth_gestureFollow`、`depth_poseFollow`、`depth_follow_line`、`camera_app`、`Edge_Detection` |
| `yahboomcar_description`           | URDF、模型、RViz 配置和多机器人模型显示          | 无自有运行节点；launch 启动 `robot_state_publisher`、RViz 等外部节点                                                                                                                                                                                          |
| `yahboomcar_laser`                 | 激光雷达避障、目标跟随和区域警告                  | `laser_Avoidance_A1`、`laser_Tracker_A1`、`laser_Warning_a1_X3`                                                                                                                                                                                 |
| `yahboomcar_mediapipe`             | MediaPipe 教学与手势/人体感知              | `01_HandDetector`、`02_PoseDetector`、`03_Holistic`、`04_FaceMesh`、`05_FaceDetection`、`06_FaceLandmarks`、`07_Objectron`、`08_VirtualPaint`、`09_FingerCtrl`、`10_GestureRecognition`、`11_FindHand`、`12_FingerTrajectory`                            |
| `yahboomcar_msgs`                  | 底盘和舵机使用的自定义消息                     | 无节点；提供 `ServoControl.msg`、`Position.msg`、`PointArray.msg`                                                                                                                                                                                     |
| `yahboomcar_multi`                 | 多机器人遥控、主从跟随和多机器人导航编排              | `yahboomcar_A1_ctrl`、`get_follower_point`、`pub_follower_goal`                                                                                                                                                                                 |
| `yahboomcar_nav`                   | SLAM、定位、Nav2 导航和地图保存的配置/启动集合      | 自有节点只有 `scan_filter`；其余 launch 编排 Cartographer、GMapping、SLAM Toolbox、RTAB-Map、Nav2 等外部节点                                                                                                                                                      |
| `yahboomcar_vision`                | 通用图像、二维码、姿态与目标检测、简单 AR            | `create_qrcode`、`parse_qrcode`、`detect_pose`、`detect_object`、`simple_ar`、`astra_rgb_image`、`astra_depth_image`、`pub_image`                                                                                                                    |
| `yahboomcar_voice_ctrl`            | 语音命令触发视觉识别、跟踪、跟随和巡线               | `colorTracker`、`qrTracker`、`monoTracker`、`faceTracker`、`apriltagTracker`、`gestureTracker`、`poseTracker`、`colorFollow`、`faceFollow`、`qrFollow`、`monoFollow`、`gestureFollow`、`poseFollow`、`apriltagFollow`、`follow_line`、`colorSelect`          |
| `yahboomcar_voice_ctrl_depth`      | 结合深度相机的语音控制和目标跟随                  | `voice_get_dist`、`colorSelect`、`voice_face_follow`、`voice_colorTracker`、`voice_apriltagFollow`、`voice_qrFollow`、`voice_follow_line`、`voice_gestureFollow`、`voice_poseFollow`、`voice_KCF_Tracker`                                              |
| `yahboomcar_web_savmap_interfaces` | 网页保存地图使用的服务接口                     | 无节点；提供 `WebSaveMap.srv`                                                                                                                                                                                                                       |





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



常用API：

| API                                                  | 作用                      |
| ---------------------------------------------------- | ----------------------- |
| `create_publisher<MsgType>(topic, qos)`              | 创建发布者                   |
| `create_subscription<MsgType>(topic, qos, callback)` | 创建订阅者                   |
| `create_service<SrvType>(service, callback)`         | 创建服务端                   |
| `create_client<SrvType>(service)`                    | 创建客户端                   |
| `create_wall_timer(period, callback)`                | 创建定时器                   |
| `get_logger()`                                       | 获取日志对象，用于 `RCLCPP_INFO` |

## 二、底盘控制


### 1 ROS控制

#### 1.1**启动底盘数据**：
```
ros2 run yahboomcar_bringup Ackman_driver_A1
```

![[Pasted image 20260717120238.png]]

#### **1.2查看当前节点名称**：
```shell
ros2 node list

#终端回复：
jetson@yahboom:~$ ros2 node list
/driver_node
```


#### **1.3查看话题、话题消息数据类型**

```shell
ros2 topic list            #查看话题
ros2 node info 节点名       #查看节点
ros2 topic info 话题名      #查看话题
ros2 topic type 话题名      #查看消息类型
ros2 interface show 类型名  #查看消息结构
```

| 话题名字            | 话题内容      |
| --------------- | --------- |
| `/Buzzer`       | 蜂鸣器       |
| `/Servo`        | 舵机 s1、s2  |
| `/cmd_vel`      | 速度控制      |
| `/edition`      | 版本信息      |
| `/imu/data_raw` | IMU 传感器数据 |
| `/imu/mag`      | IMU 磁力计数据 |
| `/vel_raw`      | 小车速度信息    |
| `/voltage`      | 电池电压信息    |

查看 `driver_node`节点的话题信息：
![[Pasted image 20260717120820.png]]

#### 1.4手动发布话题信息

通过发布  `/cmd_vel`  控制小车的运动
```shell
ros2 topic pub /cmd_vel geometry_msgs/msg/Twist "{linear: {x: 0.0, y: 0.0, z: 0.0}, angular: {x: 0.0, y: 0.0, z: 0.0}}" --once
```
解析:
```shell
ros2 topic pub             #手动发布ROS2话题命令
/cmd_vel                   #话题名称
geometry_msgs/msg/Twist    #发布的消息类型（可通过 ros2 topic info /cmd_vel查看）
"{linear: {x: 0.0, y: 0.0, z: 0.0}, angular: {x: 0.0, y: 0.0, z: 0.0}}" #具体消息数据
--once                     #毕设 只发布一次，然后退出命令
--------------------------------------------------------------------------------------------
> geometry_msgs    消息所在的功能包
> msg              接口类别，表示消息
> Twist            消息类型名称
```
![[图片/Pasted image 20260717183148.png]]


****
### 2手柄控制


#### **1.启动手柄控制**
```
 ros2 launch yahboomcar_ctrl yahboomcar_joy_launch.py
```
![[Pasted image 20260717122146.png|906]]

#### 2.节点通讯图

```
ros2 run rqt_graph rqt_graph
```

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

#### 3./joy_Ctrl 节点下的数据处理


**程序源码**：[[yahboom_joy_A1.py]]+

```shell
手柄驱动
   ↓ 发布 /joy
JoyTeleop.buttonCallback()
   ↓
按键功能 + 摇杆数值转换
   ↓
/cmd_vel、/Servo、/Buzzer、/RGBLight
```


**解读：**
> `joy_node` 负责读取手柄硬件，并将按键和摇杆状态发布到 `/joy` 话题；`joy_ctrl` 订阅 `/joy`，根据 值解析用户操作，并发布 `/cmd_vel`、`/Servo`、`/Buzzer` 三类控制话题；`driver_node` 订阅这些控制话题后，调用底层驱动控制电机、舵机和蜂鸣器执行相应动作。

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

****
### 3 键盘控制


通过在终端启动键盘控制程序：：
```
ros2 run yahboomcar_ctrl yahboom_keyboard
```

![[Pasted image 20260717115639.png]]

#### 1.节点关系图

```Linux
ros2 run rqt_graph rqt_graph
```

![[Pasted image 20260708223947.png]]
解读：
> `keyboard_ctrl` 节点直接从终端读取键盘按键，通过 `moveBindings` 和 `speedBindings` 将按键映射为线速度和角速度，并封装成 `geometry_msgs/msg/Twist` 消息发布到 `/cmd_vel`；`driver_node` 订阅 `/cmd_vel` 后调用底层驱动控制小车运动。

#### 2. keyboard_ctrl节点下的数据处理

> **程序源码**：[[嵌入式/ROS系统/Rosmaster源码/yahboomcar_ws/src/yahboomcar_ctrl/yahboomcar_ctrl/yahboom_keyboard.py|yahboom_keyboard]]

![[图片/Pasted image 20260717130206.png]]![[图片/Pasted image 20260717130231.png|250]]

字典负责保存“按键 → 运动参数”的映射关系，控制程序读取按键后，只需查询字典并执行对应动作。

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

****

### 4线速度标定

#### 1.启动程序

需要运行的节点：
```
ros2 launch yahboomcar_bringup yahboomcar_bringup_A1_launch.py
ros2 run yahboomcar_bringup calibrate_linear_A1
```
RQT界面动态调节参数：
```
ros2 run rqt_reconfigure rqt_reconfigure
```

![[图片/Pasted image 20260717132352.png]]
> 如果没有`Linear`节点，点击`Refresh`刷新

RQT界面的参数说明：
```
test_distance：标定测试的距离，这里测试往前走1米；
speed：线速度大小；
tolerance：误差允许的容忍度；
odom_linear_scale_correction：线速度比例系数，如果测试的结果不理想，就是修改这个数值；
start_test：测试开关；
direction：可以忽略，该值是给麦轮结构小车使用的，修改后可以标定左右移动的线速度；
base_frame：基坐标系的名称；
odom_frame：里程计坐标系的名称
```


#### 2. 标定过程

通过**编码器**里程计报告的距离和**小车实际行驶距离**是否一致，进行修正

将Rqt中的`test_distance`更改为实际测试距离
```text
点击start_test,开始标定，同时小车监听 TF
    ↓
发布固定线速度
    ↓
读取 odom → base_footprint 的位置变化，计算里程计距离
    ↓
乘以修正系数，获取当前小车的的距离
    ↓
达到 test_distance 后停车（此时小车会在当前的修正系数下，停在自以为的test_distance距离下面）
    ↓
再用比对小车的实际行驶距离和实际测试距离之间的误差，继续调参odom_linear_scale_correction，直至正确
    ↓
最后再将odom_linear_scale_correction的参数值，修改至launch文件的linear_scale_x文件中，永久生效
```
![[图片/Pasted image 20260717143301.png]]
#### 3.节点关系图
![[图片/Pasted image 20260717135512.png]]

#### 4.程序源码理解

位置：`嵌入式/ROS系统/Rosmaster源码/yahboomcar_ws/install/yahboomcar_bringup/lib/yahboomcar_bringup/calibrate_linear_A1`
监听tf坐标变换的实现为`CalibrateLinear`类中的`get_position`方法：
	位于`calibrate_linear_A1（Line144）`
```python
def get_position(self):
    try:
        query_time = rclpy.time.Time()  # 查询 TF 缓冲区中最新可用的变换

        transform = self.tf_buffer.lookup_transform(
            self.odom_frame,            # 目标坐标系：里程计坐标系
            self.base_frame,            # 源坐标系：小车底盘坐标系
            query_time,                 # 查询时间：最新时刻
            timeout=rclpy.duration.Duration(seconds=1.0)  # 最多等待 1 秒
        )
        return transform                # 返回平移与旋转信息
    except (
        LookupException,                # TF 坐标系不存在
        ConnectivityException,          # 两个坐标系之间不连通
        ExtrapolationException           # 查询时间超出 TF 缓冲范围
    ) as error:
        self.get_logger().info(f'transform not ready: {error}')  # 输出异常原因
        raise                           # 将异常继续交给调用者处理
```

在运行过程中，小车判断对自己位置和控制底盘运动的方法：
	位于源码`calibrate_linear_A1（Line63~132）`
```
定时器触发 'on_timer()'
   ↓
start_test 是否为 True？
   ├─ False：更新起点 → 发布零速度
   └─ True：获取当前位置
               ↓
           计算行驶距离
               ↓
           乘以标定系数
               ↓
       error = 当前距离 - 目标距离
               ↓
       ┌───────┴────────┐
误差小于容差         未达到容差
关闭测试并停车       根据误差方向运动
                       ↓
                  发布 /cmd_vel， 继续控制底盘
```

****

### 5角速度标定
#### 1.启动程序

需要运行的节点：
```
ros2 launch yahboomcar_bringup yahboomcar_bringup_A1_launch.py
ros2 run yahboomcar_bringup calibrate_angular_A1
```
RQT界面动态调节参数：
```
ros2 run rqt_reconfigure rqt_reconfigure
```
RQT界面的参数说明：
```
test_angle：标定测试的角度，这里测试旋转360度；
speed：角速度大小；
tolerance：误差允许的容忍度；
odom_angular_scale_correction：线速度比例系数，如果测试的结果不理想，就是修改这个数值；
start_test：测试开关；
base_frame：基坐标系的名称；
odom_frame：里程计坐标系的名称。
```


#### 2. 标定过程

通过**编码器**里程计报告的距离和**小车实际行驶距离**是否一致，进行修正
将Rqt中的`test_distance`更改为实际测试距离
```text
设置 test_angle（例如 360°），点击 start_test，记录初始航向角
        ↓
发布固定角速度，使小车转向
        ↓
从 odom → base_footprint 的 TF 中读取四元数，将四元数转换为 yaw 角
        ↓
计算相邻两次 yaw 的角度增量，增量乘以角度修正系数并累加
        ↓
累计角度达到 test_angle 后停车
        ↓
再用比对小车实际转角和实际测试转角之间的误差，继续调参odom_angular_scale_correction，直至正确
```

#### 3.节点关系图
![[图片/Pasted image 20260717143440.png]]

#### 4.程序源码理解

位置：
```
嵌入式\ROS系统\Rosmaster源码\yahboomcar_ws\src\yahboomcar_bringup\yahboomcar_bringup\calibrate_angular_A1.py
```

监听tf坐标变换的实现为`Calibrateangular`类中的`get_odom_angle`方法：
	位于`calibrate_angular_A1（Line1117~134）`
```python
def get_odom_angle(self):
    """
    读取小车在 odom 坐标系中的航向角 yaw。
    返回值：
        float：绕 z 轴旋转的 yaw 角，单位为 rad。
        None：TF 暂未建立或查询失败。
    """
    try:
        now = rclpy.time.Time()  # 使用最新可用的 TF 变换
   
        rot = self.tf_buffer.lookup_transform(    # 查询 base_footprint 在 odom 坐标系中的位姿
            self.odom_frame,                      # lookup_transform(目标坐标系, 源坐标系, 查询时间
            self.base_frame,
            now
        )
        cacl_rot = PyKDL.Rotation.Quaternion(      # 将 TF 消息中的四元数转换为 PyKDL 旋转对象
            rot.transform.rotation.x,
            rot.transform.rotation.y,
            rot.transform.rotation.z,
            rot.transform.rotation.w
        )
        angle_rot = cacl_rot.GetRPY()[2]# 将四元数转换为 roll、pitch、yaw（GetRPY()[2]）
			
    except (
        LookupException,
        ConnectivityException,
        ExtrapolationException
    ):
        self.get_logger().info("transform not ready") 
        return None  # TF 不存在、坐标树未连通或时间不同步时返回 None
    return angle_rot
```

在运行过程中，小车判断对自己位置和控制底盘运动的方法：
	位于源码`calibrate_angular_A1（Line63~132）`
```
定时器触发 on_timer()
        ↓
读取 start_test、目标角度、角速度、修正系数
        ↓
目标角度从度转换为弧度
        ↓
根据 reverse 决定本次左转还是右转
        ↓
计算误差 error = 已转角度 - 目标角度
        ↓
start_test 是否为 True？
   ├─ 否：发布零速度，清空累计角度
   └─ 是：继续判断误差
              ↓
       |error| 是否大于 tolerance？
          ├─ 是：发布角速度，读取 TF 中的当前 yaw，计算相邻两次 yaw 的增量，乘以角度修正系数，累加到 turn_angle
          └─ 否：标定完成，清空累计角度，start_test 设为 False， reverse 取反
```

****

### 6URDF模型

> URDF 使用 **XML** 描述机器人的**刚体、关节、坐标系、外观、碰撞和惯性参数**。机器人模型本质上是一棵由 `link` 和 `joint` 组成的树；URDF 被加载到 `robot_description` 后，`robot_state_publisher` 根据模型与 `/joint_states` 发布 TF，RViz 再依据 TF 和网格文件显示机器人。

#### 1.**启动模型并查看 TF 树**
```bash
ros2 launch yahboomcar_description display_A1.launch.py
ros2 run rqt_tf_tree rqt_tf_tree
```
![[图片/Pasted image 20260717145427.png]]
![[图片/Pasted image 20260717145436.png]]
#### 2.**流程**
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

#### 3.组成部分：**`link` 与 `joint`**

| 组件                          | 作用                 |
| --------------------------- | ------------------ |
| URDF                        | 描述机器人结构和物理属性       |
| `robot_description`         | 保存展开后的完整机器人 XML    |
| `joint_state_publisher_gui` | 通过滑块生成可动关节状态       |
| `/joint_states`             | 发布关节名称、位置、速度和力矩    |
| `robot_state_publisher`     | 根据关节状态和 URDF 计算 TF |
| RViz                        | 根据模型资源和 TF 显示机器人   |
```text
parent link
    │
    │ joint：规定安装位姿、运动类型、运动轴和限制
    ▼
child link
```

##### **3.1 Link：*

> 在URDF描述性语言中，`link`是用来描述物理特性
   Links还可以描述连杆尺寸(`size`)\颜色(`color`)\形状(`shape`)\惯性矩阵(inertial matrix)\碰撞参数(`collision properties`)等
> 每个`Link`会成为一个坐标系

```xml
描述视觉显示：<visual> 标签
描述碰撞属性：<collision> 标签
描述物理惯性：<inertial> 标签
```

**标签说明：**
```
origin ->描述的是位姿信息； xyz 属性描述的是在大环境中的坐标位置， rpy 属性描述的是自身的姿态。
mess   ->描述的是link的质量。
inertia->惯性参考系，由于转动惯性矩阵的对称性，只需要6个上三角元素 ixx, ixy, ixz, iyy, iyz, izz作为属性。
geometry->标签描述的是形状； mesh 属性主要的功能是去加载纹理文件的， filename 属性纹理路径的文件地址。
material->标签描述的是材质； name 属性为必填项，可以为空，可以重复 。通过【color】标签中的 rgba 属性来描述红、绿、蓝、透明度，中间用空格分隔。颜色的范围为[0-1]。
```


##### 3.2Joint

> 描述两个 link 之间的连接关系、相对安装位姿、运动方式与限制。

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
****
### 7TF坐标变换
#### 1.TF介绍

**TF树是ROS中描述多个坐标系之间空间关系的数据结构**：
>某个坐标系相对于另一个坐标系在哪里、朝向如何？

- 存在一个根坐标系
- 父子坐标系关系是一对多
- 任意两个坐标系应只存在唯一的变换路径
- 不能形成闭环


可以通过以下命令，查看TF树
```
ros2 run rqt_tf_tree rqt_tf_tree
```
#### 2.TF中的变换

> 每一对直接相连的父子**坐标系**之间，都由一条 TF 变换描述其相对位姿；该变换由**平移和旋转**组成。

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

关于四元数的定义和旋转变换计算，跳转笔记连接：[[四元数]]  


#### 3.TF话题与TF树 

```text
多个节点
    │ 发布 TransformStamped
    ▼
/tf 与 /tf_static
    │ 由 TF2 Buffer 接收、缓存、按 frame_id 连接
    ▼
TF 树
    │ 沿路径组合平移和旋转
    ▼
任意两个连通坐标系之间的变换
```

各节点发布的变换被 TF2 监听器接收并存进自己的 `tf2_ros::Buffer`。`Buffer` 按坐标系名称连接这些边，于是形成 TF 树：

![[Pasted image 20260715193008.png]]

> 每一条直接父子坐标系关系，都需要有一条 `TransformStamped` 变换数据来描述。

完整的`TransforStamped`结构：
```text
header.stamp          = 时间戳
header.frame_id       = 父坐标系
child_frame_id        = 子坐标系
transform.translation = 子坐标系相对父坐标系的平移
transform.rotation    = 子坐标系相对父坐标系的旋转四元数
```

## 深度相机




## 激光雷达


### 1 雷达基本使用

程序源码位置：
```shell
#Timiniplus雷达
~/yahboomcar_ros2_ws/software/library_ws/src/ydlidar_ros2_driver-humble/launch/ydlidar_launch.py
#Timiniplus雷达可视化
~/yahboomcar_ros2_ws/software/library_ws/src/ydlidar_ros2_driver-humble/launch/ydlidar_launch_view.py
```

启动程序
```shell
#启动Tminiplus雷达
ros2 launch ydlidar_ros2_driver ydlidar_launch.py
#启动Tminiplus雷达+rviz可视化数据
ros2 launch ydlidar_ros2_driver ydlidar_launch_view.p
```

![[图片/Pasted image 20260717174952.png]]


雷达上扫描的话题数据类型
```
ros2 topic echo /scan
```

| 字段                            | 含义                |
| ----------------------------- | ----------------- |
| `stamp`                       | 本帧扫描的时间戳          |
| `frame_id: laser`             | 数据在 `laser` 坐标系表达 |
| `angle_min: -π`               | 第一个测距点的方向         |
| `angle_max: π`                | 最后一个测距点的方向        |
| `angle_increment: 0.01559`    | 相邻测距束相差约          |
| `time_increment: 0.0002557 s` | 相邻两束的采样间隔         |
| `scan_time: 0.101 s`          | 整帧扫描用时约 0.1 s     |
| `range_min: 0.03 m`           | 小于 3 cm 的读数不可信    |
| `range_max: 12.0 m`           | 大于 12 m 的读数不可信    |
| `ranges`                      | 每一束激光测得的距离，单位 m   |

**雷达激光数据分析:**
>   假设雷达一周360°，划分为720个数据点（即为`ranges[i]`数组的大小），每个数据点间隔 0.5°（即为`angle_increment`的含义）
> 对于雷达而言第一个测距点和最后一个测距点实际上是一个点`angle_min`和`angle_max` 指向的是同一个方位
> 再把雷达扫描的圆张开成一把**角度尺**，每个数组下标内会存下对应雷达点的激光测距，对应的角度可以表示为 `angle  =  i * angle_increment  + angle_min`
```
数组下标：    0       1       2       3       ...      400
角度：      -180°  -179.5°  -179°  -178.5°   ...       20°
         angle_min    ← 每格增加 0.5° →
```

****

### 2 雷达避障

#### 2.1 运行节点程序

```
#启动小车底盘
ros2 run yahboomcar_bringup Ackman_driver_A1
#timni雷达
ros2 launch ydlidar_ros2_driver ydlidar_launch.py
#启动雷达避障程序
ros2 run yahboomcar_laser laser_Avoidance_A1
```

通过rtq调整避障参数：
```
ros2 run rqt_reconfigure rqt_reconfigure
```
![[图片/Pasted image 20260717212013.png]]
```
【linear】：避障过程中小车运动的线速度
【angular】：避障过程中小车运动的角速度
【LaserAngle】：雷达检测角度
【ResponseDist】：障碍物检测距离
【Switch】：玩法开关，可以通过这个案件开启和停止避障
```




注意：程序退出时销毁节点，但是不会执行停止命令，需要手动发布  `/cmd_val` 话题消息
```shell
ros2 topic pub /cmd_vel geometry_msgs/msg/Twist "{linear: {x: 0.0, y: 0.0, z: 0.0}, angular: {x: 0.0, y: 0.0, z: 0.0}}" --once	
```

####  2. 2 避障源码分析

雷达避障程序位置：
```
\嵌入式\ROS系统\Rosmaster源码\yahboomcar_ws\src\yahboomcar_laser\yahboomcar_laser\laser_Avoidance_A1.py
```

执行流程：
```
订阅 /scan，获取激光雷达发布的数据内容
→ 将雷达点按角度划分为左/前/右区域
→ 统计危险点数量
→ 判断障碍状态
→ 生成运动数据
→ 发布 /cmd_vel 话题，底盘接收执行
```

##### 2.2.1 雷达如何分区域？

```python
if 160 > angle > 180 - self.LaserAngle: # 右侧区域    150° < angle < 160°
if -160 < angle < self.LaserAngle - 180: # 左侧区域   -160° < angle < -150°
if abs(angle) > 160: # 正前方区域   160°～180°和-180°～-160°
self.LaserAngle = 30.0
```
直观理解
```
			↑ 正前方±180°
-170°   ↖   │    ↗   +170°
			│
	  ┌──────────┐
	  │    小车   │
	  └──────────┘
			↓  0°
```

##### 2.2.2 雷达危险点与统计 
对于每一帧数据包，先清零上一帧的危险点数，
```python
    self.Right_warning = 0  # 当前帧右侧危险点数
    self.Left_warning = 0   # 当前帧左侧危险点数
    self.front_warning = 0  # 当前帧前方危险点数
```
对每一个区域方位内的雷达点进行判断 
```python
        if 160 > angle > 180 - self.LaserAngle:  # 右侧角度区域
            if ranges[i] < self.ResponseDist * 1.5:  # 距离小于危险阈值
                self.Right_warning += 1

        if -160 < angle < self.LaserAngle - 180:  # 左侧角度区域
            if ranges[i] < self.ResponseDist * 1.5:  # 距离小于危险阈值
                self.Left_warning += 1

        if abs(angle) > 160:  # 正前方跨越 ±180° 的区域
            if ranges[i] <= self.ResponseDist * 1.5:  # 距离小于危险阈值
                self.front_warning += 1
```
如果这一帧某一区域的危险点数量超过阈值（10），就认为前方有障碍物
```python
if self.front_warning > 10:
```

##### 2.2.3 小车控制 决策
通过障碍物判断，调整小车避障的状态机，明确
```
前方是否有障碍
左侧是否有障碍
右侧是否有障碍
```

再由上面三个状态的对应的组合，发布 `/cmd_vel` 话题数据，控制底盘运动速度与转向

| 字段          | 含义                 |
| ----------- | ------------------ |
| `linear.x`  | 前后运动速度，正数表示前进      |
| `angular.z` | 绕竖直轴旋转的速度，正负决定左右转向 |

****

### 3 雷达跟随

#### 3.1 运行程序

```shell
#启动小车底盘
ros2 run yahboomcar_bringup Ackman_driver_A1
#tmini雷达
ros2 launch ydlidar_ros2_driver ydlidar_launch.py
#启动雷达跟随程序
ros2 run yahboomcar_laser laser_Tracker_A1
```
![[图片/Pasted image 20260717213534.png|1060]]
通过rtq调整雷达跟随参数参数： 
```
ros2 run rqt_reconfigure rqt_reconfigure
```
![[图片/Pasted image 20260717213634.png]]
```
【priorityAngle】：雷达优先检测的角度
【LaserAngle】：雷达检测角度
【ResponseDist】：跟踪的距离
【Switch】：开关
```
> 注意：rqt插件修改的参数，只在当次启动时生效


#### 3.2 跟随源码分析

源码位置：
```
嵌入式\ROS系统\Rosmaster源码\yahboomcar_ws\src\yahboomcar_laser\yahboomcar_laser\laser_Tracker_A1.py
```
> 实现: 程序启动后，会寻找雷达扫描范围内最近的物体，并且与它保持设定的距离。缓慢移动被跟踪的物体，小车会跟踪物体移动。

距离误差 → 控制小车前进或后退
角度误差 → 控制小车向左或向右转

执行流程：
```
接收 /scan 话题数据包
   ↓
计算每个雷达点的角度和距离
   ↓
与雷达避障相同，前方区域分为前、左、右，并且寻找最近目标
   ↓
得到目标距离 minDist 和 目标角度 minDistID
   ↓
距离PID计算 linear.x + 角度PID计算 angular.z
   ↓
发布 /cmd_vel，底盘追随目标运动
```

```python
#数据预处理 
if not isinstance(scan_data, LaserScan): return
ranges = np.array(scan_data.ranges)  # 转换为数组
offset = 0.5  # 安全距离偏移量
frontDistList = []  # 优先区域距离列表 
frontDistIDList = []  # 优先区域角度列表 
minDistList = []  # 次要区域距离列表 
minDistIDList = []  # 次要区域角度列表 
```

##### 3.2.1 如何选择跟随目标？

优先在**正前方**寻找**雷达点距离小于阈值**（`self.ResponseDist + offset`）的最近的目标；如果正前方没有目标，再在**左右两侧**寻找最近目标，并同时记录目标的距离和角度，最后再选择候选点中最近的雷达点最作为跟随目标
```python
#优先跟随（前方区域） 
if abs(angle) > (180 - self.priorityAngle):
    if ranges[i] < (self.ResponseDist + offset) and ranges[i]!=0:
        frontDistList.append(ranges[i])
        frontDistIDList.append(angle)
#跟随决策逻辑
if len(frontDistIDList) != 0:
    minDist = min(frontDistList)  # 取最小距离 
    minDistID = frontDistIDList[frontDistList.index(minDist)]  # 对应角度
else: 
    minDist = min(minDistList)  # 取次要区域最小距离
    minDistID = minDistIDList[minDistList.index(minDist)]
```

> 注意 ——平行数组：多个列表通过相同下标描述同一个对象。
```python
下标                 0         1         2
frontDistList      [0.80,     0.55,     0.62]     # 优先区域角度列表 
                     ↕          ↕         ↕
frontDistIDList   [175.0,   -178.0,    165.0]     # 优先区域距离列表 
```

```
第一级：候选点筛选：哪些点可以参加 #优先跟随（前方区域） 
雷达全部点
  ├─ 正前方且距离小于1.05m → frontDistList
  ├─ 两侧候选区域           → minDistList
  └─ 其他区域               → 丢弃
第二级：最终点决选：参加的点中选哪一个 #跟随决策逻辑
  ├─ 正前方候选列表非空 → 选择正前方最近点
  └─ 正前方候选列表为空 → 选择两侧最近点
```


#### 3.2.2 如何实现跟随控制


```python
#数据预处理 #Data preprocessing
if not isinstance(scan_data, LaserScan): return
ranges = np.array(scan_data.ranges)  # 转换为数组 #Convert to array
offset = 0.5  # 安全距离偏移量 #Safe distance offset
frontDistList = []  # 优先区域距离列表 #Priority Area Distance List
frontDistIDList = []  # 优先区域角度列表 Priority Area Angle List
minDistList = []  # 次要区域距离列表 Secondary Area Distance List
minDistIDList = []  # 次要区域角度列表 List of secondary area angles
#优先跟随（前方区域） #Priority Follow (Forward Area)
if abs(angle) > (180 - self.priorityAngle):
    if ranges[i] < (self.ResponseDist + offset) and ranges[i]!=0:
        frontDistList.append(ranges[i])
        frontDistIDList.append(angle)
#跟随决策逻辑 #Follow decision logic
if len(frontDistIDList) != 0:
    minDist = min(frontDistList)  # 取最小距离 #Take the minimum distance
    minDistID = frontDistIDList[frontDistList.index(minDist)]  # 对应角度 #Corresponding angle
else: 
    minDist = min(minDistList)  # 取次要区域最小距离 #Take the minimum distance from the secondary area
    minDistID = minDistIDList[minDistList.index(minDist)]
    
# 距离微调（防抖动） #Distance adjustment (anti shake)
if abs(minDist - self.ResponseDist) < 0.1:
    minDist = self.ResponseDist
# 线速度PID控制器 #Linear velocity PID controller
velocity.linear.x = -self.lin_pid.pid_compute(self.ResponseDist, minDist)
# 角速度误差计算 #Calculation of angular velocity error
error = (180 - abs(minDistID)) / 72  # 角度归一化 #Angle normalization
ang_pid_compute = self.ang_pid.pid_compute(error, 0)  # 目标角度=0（正前方） Target angle=0 (straight ahead)
# 方向决策 #Direction decision
if minDistID > 0:  # 障碍物在右侧 #The obstacle is on the right side
    velocity.angular.z = -ang_pid_compute  # 左转 #Turn left
else: 
    velocity.angular.z = ang_pid_compute  # 右转 #Turn right
```




## 多车功能






















