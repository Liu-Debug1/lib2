---
tags:
  - C++
  - 学习路线
  - 压路机
  - 底盘控制
  - CAN
  - ROS
date: 2026-05-13
source: 师姐大纲
---

# 无人压路机 C++ 学习大纲

## 总览

| 阶段     | 内容                                | 优先级  | 毕设相关度 |
| :----- | :-------------------------------- | :--- | :---- |
| C++ 速成 | 变量/类型/运算符/if/for/while/函数/指针/数组/类 | 立即开始 | ★★★   |
| C++ 详解 | 5 阶段递进练习（基础→类→实战）                 | 重点   | ★★★   |
| 虚拟机    | 安装 + 扩容                           | 后续   | ★     |
| ROS    | 话题发布订阅 + 自定义消息                    | 后续   | ★★    |
| 压路机基础  | 硬件认识 + 软件架构                       | 了解   | ★★    |
| 实操     | 仿真 + 硬件调试                         | 后续   | ★★    |
| 代码规范   | 命名/结构/注释                          | 穿插   | ★★★   |

---

## 一、C++ 速成

**内容**：类、for、if、while、函数、指针、数组、变量、数据类型、运算符

**学习资料**：
- [黑马程序员 C++ 教程](https://www.bilibili.com/video/BV1UE411j7Ti)
- [C++ 深入教程](https://www.bilibili.com/video/BV1bU411U7Ri)

---

## 二、C++ 详解（5 阶段练习）

### 第一阶段：基础语法

#### (1) 变量、数据类型、运算符

> 写一个程序，输入轮子转速 RPM（整型），计算线速度（浮点型）：
> $$v = \frac{\pi \times D \times RPM}{60}$$
> - 使用 `int`、`double` 类型
> - 使用 `+ - * /` 运算符
> - 输出线速度

#### (2) if 判断

> 根据线速度判断压路机行驶状态：
>
> | 速度 | 状态 |
> |:-----|:-----|
> | > 3.0 m/s | 高速 |
> | 1.0 ~ 3.0 m/s | 中速 |
> | < 1.0 m/s | 低速 |

#### (3) for 循环

> 模拟速度曲线：`double speed[5] = {0.5, 1.2, 2.5, 3.5, 2.0};`
> 使用 for 循环依次打印速度与状态。

---

### 第二阶段：数组、函数、while、模块化

#### (1) 数组 + while 循环

> 给定压路机左右轮各 10 项速度数组，判断是否偏离直线：
> - 左轮 > 右轮 + 0.5 → 向右偏
> - 右轮 > 左轮 + 0.5 → 向左偏
> - 否则 → 正常
> - 用 `while` 逐秒判断

#### (2) 函数封装

```cpp
double calcLinearSpeed(double rpm, double wheel_diameter);
// 主函数调用该函数 5 次，输入不同转速并打印结果
```

#### (3) 模块化函数

```cpp
bool isOverspeed(double speed);
double calcSteering(double left_wheel, double right_wheel);
// 分别判断是否超速、根据左右轮差值计算转向角
```

---

### 第三阶段：指针、动态内存

#### (1) 指针操作数组

> `int sensor[5] = {10, 20, 30, 40, 50};`
> - 用指针遍历数组
> - 用指针修改第 3 个元素为 100

#### (2) 函数参数使用指针

```cpp
void normalizeSpeed(double* speed);
// 如果 speed > 3.0，则改为 3.0（用指针修改原值）
```

#### (3) 动态数组

> 用 `new` 创建动态数组，长度由用户输入：
> ```cpp
> double* lidar = new double[n];
> // 填入随机值，计算平均值
> delete[] lidar;
> ```

---

### 第四阶段：类的使用

#### (1) 基本类（传感器）

```cpp
class SpeedSensor {
private:
    double mSpeed;
public:
    void setSpeed(double s);
    double getSpeed();
};
```

#### (2) 加入构造函数

```cpp
SpeedSensor(double initial_speed);
// 创建两个对象：初始速度 0.5 和 3.0
```

#### (3) 多文件拆分

```
SpeedSensor.h      // 类声明
SpeedSensor.cpp    // 类实现
main.cpp           // 主函数只调用
```

---

### 第五阶段：实例应用（底盘控制核心）

#### (1) 遥控器开关代码

三段开关控制四轴转向模式：

| 开关值 | 模式 | 行为 |
|:------|:-----|:-----|
| 1 | 同步蟹行 | 左摇杆 → 四轴同步转向；右摇杆 → 不转 |
| 2 | 全轮独立 | 左摇杆→轴1、右摇杆→轴2、VRA→轴3、VRB→轴4 |
| 3 | 一键最小半径 | 左摇杆左转→轴1/2按比例左转、轴3/4按比例右转 |

涉及：`if-else` 嵌套、`switch` 枚举、`while`

#### (2) 遥控器手柄映射（数学映射函数）

**转向映射**：

| 摇杆值 | 范围 | CAN 目标 |
|:------|:-----|:---------|
| 左移 | 0x3E0 → 0x146（递减） | leftsteeringvalue: 0x00 → 0xFF |
| 右移 | 0x3E0 → 0x67B（递增） | rightsteeringvalue: 0x00 → 0xFF |

**油门映射**：

| 摇杆值 | 范围 | CAN 目标 |
|:------|:-----|:---------|
| 后退（下移） | 0x3E0 → 0x146 | throttlevalue: 0x00 → 0x2000 |
| 前进（上移） | 0x3E0 → 0x67B | throttlevalue: 0x00 → 0x2000 |

> 0x2000 对应最大扭矩 819.2 Nm

#### (3) 转向控制代码实现

- 四轴车有 4 个轴模块 → 4 个 `uint8_t ArrayData[8]`
- 左摇杆→轴1、VRA→轴2、VRB→轴3、右摇杆→轴4
- `ArrayData[1]` 的 0x00-0xFF 表示左转量
- `ArrayData[2]` 的 0x00-0xFF 表示右转量
- CAN 底层函数调用发送数组

#### (4) CAN 通讯

> 学习目标：
> - 看懂 CAN 通讯协议
> - 能用 CANTEST 读方向盘传感器数据并换算角度
> - 熟悉四轴车电机控制器 CAN 协议
> - 用 CANTEST 驱动轮毂电机

**学习资料**：
- [CAN 通信原理](https://www.bilibili.com/video/BV1Dq4y1J7WA)
- [CAN 协议详解](https://zhuanlan.zhihu.com/p/677658199)

#### (5) 类的使用（Box 类练习）

```cpp
class Box {
private:
    double m_a;  // 立方体边长
public:
    void SetA(double a);
    double GetVolume();    // a³
    double GetArea();      // 6a²
    void Display();
};
```

---

## 三、虚拟机使用

安装 VMWare 虚拟机。

**资料**：[VMWare 安装教程](https://www.bilibili.com/video/BV1du411d7ho)

---

## 四、虚拟机扩容

完成虚拟机扩容 100G。

**资料**：[虚拟机扩容教程](https://www.bilibili.com/video/BV1xt421n7Ej)

---

## 五、ROS（第 9 集 ~ 第 61 集）

**资料**：[ROS 教程](https://www.bilibili.com/video/BV1Ci4y1L7ZZ)

**作业**：

### 1. 创建工作空间并编译

### 2. 速度发布节点 `speed_pub.cpp`

- 消息类型：`std_msgs/Float64`
- 话题：`/test_speed`
- 发布频率：10Hz
- 内容：`speed = 0.1 * t`

### 3. 速度监听节点 `speed_sub.cpp`

- 订阅 `/test_speed`
- 回调打印：`[ROS INFO] speed = xxx`

### 4. 键盘控制

自定义消息 `KeyCmd.msg`：
```
float64 speed
float64 angle
uint8   auto_mode
uint8   park
```

按键映射：

| 按键 | 操作 |
|:-----|:-----|
| w | 速度 +0.1 |
| s | 速度 -0.1 |
| a | 左打角 -5° |
| d | 右打角 +5° |
| q | 自动模式切换 |
| p | 驻车切换 |

---

## 六、压路机基本知识

### 硬件

- 毫米波雷达（CAR28F AOK-5802-360）
- GNSS 接收机（M900 D）
- RTK 定位
- 网桥/路由器

**作业**：
1. 列出每个硬件作用
2. 毫米波雷达如何实现停障碍
3. RTK 接线方案
4. RTK 浮动解原因及改善方法
5. 网桥主从站配置
6. 网桥/路由器建立同一局域网

### 软件架构

**作业**：
1. 列出上层各系统作用
2. 智能压路机作业流程（每个硬件在流程中的作用）

---

## 七、实操

### 仿真

- 运行各模块
- 提交终端截图 + 一键启动脚本截图

### 硬件使用

1. ROS 中使用毫米波雷达反馈数据
2. 配置基站 RTK 使移动站获得固定解
3. 两台电脑通过网桥路由器建立连接
4. 上位机实现摊铺机/压路机程序互相收发

---

## 八、新版软件架构

写出各模块的：
- 输入是什么
- 输出是什么
- 工作流程

---

## 九、代码规范

### 1. 变量命名

> 规则：**作用域_模块_含义_类型**

```cpp
// ❌ 错误
double pos;
int speed;

// ✅ 正确
double gLC_VehPosF_db;   // 全局, 定位模块, 车辆位置(过滤后), double
uint16 lPLN_VehSpd_u16;  // 局部, 规划模块, 车辆速度, uint16
bool   gSYS_StartFlag_b; // 全局, 系统模块, 启动标志位, bool
```

### 2. 函数命名

> 规则：**两段式小驼峰：作用域_动词开头函数名()**

```cpp
// ❌ 错误
void CALC_PATH(){};
int GetData(){};

// ✅ 正确
/* 功能: 计算路径点    定义: 2025.01.01 */
void plnCalcPath(){};
/* 功能: 获取当前传感器数据 */
int sysGetData(){};
```

### 3. 类命名

> 类名：**大驼峰** | 实例：**类名_C** | 成员变量：**m + 含义 + 类型**

```cpp
// ✅ 正确
class RollerPlanner {
public:
    double mVehPos_db;     // 车辆位置
    double mTargetYaw_db;  // 目标航向角
    void initPlanner();
};
RollerPlanner_C RollerPlanner_C;
```

### 4. 宏定义与头文件

> 宏命名：**全大写 + 下划线**
> 公共 include 放在统一头文件 `common_config.h` 中

```cpp
#ifndef COMMON_CONFIG_H
#define COMMON_CONFIG_H
#include <stdio.h>
#include <math.h>
#define MAX_BUFFER_SIZE 100
#define PLT_VEHICLE   0
#define PLT_SIMULATION 1
#define PLT_MODE PLT_VEHICLE
#endif
```

### 5. 代码结构

> 主程序必须按顺序：**初始化 → 主循环 → 后处理**

```cpp
int main() {
    initSystem();
    while (1) {
        updateTime();    // #1.1 更新时间
        readSensors();   // #1.2 读取传感器
        plnCalcPath();   // #1.3 路径规划
        ctrlUpdate();    // #1.4 控制更新
        logRecord();     // #1.5 数据记录
    }
}
```

### 6. 注释规范

```cpp
/* 功能: 比例阀PID控制
   定义: 2025.01.01
   修改: 2025.02.03 (BUG-001 修复积分饱和) */
void ctrlCalcPid() {
    // #1.1 计算误差
    // #1.2 积分项
    // #1.3 限幅
}
```

---

## 速查：学习资源汇总

| 模块 | 链接 |
|:-----|:-----|
| C++ 基础 | [BV1UE411j7Ti](https://www.bilibili.com/video/BV1UE411j7Ti) |
| C++ 深入 | [BV1bU411U7Ri](https://www.bilibili.com/video/BV1bU411U7Ri) |
| 虚拟机安装 | [BV1du411d7ho](https://www.bilibili.com/video/BV1du411d7ho) |
| 虚拟机扩容 | [BV1xt421n7Ej](https://www.bilibili.com/video/BV1xt421n7Ej) |
| ROS 教程 | [BV1Ci4y1L7ZZ](https://www.bilibili.com/video/BV1Ci4y1L7ZZ) |
| CAN 通信 | [BV1Dq4y1J7WA](https://www.bilibili.com/video/BV1Dq4y1J7WA) |
| CAN 协议 | [知乎专栏](https://zhuanlan.zhihu.com/p/677658199) |
