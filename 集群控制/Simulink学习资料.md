---
tags:
  - Simulink
  - MATLAB
  - CarSim
  - MBD
  - 学习资料
created: 2026-05-21
---

# Simulink/MATLAB 学习资料

## 学习路线

```
Simulink基础模块 → Stateflow状态机 → MBD工作流 → CarSim联仿 → 控制算法实战
```

## MATLAB 官方免费 Onramp（按顺序学）

| 课程                                  | 时长   | 内容            |
| ----------------------------------- | ---- | ------------- |
| MATLAB Onramp                       | 2h   | 基础语法          |
| Simulink Onramp                     | 2-3h | 模块库/信号线/求解器   |
| Stateflow Onramp                    | 2-3h | 状态机建模（决策逻辑必备） |
| Control Design Onramp with Simulink | —    | 控制器设计（横纵向控制）  |
| Simscape Onramp                     | —    | 物理建模（液压/机械）   |
| Multibody Simulation Onramp         | —    | 车辆多体动力学       |
| Reinforcement Learning Onramp       | —    | 强化学习控制        |

全部免费，入口：matlabacademy.mathworks.com

## B站教程

| 教程 | UP主/系列 | 说明 |
|------|----------|------|
| 基于 CarSim+Simulink 的智能驾驶系列 (56课+) | [BV1jsYvzfEaw](https://www.bilibili.com/video/BV1jsYvzfEaw/) | 零基础，CarSim建模+AEB/ACC/LCA算法+联仿 |
| MATLAB Simulink 模块介绍 | 未来电控学苑 [BV1JHHyzYEZe](https://www.bilibili.com/video/BV1JHHyzYEZe/) | 基础模块、MBD流程、代码生成、AUTOSAR |
| 车辆动力学与控制视频教程 (2026.3新开) | — | 工程实战，首期《车辆横向动力学建模与控制》 |

## 推荐书籍

| 书名                                 | 出版社     | 年份   | 特点                            |
| ---------------------------------- | ------- | ---- | ----------------------------- |
| 《智能车辆仿真与测试技术》                      | 清华大学出版社 | 2025 | CarSim、PreScan、CARLA、SUMO联合仿真 |
| 《智能车辆系统动力学建模与仿真》                   | 清华大学出版社 | 2022 | 10个实战案例：ACC/AEB/车道保持/路径跟踪     |
| 《智能网联汽车自动驾驶仿真技术》                   | 化学工业出版社 | 2020 | MPC、卡尔曼滤波、坐标系转换，附源码           |
| 《MATLAB/Simulink 机电动态系统仿真及工程应用》第2版 | 北航出版社   | —    | 含液压控制建模章节（压路机相关）              |

## 压路机/工程机械相关

- 知网关键词："振动压路机 Simulink 动力学分析"
- CSDN：《基于 MATLAB/Simulink 的工程机械液压系统控制设计与仿真》
- 北航出版《机电动态系统仿真及工程应用》——含液压控制建模

## MBD（基于模型的设计）核心流程

```
需求分析 → 系统建模(Simulink) → 仿真验证 → 自动代码生成 → 硬件在环(HIL)测试
```

这是汽车/工程机械行业的标准开发流程，Simulink 全程覆盖。
