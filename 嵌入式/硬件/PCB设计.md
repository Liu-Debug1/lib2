---
tags:
  - 硬件
  - PCB设计
  - 原理图
  - 毕设
date: 2026-05-12
---

# PCB 设计笔记

## 1. 原理图四要素

原理图由四个基本要素构成：**元件符号**、**连接线**、**节点**、**注释**。

### 1.1 元件符号

#### 电阻 (Resistor)

| 属性 | 内容 |
|:-----|:-----|
| 符号 | 矩形或锯齿线 |
| 单位 | 欧姆 (Ω) |
| 作用 | 限流、分压、上拉/下拉 |

![电阻定义符号\|400](https://api2.mubu.com/v3/document_image/5874a010-a7e2-48e8-a8ff-ed56de1825a4-28368310.jpg?)

**读数规则**：贴片电阻印有数字，读法与色环电阻相同（三位数/四位数编码）。

![电阻读数规则\|400](https://api2.mubu.com/v3/document_image/54053201-73db-4aa0-b579-787c28aa0f1c-28368310.jpg?)

#### 电容 (Capacitor)

| 属性 | 内容 |
|:-----|:-----|
| 符号 | `--||--`（无极性）/ `--|(---`（有极性，弧形端为负极） |
| 单位 | 法拉 (F)，常用 μF、nF、pF |
| 作用 | 储能、滤波、去耦、隔直通交 |

![电容定义符号\|400](https://api2.mubu.com/v3/document_image/686e86f9-f1a5-4046-a9d3-7534671ac620-28368310.jpg?)

| 识别项 | 说明 |
|:-------|:-----|
| 类型 | 电解电容有极性，陶瓷/CBB 电容无极性 |
| 容值 | 三位数编码（如 104 = 100nF）或直标 |
| 耐压 | 必须标注，实际使用不可超过 |

![电容分类\|400](https://api2.mubu.com/v3/document_image/fd165d36-9c28-430b-90b7-b6eed8739149-28368310.jpg?)
![电容参数信息\|400](https://api2.mubu.com/v3/document_image/edb57f50-687c-4d0a-b256-a12c051cdb1d-28368310.jpg?)

#### 电感 (Inductor)

| 属性 | 内容 |
|:-----|:-----|
| 符号 | 半圆弧波浪线 |
| 单位 | 亨利 (H)，常用 μH |
| 作用 | 储能、滤波、扼流 |

![电感定义符号\|400](https://api2.mubu.com/v3/document_image/6082541d-e8d6-4f91-8124-19e0645e58f1-28368310.jpg?)
![电感分类\|400](https://api2.mubu.com/v3/document_image/c2bb189f-bc6e-4881-9773-c822df8c9230-28368310.jpg?)
![电感读值\|400](https://api2.mubu.com/v3/document_image/296c53b0-038f-485e-a76f-936389722b83-28368310.jpg?)

#### 二极管 (Diode)

| 属性 | 内容 |
|:-----|:-----|
| 符号 | 三角形 + 横线（→|—） |
| 特性 | 正向导通（≈0.7V），反向截止 |
| 作用 | 整流、钳位、稳压、续流 |

![二极管定义符号\|400](https://api2.mubu.com/v3/document_image/0e9130a1-725f-4606-aa61-a1e970348f7b-28368310.jpg?)
![二极管特性曲线\|400](https://api2.mubu.com/v3/document_image/1b7f122f-76b9-41f9-890c-6e5d23509358-28368310.jpg?)
![二极管应用场景\|400](https://api2.mubu.com/v3/document_image/a53e9971-4e10-48d9-bb7e-e07e3abce99d-28368310.jpg?)

**正负极区分**：

![二极管正负极识别_1\|300](https://api2.mubu.com/v3/document_image/a0d73597-1187-4161-aa80-f7054b60d10e-28368310.jpg?)
![二极管正负极识别_2\|300](https://api2.mubu.com/v3/document_image/ad2b0d75-04aa-4599-a3ff-2db4d6518f9b-28368310.jpg?)

#### 三极管 (BJT)

| 属性 | 内容 |
|:-----|:-----|
| 类型 | NPN（箭头朝外）/ PNP（箭头朝内） |
| 三极 | 基极 B、集电极 C、发射极 E |
| 作用 | 开关、放大 |

> [!tip] 水阀模型
> $I_B$ 越大 → 水阀开口越大 → 通过的水流 ($I_C$) 越大。
> **饱和状态**：水阀全开，$I_B$ 再增大，$I_C$ 也不再增加。

| 状态 | 特征 |
|:-----|:-----|
| 截止 | 水阀关闭，$I_C = 0$ |
| 放大 | $I_C = \beta I_B$，线性关系 |
| 饱和 | 水阀全开，$I_C$ 达上限 |

![三极管定义符号_1\|400](https://api2.mubu.com/v3/document_image/a3a1ef99-1843-4081-aa83-b321bdcaf965-28368310.jpg?)
![三极管定义符号_2\|400](https://api2.mubu.com/v3/document_image/56522006-a849-4fa2-9ccb-0e46132622a5-28368310.jpg?)
![三极管应用场景\|400](https://api2.mubu.com/v3/document_image/e422406c-19ca-45d4-bdb4-85f87171629c-28368310.jpg?)

#### 场效应管 (MOSFET)

| 属性 | 内容 |
|:-----|:-----|
| 符号 | N 沟道 / P 沟道，栅极不直接连接沟道 |
| 三极 | 栅极 G、漏极 D、源极 S |
| 特点 | 电压控制型，输入阻抗极高 |

![MOSFET定义符号\|400](https://api2.mubu.com/v3/document_image/6ff2f37a-edd9-457c-a6ec-551683cabe81-28368310.jpg?)

| 对比项 | 三极管 (BJT) | 场效应管 (MOSFET) |
|:-------|:------------|:------------------|
| 控制方式 | 电流控制 ($I_B$) | 电压控制 ($V_{GS}$) |
| 输入阻抗 | 较低 | 极高 |
| 导通压降 | $V_{CE(sat)} \approx 0.3V$ | $R_{DS(on)}$，毫欧级 |
| 开关速度 | 中等 | 快 |

![BJT vs MOSFET\|400](https://api2.mubu.com/v3/document_image/1ae172a1-33ae-47a3-80ce-21b69fecaffc-28368310.jpg?)

**封装类型**：

![MOSFET封装_1\|300](https://api2.mubu.com/v3/document_image/4d806382-be19-46f9-bfbb-f84b42fd18e5-28368310.jpg?)
![MOSFET封装_2\|300](https://api2.mubu.com/v3/document_image/2a1f881b-5758-4f25-a97e-f5a4e22cc9d6-28368310.jpg?)
![MOSFET封装_3\|300](https://api2.mubu.com/v3/document_image/c3b40f46-1682-4743-a8d7-89c93986f8b6-28368310.jpg?)

### 1.2 连接线

| 形式 | 说明 |
|:-----|:-----|
| **绿色细线** | 原理图中的连线，实际 PCB 中对应条状铜箔 |
| **网络标签 (Net Label)** | 相同名称的标签表示电气连接，无需画线，简化图纸 |

**常用网络标签**：

| 标签 | 含义 |
|:-----|:-----|
| VCC / 3V3 / 5V | 电源正极 |
| GND | 电源地 |
| SCL / SDA | I2C 总线 |
| TXD / RXD | 串口收发 |
| nRST | 复位信号（低有效） |

![常用网络标签\|400](https://api2.mubu.com/v3/document_image/4ee2f856-2ad5-4776-8dc6-708f28a336db-28368310.jpg?)

### 1.3 节点

导线交叉处的**实心圆点**表示电气连接，无圆点则表示交叉但不连接。

### 1.4 注释

用于标注关键信息（如"此电阻限制 LED 电流"），方便他人阅读和理解原理图。

![注释示例\|400](https://api2.mubu.com/v3/document_image/258bee70-8a62-463d-8e02-c422603a0386-28368310.jpg?)

---

## 2. 数据手册阅读指南

以 TI / ST 等厂商的芯片数据手册为例，标准结构与阅读要点：

| 章节 | 内容 | 关注重点 |
|:-----|:-----|:---------|
| **1. 特性** | 产品特点概述 | 快速判断芯片是否适用 |
| **2. 应用** | 典型应用场景与公式 | 参考电路设计 |
| **3. 说明** | 芯片功能文字描述 | 理解工作原理 |
| **5. 引脚配置** | 引脚定义和功能表 | I/O 方向、复用功能 |
| **6. 规格** | 电气特性（min/typ/max） | 电压范围、ESD 等级、工作条件 |
| **7. 详细说明** | 功能框图 + 特性描述 | 深入理解内部结构 |
| **8. 应用实现** | 厂家推荐电路 | 设计参考起点 |
| **9. 电源建议** | 供电要求 | 去耦、滤波方案 |
| **10. 布局** | PCB 布局指南 | 走线、散热建议 |
| **12. 封装信息** | 机械尺寸图 | 自己绘制 PCB 封装 |

**常用引脚标识**：

| 标识 | 含义 |
|:-----|:-----|
| I / O | 输入 / 输出 |
| BOOT | 启动模式选择引脚 |
| NC | 不需连接（Not Connected） |
| ENA / EN | 使能引脚，控制芯片导通/关闭 |
| VIN | 输入电源电压 |

> [!tip] 数据手册获取途径
> EDA 立创商城 / TI 官网 / ST 官网可直接下载。以厂家给的参考电路为基础，结合自己的需求修改设计。

---

## 3. 电路基本原理

### 3.1 基本概念

| 概念 | 定义 |
|:-----|:-----|
| **支路** | 电路中通过同一电流的通路 |
| **回路** | 电路中任意闭合路径 |
| **网孔** | 内部不含其他支路的回路（最小回路） |

### 3.2 基尔霍夫定律

> [!important] 适用范围
> 仅适用于**集总参数**电路。参考方向以标注为准，与实际电流方向无关。

**KCL（基尔霍夫电流定律）**：任意节点上，流入电流之和 = 流出电流之和 ($\sum I_{in} = \sum I_{out}$)

![KCL示意_1\|400](https://api2.mubu.com/v3/document_image/a949ac70-9993-46e6-8223-2fe6446b21ca-28368310.jpg?)
![KCL示意_2\|400](https://api2.mubu.com/v3/document_image/b71364fa-629e-43c4-91ba-9076b42dea05-28368310.jpg?)

**KVL（基尔霍夫电压定律）**：任意闭合回路中，各段电压的代数和为零 ($\sum V = 0$)

---

## 4. 读懂原理图

### 4.1 阅读方法

1. 将原理图**拆分成各个功能模块**
2. 识别每个模块使用的**集成芯片**
3. 先去读对应芯片的**数据手册**
4. 把芯片外围电路与手册里的**典型应用**对照

### 4.2 画图要点

**分模块、分图页**：不要把所有电路挤在一张图上。按功能分页——电源、MCU、驱动、传感器各自独立，用网络标签跨页连接。

![分模块画图_1\|400](https://api2.mubu.com/v3/document_image/59924e5d-1dca-4b9f-aa50-c458100b6b1b-28368310.jpg?)
![分模块画图_2\|400](https://api2.mubu.com/v3/document_image/0c72cb26-1992-4986-934c-197a34322f43-28368310.jpg?)
![分模块画图_3\|400](https://api2.mubu.com/v3/document_image/328eeea0-a2fe-454e-b9d1-ba7588f880ed-28368310.jpg?)
![分模块画图_4\|400](https://api2.mubu.com/v3/document_image/45c2fc9e-0f3f-4150-87e1-7561b1976076-28368310.jpg?)

---

## 5. PCB 设计基础

### 5.1 PCB 的组成

| 组成部分 | 说明 |
|:---------|:-----|
| **基板** | 绝缘材料（FR-4），双面板为主流 |
| **铜箔** | 经蚀刻形成导线（走线），实现电气连接 |
| **铺铜** | 大面积铜皮，用于接地、散热、减少 EMI |
| **过孔** | 连接顶层和底层的金属化孔 |
| **焊盘** | 元件焊接点，通孔焊盘或贴片焊盘 |
| **丝印** | 白色文字/图形，标注元件位置和编号 |
| **阻焊** | 覆盖铜箔的绝缘漆（绿色最常见），防止短路。焊盘边缘的紫色线 = 阻焊开窗 |

![PCB双面板\|400](https://api2.mubu.com/v3/document_image/ccb27acd-d7f5-41b4-bbc0-ac6ff1d804fd-28368310.jpg?)
![PCB多层\|400](https://api2.mubu.com/v3/document_image/31c16fc8-93a3-452f-b1e5-575be24f708d-28368310.jpg?)
![铺铜示意\|300](https://api2.mubu.com/v3/document_image/7b9717d6-5067-4d43-a128-18a08ccd4d25-28368310.jpg?)
![铺铜实例\|300](https://api2.mubu.com/v3/document_image/0c962c67-6abf-426f-a033-8b64680f181d-28368310.jpg?)
![过孔示意\|300](https://api2.mubu.com/v3/document_image/0c88bb26-e2b5-42a2-a379-b47eaf038b18-28368310.jpg?)
![过孔实例\|300](https://api2.mubu.com/v3/document_image/0b2935f1-a3c9-42d0-9416-1af8d3f74edf-28368310.jpg?)
![焊盘\|300](https://api2.mubu.com/v3/document_image/7ac6383a-63ba-487d-b6db-e56c394c1584-28368310.jpg?)
![丝印阻焊\|300](https://api2.mubu.com/v3/document_image/c892165b-b4c6-48b8-b0b3-f41b42112639-28368310.jpg?)
![阻焊边缘\|300](https://api2.mubu.com/v3/document_image/f3c3f8fc-1f71-4f63-a932-4a462fc9bd9e-28368310.jpg?)
![阻焊示意\|300](https://api2.mubu.com/v3/document_image/d36749af-d3e3-446e-b0a9-736826e741ee-28368310.jpg?)

### 5.2 PCB 叠层结构

本笔记以**双层板**为例：

| 层 | 说明 |
|:---|:-----|
| **顶层丝印** (Top Overlay) | 白色文字，标注元件 |
| **顶层阻焊** (Top Solder) | 绝缘绿油 |
| **顶层铜箔** (Top Layer) | 信号走线 |
| **基板** (FR-4) | 绝缘介质 |
| **底层铜箔** (Bottom Layer) | 信号走线 |
| **底层阻焊** (Bottom Solder) | 绝缘绿油 |
| **底层丝印** (Bottom Overlay) | 白色文字 |

> [!note] 其他层说明
> - **锡膏层** (Paste Mask)：用于钢网印刷锡膏，SMT 贴片使用
> - **多层** (Multi-Layer)：跨层焊盘和过孔所属的层

![双层板叠层\|400](https://api2.mubu.com/v3/document_image/159c01be-3bc4-4c8d-b3d8-b292f31739f1-28368310.jpg?)
![信号层示意\|400](https://api2.mubu.com/v3/document_image/48e7e7fb-8a8b-405c-962e-ee8ee6aca3c9-28368310.jpg?)
![丝印阻焊示意\|400](https://api2.mubu.com/v3/document_image/0d4ae302-0308-4c41-9e2c-d505cc22f21a-28368310.jpg?)
![信号层\|300](https://api2.mubu.com/v3/document_image/52905e00-7980-4bdc-a91d-4b129feb30ef-28368310.jpg?)
![丝印层\|300](https://api2.mubu.com/v3/document_image/12bc3bef-aa5f-4c4d-90b4-f1eef88da852-28368310.jpg?)

### 5.3 元件符号与封装

- **原理图符号**：逻辑上的图形表示，不限实际尺寸
- **PCB 封装**：元件的物理尺寸和焊盘位置，**必须与实物一致**

![符号与封装对比\|500](https://api2.mubu.com/v3/document_image/127fea4b-da04-41ff-b016-72f2f9c5532b-28368310.jpg?)

---

## 6. 单片机最小系统

STM32 最小系统需包含：

| 模块 | 说明 |
|:-----|:-----|
| MCU 芯片 | STM32F103C8T6 等 |
| 电源 | 3.3V 供电，加去耦电容 |
| 复位电路 | nRST 上拉 + 按键到 GND |
| 晶振 | 8MHz 主晶振 + 32.768kHz RTC 晶振 |
| BOOT 配置 | BOOT0 接地（从 Flash 启动） |
| SWD 接口 | SWDIO + SWCLK + GND，烧录/调试 |

![单片机最小系统_1\|400](https://api2.mubu.com/v3/document_image/e0f7c23f-7932-4ac0-9222-b1f48bf8a506-28368310.jpg?)
![单片机最小系统_2\|400](https://api2.mubu.com/v3/document_image/89d8c383-f2a5-4a5a-b82a-313df535db19-28368310.jpg?)
![单片机最小系统_3\|400](https://api2.mubu.com/v3/document_image/9cccafbb-2678-439c-ab08-cf6febe43401-28368310.jpg?)

> [!tip] 线性稳压器
> 用于降压并稳定输出电压（如 5V → 3.3V）。

---

## 7. 电容与晶振布局

### 7.1 电容

| 用途 | 说明 |
|:-----|:-----|
| **滤波** | 平滑电源纹波 |
| **去耦** | 每个 IC 电源引脚旁放置 **0.1μF** 电容，提供瞬时电流 |
| **谐振** | 与电感组成 LC 谐振回路 |

> [!tip] 选型原则
> - 小电容（0.1μF）→ 滤高频
> - 大电容（10μF ~ 100μF）→ 滤低频

### 7.2 晶振

- **尽量贴近 MCU 引脚**布局，缩短走线
- **不要贴在板子边缘**，防止外力碰撞导致晶振外切损坏

---

## 8. PCB 布局与布线要求

### 8.1 布局要求

![PCB布局要求_1\|500](https://api2.mubu.com/v3/document_image/fa4d2be2-e010-4d2e-be96-2db7aa4aa39c-28368310.jpg?)
![PCB布局要求_2\|500](https://api2.mubu.com/v3/document_image/4da8989a-61e6-43a8-8b80-29b57017801a-28368310.jpg?)

### 8.2 布线要求

- **电容从大到小连接到后级**：大电容在前（储能），小电容在后（高频滤波）
- **电源线加粗**：承载大电流
- **地线尽可能粗、短**，减少地回路阻抗

![布线要求_1\|400](https://api2.mubu.com/v3/document_image/2edad2df-8318-497b-9dfa-89bfc3133fbe-28368310.jpg?)
![布线要求_2\|400](https://api2.mubu.com/v3/document_image/3b3cbd1e-02f0-4ef4-9177-aad6a3c6b54f-28368310.jpg?)
![布线要求_3\|400](https://api2.mubu.com/v3/document_image/b9e8fc7e-86e3-4906-8c73-b5f248892787-28368310.jpg?)
