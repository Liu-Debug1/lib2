---
tags:
  - ROS2
  - 学习资料
  - 多机器人
created: 2026-05-21
---

# ROS/ROS2 学习资料

## B站教程

| 教程 | UP主 | 特点 |
|------|------|------|
| 鱼香ROS机器人 | 鱼香ROS | ROS2入门第一UP主，安装到项目实战全覆盖 |
| ROS2机器人零基础入门 | — | 全100集体系化教程，零基础到实战 |
| 康谋ROS2小车开发 | 康谋 | 含 Autoware + 实车部署 |

## 推荐书籍

| 书名 | 作者 | 年份 | 说明 |
|------|------|------|------|
| 《ROS 2 智能机器人开发实践》 | 胡春旭、李乔龙 | 2025 | 中文实战，ROS2 Jazzy + Gazebo，双语言代码+中文注释 |
| 《Mastering ROS 2 for Robotics Programming》第4版 | Lentin Joseph | 2025 | 最全英文进阶，Nav2、MoveIt2、LLM集成 |

## ROS2 + Gazebo 多机器人仿真要点

- 每个机器人独立命名空间（`<group ns="robot1">`）
- 参数化 xacro 宏作模板
- 每个机器人配独立 Nav2 实例
- **Gazebo Classic 已停服，用 Gazebo Harmonic + ROS2 Jazzy**

## 开源项目参考

| 项目 | 说明 |
|------|------|
| `rbot` | ROS2 Jazzy + Gazebo Harmonic AMR 仿真栈 |
| `m-explore-ros2` | 多机器人协同探索，含地图合并 |
| `SimuBotFleet` | 多机器人车队管理，AI 任务分配 |

## 免费课程

| 课程 | 平台 | 说明 |
|------|------|------|
| ROS 2 from Scratch | Class Central | 14章，节点/话题/服务/Gazebo |
| Henki Robotics 开源课 | GitHub | Docker免安装，6个实战模块 |
| The Construct 基础课 | 官网 | 浏览器仿真，无需本地安装 |

**学习路线**：鱼香ROS/B站100集 → 《ROS 2智能机器人开发实践》 → rbot 多机实战
