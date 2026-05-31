---
tags:
  - 多机器人
  - 编队控制
  - 分布式优化
  - 协同操控
  - MATLAB
date: 2026-05-28
---

# star2dust/paper-simulation 详解

> 多机器人编队控制、分布式优化、协同操控领域的 11 篇经典论文仿真复现合集。423 star，MATLAB 实现。

---

## 一、基本信息

| 项目   | 详情 |
| ---- | --- |
| 仓库   | <https://github.com/star2dust/paper-simulation> |
| 星标   | ~423 |
| 语言   | MATLAB |
| 本地路径 | `D:\桌面\研0记录\star2dust-paper-simulation\` |
| 作者配套 | [CSDN博客](https://blog.csdn.net/u010038790) + [GitHub Pages](https://star2dust.github.io/) |

> 注意：仓库只含仿真代码，不含论文 PDF。论文需通过 README 中提供的 DOI 链接自行下载。

---

## 二、收录论文清单

| 编号 | 目录 | 论文 | 期刊 | 领域 |
|------|------|------|------|------|
| 1 | Alonso2017Multi | Multi-robot formation control and object transport in dynamic environments via constrained optimization | IJRR 2017 | 编队控制+协同搬运 |
| 2 | Farivarnejad2018Stability | Stability and Convergence Analysis of a Decentralized PI Control Strategy for Collective Transport | ACC 2018 | 协同搬运 |
| 3 | Zhao2018Affine | Affine Formation Maneuver Control of Multiagent Systems | IEEE TAC 2018 | 编队机动 |
| 4 | Ibuki2020Optimization | Optimization-based distributed flocking control for multiple rigid bodies | IEEE RA-L 2020 | 集群控制 |
| 5 | Kia2015Distributed | Distributed convex optimization via continuous-time coordination algorithms with discrete-time communication | Automatica 2015 | 分布式优化 |
| 6 | Sun2020Distributed | Distributed Continuous-Time Optimization with Time-Varying Objective Functions and Inequality Constraints | arXiv 2020 | 分布式优化 |
| 7 | Antonelli2013Decentralized | A decentralized controller-observer scheme for multi-agent weighted centroid tracking | IEEE TAC 2013 | 分布式估计+控制 |
| 8 | Shi2015Extra | EXTRA: An Exact First-Order Algorithm for Decentralized Consensus Optimization | SIAM 2015 | 优化算法 |
| 9 | Jakovetic2019unification | A Unification and Generalization of Exact Distributed First-Order Methods | IEEE TSIPN 2019 | 优化算法 |
| 10 | Qu2018Harnessing | Harnessing Smoothness to Accelerate Distributed Optimization | IEEE TCNS 2018 | 优化加速 |
| 11 | Zhang2021Convergence | Convergence Analysis of a Continuous-Time Distributed Gradient Descent Algorithm | IEEE CSL 2021 | 优化收敛 |

---

## 三、依赖与环境

| 依赖 | 说明 |
|------|------|
| MATLAB | 所有仿真独立 `.m` 文件 |
| MOSEK-MATLAB 或 CVX | 优化求解器，部分论文（Alonso2017、Ibuki2020 等）需要 |

MOSEK 学术免费（需 edu 邮箱申请 license），CVX 开源免费。

---

## 四、压路机场景的适用性

### 直接相关的 3 篇

| 论文 | 为什么相关 |
|------|-----------|
| **Zhao2018** | 仿射编队机动——编队可平移、旋转、缩放，压路机错位并排碾压本质就是仿射队形变换 |
| **Alonso2017** | 编队在有障碍物的动态环境中保持队形 + 优化方法，对应施工现场的多机路径协同 |
| **Antonelli2013** | 分布式观测器-控制器架构，每个 agent 只靠局部信息估计全局状态，对应无中心节点的分布式压路机编队 |

### 部分相关的 2 篇

| 论文 | 相关点 |
|------|--------|
| **Ibuki2020** | 多刚体分布式集群控制，可为压路机的 flocking 行为提供基础 |
| **Farivarnejad2018** | 分散式 PI 控制的稳定性分析，PI 控制是工程中最常用的控制器 |

### 不直接相关的 6 篇

优化算法类（Kia2015、Sun2020、Shi2015、Jakovetic2019、Qu2018、Zhang2021）属于基础理论，不是应用层编队控制，可直接跳过。

---

## 五、与 CARMA Platform 的定位对比

| 维度 | CARMA Platform | star2dust/paper-simulation |
|------|---------------|---------------------------|
| 定位 | 工程级自动驾驶平台 | 算法级论文复现合集 |
| 语言 | C++ (ROS) | MATLAB |
| 部署难度 | 极高（~60个包，ROS混合） | 低（跑 .m 文件即可） |
| 车辆模型 | 完整车辆动力学 | 点质量/单积分/双积分模型 |
| 通信 | V2V DSRC | 理想通信（不考虑延迟/丢包） |
| 适用阶段 | 实车部署 | 算法原理学习与验证 |
| 论文发表 | 无（工程平台） | 11 篇顶会/顶刊 |

**结论：CARMA 教你工程怎么搭，star2dust 教你算法怎么想。先跑 star2dust 理解编队控制的数学本质，再回头看 CARMA 的工程实现才有感觉。**

---

## 六、复现建议

### 优先级顺序

1. **Zhao2018 Affine Formation**：最贴近压路机错位队形需求
2. **Alonso2017 Multi-robot**：动态环境下的编队+避障，施工场景必备
3. **Antonelli2013 Decentralized**：分布式观测器架构，理解"不靠中心节点也能协调"

### 学习要点

- 每篇论文的代码集中在单目录内，先读论文再跑代码
- 重点关注**控制器结构**（集中式 vs 分布式）和**信息流图**（谁跟谁通信）
- 仿真参数可以直接改——比如把障碍物换成施工区域的边界约束
- 纯算法验证，不涉及物理引擎，适合在理解理论阶段快速迭代