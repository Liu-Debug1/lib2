---
tags:
  - CoveragePlanner
  - BCD
  - 全覆盖路径规划
  - Boustrophedon
date: 2026-05-27
---

# CoveragePlanner 与 BCD 详解

> 两个独立的 C++ 全覆盖路径规划项目，分别基于梯形分解和 Boustrophedon 分解，算法层面有参考价值。

---

## 一、CoveragePlanner

### 基本信息

| 项目   | 详情                                                           |
| ---- | ------------------------------------------------------------ |
| 仓库   | <https://github.com/RicheyHuang/CoveragePlanner>             |
| 星标   | ~238                                                         |
| 语言   | C++14                                                        |
| 依赖   | CGAL 5.0+, OpenCV 4.0+, Eigen3                               |
| 原始来源 | ETH Zurich `polygon_coverage_planning` (Rik Bähnemann, 2019) |
| 本地路径 | `D:\桌面\研0记录\CoveragePlanner\`                                |

### 核心流程

```
PNG/PGM 栅格地图
    │  cv::imread → 二值化 → 膨胀(机器人半径补偿) → 腐蚀(去噪)
    ▼
提取多边形 (cv::findContours + approxPolyDP)
    │  外轮廓 = 可行区域，子轮廓 = 障碍物(孔)
    ▼
BCD 分解 (computeBestBCD)
    │  在所有候选方向中暴力搜索 → 选择总高度最小的分解
    ▼
细胞排序 (DFS 回溯，非 TSP)
    │  通过 CGAL::join 构建邻接图 → DFS 确定遍历顺序
    ▼
往复扫描 (computeSweep)
    │  每个细胞内生成牛耕式往返路径
    ▼
可见性图 + A* 最短路径
    │  细胞间过渡路径
    ▼
输出路径 + GIF 动画
```

### 关键算法

**Boustrophedon 单元分解 (BCD)**：Choset (2000) 经典算法，平面扫描法。事件类型：OUT(顶点开始)、IN(顶点结束)、MIDDLE(中间事件)。维护开放多边形列表，扫描线每过一个顶点执行一次事件处理。

**暴力方向搜索**：提取多边形所有边的方向 + 垂直方向作为候选，对每个方向做 BCD，选择总细胞高度最小的结果。

**路径生成**：在每个细胞内部生成间隔 = 机器人宽度的平行扫描线，交替方向形成牛耕路径。扫描线起终点间的连接使用可见性图 + A* 最短路径。

### 压路机适用度

| 维度 | 评分 | 说明 |
|------|:--:|------|
| BCD 算法本身 | 可直接复用 |
| 方向优化搜索 | 可参考 |
| 运动学约束 | 无，需自己加 |
| 多机支持 | 无 |
| 输入格式 | 需改为多边形 API(当前只能读图片) |
| 代码维护 | 示例级，非库 |

---

## 二、BCD-boustrophedon_path_planner

### 基本信息

| 项目 | 详情 |
|------|------|
| 仓库 | <https://github.com/qiangsun89/BCD-boustrophedon_path_planner> |
| 语言 | C++，纯头文件库 |
| 依赖 | 无第三方依赖 |
| 本地路径 | `D:\桌面\研0记录\BCD-boustrophedon_path_planner\` |

### 核心算法

**改进的梯形分解**，核心函数：

```cpp
std::vector<std::vector<Location>>
boustrophedonDecompositionPlanner(
    const std::vector<Location> points,  // 多边形顶点 (逆时针)
    double waypoint_angle                // 扫描方向角度
);
```

事件类型：Split(分裂)、Merge(合并)、Middle(中间)——比传统梯形分解多了 Middle 事件处理，使分解结果更少、更规整。

算法流程：

1. 按 waypoint_angle 旋转多边形
2. 收集所有顶点，按 x 坐标排序
3. 逐个处理事件点，维护活跃边列表
4. Split → 打开新细胞，Merge → 合并细胞，Middle → 更新细胞
5. 输出子多边形列表

### 与 CoveragePlanner 的 BCD 对比

| 特性 | CoveragePlanner BCD | BCD-boustrophedon |
|------|-------------------|-------------------|
| 算法来源 | Choset (2000) BCD | 改进的梯形分解 |
| 事件类型 | OUT/IN/MIDDLE | Split/Merge/Middle |
| 依赖 | CGAL | 无 |
| 方向优化 | 暴力搜索 | 手动指定角度 |
| 路径生成 | 含扫描+A* | 仅分解，无路径 |
| 代码量 | ~3000 行 | ~600 行 |
| 可作为库 | 否（示例代码） | 可（纯头文件） |

### 压路机适用度

| 维度 | 评分 | 说明 |
|------|:--:|------|
| 轻量级、无依赖 | C++ 嵌入式友好 |
| 仅分解，无路径 | 需自己写扫描和转弯 |
| 单多边形输入 | 不支持带孔多边形(路面简单不需要) |

---

## 三、总结

两个项目都是**覆盖路径规划的算法参考**，不是拿来就能用的库：

- **CoveragePlanner**：完整流程(分解→扫描→排序→路径)但代码是示例级，且过度依赖 CGAL，不适合嵌入式
- **BCD-boustrophedon**：纯分解算法，轻量无依赖，适合嵌入需要，但缺少路径生成和运动学约束

**建议**：核心覆盖路径规划用 Fields2Cover，BCD 分解算法可从这两个项目提取算法思路作为备选方案（当压路机场地过于复杂，Fields2Cover 的梯形分解不够时）。
