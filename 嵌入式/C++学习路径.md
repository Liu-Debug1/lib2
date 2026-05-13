---
tags:
  - C++
  - 嵌入式
  - 汽车电子
  - 底盘控制
  - 毕设
date: 2026-05-12
---

# C++ 嵌入式学习路径（汽车底盘方向）

## 核心认知

不需要学全部 C++。**class / vector / virtual 三件套 + C 功底 = 底盘控制够用。** 剩下的瓶颈是数学（车辆动力学、LQR/MPC），不是语言。

|         | C 语言             | C++                |
| :------ | :--------------- | :----------------- |
| 核心脑回路   | 指针 → 操控内存地址      | RAII → 资源生命周期绑在对象上 |
| 标志性 Bug | 野指针、悬垂指针、忘关外设    | 忘记释放、双重释放、资源泄漏     |
| 适用层级    | MCU 底层驱动、硬件寄存器操作 | 域控上层算法、仿真、标定工具     |

---

## 一、必须会（底盘控制绕不开）

### 1. class / struct（C++ 版）

**作用**：封装 ESC 控制器、传感器融合模块。

```cpp
// 你现在 C 的写法：结构体 + 外部函数 + 传指针
motor_ctrl_t g_MotorMain;                          // 数据
Motor_Request(&g_MotorMain, MOTOR_REQ_AUTO_UP);   // 操作 → 传指针

// C++ 写法：数据和方法绑定
class MotorCtrl {
    MotorState_t state;3
    uint32_t startTime;
public:
    void request(MotorReq_t req);   // 不传指针，不暴露内部
    void process();                 // 状态机逻辑
};

MotorCtrl g_MotorMain;2
g_MotorMain.request(MotorReq::AUTO_UP);  // 接口清晰，不关心内部结构
```

> C++ 的 `struct` 和 `class` 本质相同，唯一区别是默认访问权限（struct 默认 public，class 默认 private）。嵌入式建模通常用 `class` 表达"这是一个有行为约束的模块"。

### 2. public / private

**作用**：保护状态不被外部随意修改。你的防夹状态机已经隐含了这个思想。

```cpp
class AntiPinchCtrl {
private:
    float baseline;     // 外部不能直接改
    float threshold;
    void calibrate();   // 内部校准逻辑
public:
    void init(float thresh);
    bool check(float current_ma);  // 唯一的外部入口
};
```

> 所有状态变量放 private，只通过 public 方法暴露受控的访问路径。这和你在 C 里用 `static` 限制作用域是同一思路。

### 3. 构造函数 / 析构函数

**作用**：替代你现在的 `_Init()` 和 `_Deinit()`。模块上电自动初始化、下电自动清理。

```cpp
class Motor {
public:
    Motor(TIM_TypeDef *tim, uint8_t ch)   // 构造 = _Init()
        : m_tim(tim), m_ch(ch), m_duty(0)
    {
        TIM_Cmd(m_tim, ENABLE);
        TIM_SetCompare(m_tim, m_ch, 0);
    }

    ~Motor() {                             // 析构 = _Deinit()
        TIM_Cmd(m_tim, DISABLE);
    }

    void setDuty(uint16_t duty) {
        m_duty = duty;
        TIM_SetCompare(m_tim, m_ch, duty);
    }

private:
    TIM_TypeDef *m_tim;
    uint8_t m_ch;
    uint16_t m_duty;
};
```

> 对象创建 = 外设初始化，对象销毁 = 外设关闭。不会忘记初始化、不会忘记关闭，编译器帮你保证。

### 4. virtual 虚函数

**作用**：底盘控制算法可插拔。PID 换 LQR、换 MPC，外面调用代码不用改。

```cpp
// 抽象接口：所有底盘控制器必须实现 compute()
class ChassisController {
public:
    virtual float compute(float target, float actual, float dt) = 0;
    virtual ~ChassisController() {}  // 虚析构函数，保证子类正确析构
};

// 具体实现1：PID
class PIDController : public ChassisController {
public:
    float compute(float target, float actual, float dt) override {
        // PID 算法
    }
};

// 具体实现2：LQR
class LQRController : public ChassisController {
public:
    float compute(float target, float actual, float dt) override {
        // LQR 算法
    }
};

// 使用方：不关心具体是什么算法
void controlLoop(ChassisController &ctrl) {
    float out = ctrl.compute(setpoint, feedback, 0.01f);
    // ...
}
```

### 5. STL vector / map

**作用**：代替 C 数组和链表，管理标定参数表、故障码表。

```cpp
#include <vector>
#include <map>

// 代替 uint16_t cal_table[20];
std::vector<uint16_t> calTable(20);

// 代替手动管理的故障码查找
std::map<uint8_t, const char*> faultCodes = {
    {0x01, "过流故障"},
    {0x02, "过热故障"},
    {0x03, "霍尔信号丢失"},
};
```

---

## 二、了解一下即可（知道存在，不必深究）

| 知识点                   | 原因                                         |
| :-------------------- | :----------------------------------------- |
| **模板元编程**             | 做库的人写的，你用就行。如 `std::vector<Motor>`         |
| **多继承 / 菱形继承**        | 嵌入式建模极少用，单继承 + 接口够用                        |
| **try / catch 异常**    | 车规代码禁止异常（AUTOSAR 要求编译时关 `-fno-exceptions`） |
| **智能指针 (shared_ptr)** | 实时系统内存全是静态分配，不存在"谁来释放"的问题                  |

---

## 三、你已经在用 C 模拟 C++ 了

当前防夹/车窗控制的状态机代码，本质上就是"准 C++ 设计"：

```
C 写法：                    C++ 等价：
motor_ctrl_t                →  class MotorCtrl
Motor_Request(&m, req)      →  m.request(req)
AntiPinch_Process(&ap)      →  ap.process()
ap->AP_state                →  private member（外部不可见）
```

你缺的不是设计思维，缺的是语法糖。学 C++ 时把 `_t` 后缀改成 `class`、把函数第一个参数 `self` 改成 `this`，其他思想不变。

---

## 四、推荐学习顺序

| 阶段  | 内容                            | 时间  | 目标                     |
| :-- | :---------------------------- | :-- | :--------------------- |
| 1   | class / public-private / 构造析构 | 3 天 | 把现有的电机控制模块用 class 重写一遍 |
| 2   | RAII 思维（资源绑对象）                | 2 天 | 理解"对象死了资源自动释放"         |
| 3   | virtual / override            | 3 天 | 实现算法可插拔，PID/LQR 切换     |
| 4   | vector / map                  | 1 天 | 管理标定数据、故障码表            |

**练手建议**：把你毕设的 `MotorCtrl` 模块先用 C++ class 重写，构造函数接管 TIM 初始化，析构函数关时钟。编译通过后，再往上加 virtual 抽象接口。这是最小可用路径。
