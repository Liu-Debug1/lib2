---
tags:
  - Fields2Cover
  - 全覆盖路径规划
  - C++
  - 压路机
date: 2026-05-27
---

# Fields2Cover 详解

> 农业机械全覆盖路径规划库，IEEE RA-L 2023 发表。**与压路机碾压路径规划高度同构**，是当前最值得深入研究的开源项目。

---

## 一、基本信息

| 项目 | 详情 |
|------|------|
| 仓库 | <https://github.com/Fields2Cover/Fields2Cover> |
| 星标 | ~500+ |
| 语言 | C++ (核心) + Python (SWIG 绑定，非常完整) |
| 许可证 | BSD-3-Clause |
| 依赖 | GDAL、OR-Tools、Eigen3、steering_functions、matplotplusplus |
| 本地路径 | `D:\桌面\研0记录\Fields2Cover\` |

---

## 二、核心架构：五阶段覆盖路径规划流水线

```
F2CCell (多边形区域)
    │
    ▼
[1. 分解] f2c::decomp::
    将非凸区域分解为凸子区域（可选）
    ├── TrapezoidalDecomp (梯形分解)
    └── BoustrophedonDecomp (牛耕分解，v2.0 新增)
    │
    ▼
[2. 地头生成] f2c::hg::
    从边界创建缓冲区，分离"地头"和"主作业区"
    └── ConstHL (恒定宽度地头)
    │
    ▼
[3. 条带生成] f2c::sg::
    生成平行覆盖条带（核心步骤）
    └── BruteForce (0~180° 暴力搜索最优角度)
    │
    ▼
[4. 路由规划] f2c::rp::
    对条带排序，决定遍历顺序
    ├── RoutePlannerBase (OR-Tools TSP 求解)
    ├── SnakeOrder (蛇形顺序)
    ├── SpiralOrder (螺旋顺序)
    └── BoustrophedonOrder (牛耕顺序)
    │
    ▼
[5. 路径规划] f2c::pp::
    使用运动学模型连接条带（转弯）
    ├── DubinsCurves (标准 Dubins，仅前进)
    ├── DubinsCurvesCC (连续曲率 Dubins，有回旋曲线)
    ├── ReedsSheppCurves (支持前进+后退)
    └── ReedsSheppCurvesHC (连续曲率 Reeds-Shepp)
    │
    ▼
输出：F2CPath (离散状态序列：x, y, 角度, 速度, 方向)
```

---

## 三、关键 API

### 3.1 高层一键 API

```cpp
#include <fields2cover.h>

// 定义车辆
F2CRobot robot(2.0,       // 车宽 [m]
               6.0,       // 覆盖宽度 [m] (碾压带宽)
               0.5,       // 最大曲率 = 1/最小转弯半径 [1/m]
               0.1);      // 曲率变化率 [1/m²]
robot.setCruiseVel(5.0);  // 作业速度 [m/s]
robot.setTurnVel(2.0);    // 转弯速度 [m/s]

// 定义场地
F2CLinearRing ring{F2CPoint(0,0), F2CPoint(100,0),
                   F2CPoint(100,8), F2CPoint(0,8), F2CPoint(0,0)};
F2CCell cell;
cell.addRing(ring);  // 100m×8m 路面

// 一键规划
F2CPath path = f2c::planCovPath(robot, cell);
// path.getState(i) → {x, y, angle, velocity, direction, type}
```

### 3.2 逐步 API（精细控制）

```cpp
// 1. 导入场地
F2CField field = f2c::Parser::importFieldGml("road.gml");

// 2. 条带生成（角度搜索）
f2c::sg::BruteForce bf;
bf.setStepAngle(1.0 * M_PI / 180);  // 1° 步长
auto swaths = bf.generateBestSwaths(obj, cov_width, cell);

// 3. 路由排序（OR-Tools TSP）
f2c::rp::RoutePlannerBase rp;
rp.setStartAndEndPoint(start);
auto route = rp.genRoute(headland_swaths, swaths);

// 4. 路径生成（运动学转弯）
f2c::pp::DubinsCurves dubins;
dubins.setDiscretization(0.05);  // 转弯路径离散精度
auto path = f2c::pp::PathPlanning::planPath(robot, swaths, dubins);
```

### 3.3 车辆模型参数

```cpp
robot.setMinTurningRadius(4.0);  // 替代 setMaxCurv——压路机转弯半径大
robot.setCruiseVel(1.5);        // 压路机作业速度约 1~3 m/s (5~10 km/h)
robot.setTurnVel(0.5);          // 转弯更慢
```

---

## 四、压路机场景映射

### 4.1 碾压场景 → Fields2Cover 输入

```
路面：100m × 8m 矩形 → F2CCell (Polygon)
碾压带宽：2.2m → cov_width = 2.2
碾压遍数：6遍 → 6次 planCovPath，或自定义重复覆盖
最小转弯半径：6m → max_curv = 1/6.0 ≈ 0.167
作业速度：1.5 m/s → cruise_vel = 1.5 (约5.4 km/h)
路面纵向 → 条带角度 = 0° 或 90°（取决于碾压方向）
```

### 4.2 关键概念映射表

| Fields2Cover | 压路机场景 | 值示例 |
|-------------|-----------|--------|
| `cov_width` | 碾压带宽度（轮宽 - 搭接量） | 2.0~2.2m |
| `robot.width` | 压路机总宽 | 2.3m |
| `cruise_vel` | 作业碾压速度 | 1.5~3.0 m/s |
| `max_curv` | 1/最小转弯半径 | 1/6.0 ≈ 0.167 (铰接转向) |
| Cell polygon | 路面区域 | 100m × 8m 矩形 |
| Swath | 一条碾压带 | 100m 长直线 |
| Headland | 路面两端掉头空间 | 路面端部 |
| Dubins turn | U 型掉头转弯 | 转弯半径 ≥ 6m |

---

## 五、多车支持评估

**Fields2Cover 本身不包含多车协同！** 需要自己实现：

1. **路段划分**：用 `F2CCells::splitByLine()` 将路面切分为多个子区域
2. **分别规划**：每个子区域调用 `planCovPath()`
3. **冲突消解**：检查路径重叠、时间窗口分配

这意味着多机覆盖的核心挑战（如何分区域、如何保证碾压遍数一致、如何避免碰撞）需要自行开发。Fields2Cover 解决了**单机**覆盖路径规划，多机部分需要在此基础上扩展。

---

## 六、Python 绑定

SWIG 包装非常完整，几乎覆盖所有 C++ API。Python 版本命名加前缀：

```python
import fields2cover as f2c

robot = f2c.F2CRobot(2.0, 6.0)
bf = f2c.SG_BruteForce()          # C++: f2c::sg::BruteForce
dubins = f2c.PP_DubinsCurves()    # C++: f2c::pp::DubinsCurves
path = f2c.planCovPath(robot, cell)
```

---

## 七、评价与结论

### 优势

- **五阶段流水线设计清晰**，每个阶段可独立使用
- **Dubins/Reeds-Shepp 转弯模型**直接适用压路机铰接转向
- **C++ 和 Python 双语言**，原型验证用 Python，工程落地用 C++
- **论文支撑** (RA-L 2023)，算法有学术依据
- **活跃维护**，v2.0 新增 Boustrophedon 分解

### 不足

- **无多车协同**，需自己实现任务分配和冲突消解
- 依赖较重的 GDAL + OR-Tools，嵌入式部署困难
- 假设车辆可沿任意曲线行驶，未考虑铰接式车辆的独特性

### 压路机适用度

| 维度 | 评分 | 说明 |
|------|:--:|------|
| 覆盖路径生成 | 直接可用 |
| 运动学约束 | 直接可用（Dubins） |
| 碾压遍数管理 | 需包装 |
| 多机协同 | 需自己写 |
| 嵌入式部署 | 需裁剪 |

**结论：压路机单机碾压路径规划可以直接用。多机协同部分需要基于 Fields2Cover 的输出做二次开发（路段划分 + 任务分配 + 冲突消解）。**
