---
tags:
  - pioneer_mrs
  - 编队控制
  - 任务分配
  - 多机器人
date: 2026-05-27
---

# pioneer_mrs 与任务分配详解

> 多机器人分布式编队保持 + 多机任务分配算法对比基准。

---

## 一、pioneer_mrs

### 基本信息

| 项目 | 详情 |
|------|------|
| 仓库 | <https://github.com/hanzheteng/pioneer_mrs> |
| 星标 | ~55 |
| 语言 | C++ (pioneer_server, comm_state) + Python (algorithm, teleop) |
| 框架 | ROS Kinetic + Gazebo / MobileSim |
| 机器人 | Pioneer 3-AT (差速滑移转向) |
| 本地路径 | `D:\桌面\研0记录\pioneer_mrs\` |

### 编队控制算法：共识 + 梯度下降混合

```
对于每个机器人 j:
  // 第一项：共识吸引子——将所有机器人拉向偏移后的平均位置
  v_j = gain_q × Σ_i [ comm(i,j) × (p_i_offset - p_j_offset) ]

  // 第二项：梯度偏移——将机器人推到指定编队位置
  v_j = v_j - (p_j_offset - gradient_j)
```

- `gain_q = 0.2` 控制收敛速度
- `comm_state` 为 5×5 布尔矩阵，当前配置为全连通（除自环）
- 编队形状硬编码为菱形/十字排列（5 个偏移向量）
- 机器人数量**硬编码为 5**，改 N 需修改多个文件

### 通信架构

```
commander (teleop + comm_state_cmd)
    │  actionlib goal → /robot#/Formation
    │  发布 /robot#/comm_state (1 Hz, 完全连通图)
    ▼
每个机器人 (3 节点):
  pioneer_server (C++)  ←─ 位姿 (odom/vicon/gazebo)
    提供 /robot#/get_pose 服务
  algorithm_node (Python)
    通过 RPC 收集 5 个机器人的位姿
    运行共识+梯度算法 → 输出 cmd_vel
  RosAria (C++)  ←─ 硬件驱动 (仅在真实机器人时)
```

### 仿真支持

三种定位模式，通过参数切换：

| 模式 | 位姿来源 | 说明 |
|------|---------|------|
| `odom` | RosAria/pose | 真实机器人或 MobileSim |
| `gazebo` | gazebo/odom | Gazebo 仿真 |
| `vicon` | Vicon 动捕 | 室内精确定位 |

### 压路机适用度

| 维度 | 评分 | 说明 |
|------|:--:|------|
| 编队控制算法 | 可参考共识+梯度框架 |
| 直接使用 | 硬编码太多(5台/差速/菱形编队) |
| 运动学模型 | 差速→需改为铰接/Ackermann |
| 通信 | ROS 服务调用，简单但有阻塞风险 |

**结论**：编队控制算法思想（共识吸引 + 梯度偏移）可迁移，但代码硬编码太多，不具备直接复用价值。建议提取算法框架后重写。

---

## 二、Multi-UAV Task Assignment Benchmark

### 基本信息

| 项目 | 详情 |
|------|------|
| 仓库 | <https://github.com/robin-shaun/Multi-UAV-Task-Assignment-Benchmark> |
| 星标 | ~600 |
| 语言 | Python |
| 论文 | CAC 2022 / arXiv:2009.00363 |
| 本地路径 | `D:\桌面\研0记录\Multi-UAV-Task-Assignment-Benchmark\` |

### 问题建模

**扩展的团队定向运动问题 (Extended Team Orienteering Problem)**：

- 输入：车辆数量、各车辆速度、目标点（位置+收益+耗时）、时间限制
- 输出：每辆车的任务序列 [[28,19,11], [25,22,7,...], ...]
- 目标：总收益最大化

### 三种算法

| 算法 | 文件 | 特点 |
|------|------|------|
| **GA** (遗传算法) | `ga.py` | 用 numba 加速，种群 300，迭代 6000 |
| **ACO** (蚁群优化) | `aco.py` | 经典蚁群，信息素+启发式 |
| **PSO** (粒子群优化) | `pso.py` | 连续优化转离散任务分配 |

多进程并行运行（`multiprocessing.Pool`），每种算法独占一个 CPU 核。

### 增强版（dietmarwo fork）

社区增强版增加了：
- **BiteOpt**：连续优化算法，大规模问题性能最优
- **fcmaes-MODE**：多目标优化（收益+时间+能耗）
- 参数重新调优，GA 速度大幅提升

### 压路机场景映射

| UAV 概念 | 压路机概念 |
|----------|-----------|
| 目标点 (target) | 碾压子段 |
| 收益 (reward) | 碾压优先级/面积 |
| 耗时 (time consumption) | 碾压耗时 |
| 车辆速度 | 压路机作业速度 |
| 时间限制 | 总工期约束 |
| 任务序列 | 各压路机的碾压段序列 |

### 压路机适用度

| 维度 | 评分 | 说明 |
|------|:--:|------|
| 问题建模框架 | 可直接映射 |
| GA/PSO/ACO 实现 | 可直接参考 |
| Python 实现 | 适合原型验证 |
| 实时性 | 不适合在线调度(Python) |

**结论**：任务分配的问题建模和算法实现可直接参考。路段划分→目标点，碾压时间→耗时，工期→时间限制，收益→面积/优先级。用于离线规划阶段，不适合实时重调度。

---

## 三、总结

| 项目 | 核心价值 | 复用方式 |
|------|---------|---------|
| **pioneer_mrs** | 共识+梯度编队框架 | 提取算法思想，C++ 重写 |
| **MU-TA-Benchmark** | GA/PSO/ACO 任务分配 | 直接参考问题建模+算法 |

两者都是**算法参考**而非可部署的库。pioneer_mrs 硬编码太多不适配，MU-TAB 的 Python 实现适合算法原型验证阶段。
