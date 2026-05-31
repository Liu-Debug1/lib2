const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType,
  Header, Footer, PageNumber, PageBreak, TableOfContents
} = require("docx");

// helpers
const tB = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const cB = { top: tB, bottom: tB, left: tB, right: tB };
const hShade = { fill: "1F4E79", type: ShadingType.CLEAR };
const aShade = { fill: "F5F8FC", type: ShadingType.CLEAR };
const nShade = { fill: "FFF8E1", type: ShadingType.CLEAR };
const tShade = { fill: "E8F5E9", type: ShadingType.CLEAR };

function hc(text, width) {
  return new TableCell({
    borders: cB, width: width ? { size: width, type: WidthType.DXA } : undefined,
    shading: hShade, verticalAlign: "center",
    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text, bold: true, color: "FFFFFF", size: 20, font: "Microsoft YaHei" })] })]
  });
}
function dc(text, width, opts = {}) {
  return new TableCell({
    borders: cB, width: width ? { size: width, type: WidthType.DXA } : undefined,
    shading: opts.alt ? aShade : undefined,
    children: [new Paragraph({ children: [new TextRun({ text, size: 20, font: "SimSun", ...opts })] })]
  });
}
function bp(text, opts = {}) {
  return new Paragraph({
    spacing: { after: opts.sa || 120 },
    indent: opts.ni ? undefined : { firstLine: opts.code ? 0 : 480 },
    children: [new TextRun({ text, size: opts.code ? 18 : 24, font: opts.code ? "Consolas" : "SimSun", ...opts })]
  });
}
function hd(text, level) {
  const sizes = { 1: 36, 2: 30, 3: 26 };
  const colors = { 1: "1F4E79", 2: "2E75B6", 3: "333333" };
  return new Paragraph({
    heading: level,
    spacing: { before: level === 1 ? 400 : 280, after: 180 },
    children: [new TextRun({ text, size: sizes[level] || 26, bold: true, font: "Microsoft YaHei", color: colors[level] || "333333" })]
  });
}
function nt(text) {
  return new Paragraph({
    spacing: { before: 100, after: 100 }, indent: { left: 360 },
    border: { left: { style: BorderStyle.SINGLE, size: 6, color: "E6A817" } },
    shading: nShade,
    children: [new TextRun({ text, size: 20, font: "SimSun", italics: true })]
  });
}
function tp(text) {
  return new Paragraph({
    spacing: { before: 100, after: 100 }, indent: { left: 360 },
    border: { left: { style: BorderStyle.SINGLE, size: 6, color: "4CAF50" } },
    shading: tShade,
    children: [new TextRun({ text, size: 20, font: "SimSun" })]
  });
}
function tbl(headers, rows, widths) {
  return new Table({
    columnWidths: widths,
    rows: [
      new TableRow({ tableHeader: true, children: headers.map((h, i) => hc(h, widths ? widths[i] : undefined)) }),
      ...rows.map((row, ri) => new TableRow({
        children: row.map((c, ci) => dc(c, widths ? widths[ci] : undefined, { alt: ri % 2 === 1 }))
      }))
    ]
  });
}
function sp() { return new Paragraph({ spacing: { after: 80 }, children: [] }); }
function pb() { return new Paragraph({ children: [new PageBreak()] }); }

const C = [];

// cover
C.push(new Paragraph({ spacing: { before: 3200 }, children: [] }));
C.push(new Paragraph({
  alignment: AlignmentType.CENTER, spacing: { after: 160 },
  children: [new TextRun({ text: `压路机单机控制与双机协同`, size: 48, bold: true, font: "Microsoft YaHei", color: "1F4E79" })]
}));
C.push(new Paragraph({
  alignment: AlignmentType.CENTER, spacing: { after: 400 },
  children: [new TextRun({ text: `实现方案与技术汇总`, size: 30, font: "Microsoft YaHei", color: "555555" })]
}));
C.push(new Paragraph({
  alignment: AlignmentType.CENTER, spacing: { after: 100 },
  children: [new TextRun({ text: `—— 从传感器到执行器的完整链路解析 ——`, size: 22, font: "SimSun", color: "888888" })]
}));
C.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: `2026年5月`, size: 22, font: "SimSun", color: "888888" })] }));
C.push(pb());

// TOC
C.push(hd(`目  录`, 1));
C.push(new Paragraph({ children: [new TableOfContents(`目录`, { hyperlink: true, headingStyleRange: "1-3" })] }));
C.push(pb());

// Part 1: Overview
C.push(hd(`第一部分  全景总览：从单机到集群的完整链路`, 1));

C.push(hd(`1.1 单机控制四层架构`, 2));
C.push(bp(`一台无人压路机要自己完成工作，需要依次经过四个环节。可以类比为一个盲人在走路：`));
C.push(sp());

C.push(tbl(
  [`层级`, `核心问题`, `技术方案`, `输入`, `输出`],
  [
    [`感知与定位`, `我在哪？周围有什么？`, `北斗RTK+毫米波雷达+IMU+激光雷达`, `传感器原始信号`, `融合后的位姿+环境模型`],
    [`路径规划`, `我要怎么走？`, `覆盖路径规划+贝塞尔曲线平滑`, `工区地图+当前位姿`, `目标轨迹点序列`],
    [`运动控制`, `方向盘打多少？油门踩多大？`, `Pure Pursuit / PID / MPC`, `目标轨迹vs实际位姿偏差`, `转向角+速度指令`],
    [`执行器`, `真正动手`, `液压机械臂 / 电磁阀`, `转向角+速度指令`, `车辆真实运动`]
  ],
  [1600, 2200, 2400, 1600, 2000]
));
C.push(sp());

C.push(hd(`1.2 完整数据流`, 2));
C.push(bp(`北斗/雷达/IMU → 卡尔曼滤波融合 → 位置+姿态估计 → 覆盖路径规划 → 目标轨迹点序列 → PID/MPC 控制器 → 转向角+油门/制动指令 → 液压电磁阀/机械臂 → 车辆真正动作 → 传感器再采集新位置 → 闭环`, { code: true }));

C.push(hd(`1.3 集群新增的三层`, 2));
C.push(bp(`集群 = 单机四层 × N + 三层协作能力。单机能自己走了，集群只需要在单机之上加三层：`));
C.push(sp());

C.push(tbl(
  [`层级`, `核心问题`, `技术方案`],
  [
    [`任务调度层`, `谁碾第1道？谁碾第2道？`, `任务分配算法`],
    [`编队控制层`, `队形保持：间距对了没？`, `Leader-Follower / 一致性协议 / 人工势场 / 分布式MPC`],
    [`通信交互层`, `两台机器交换数据`, `ZigBee / V2X / WiFi / LoRa`]
  ],
  [2000, 3400, 4000]
));
C.push(sp());

C.push(bp(`集群完整数据流：`));
C.push(bp(`机器A感知位置 → 发给机器B；机器B感知位置 → 发给机器A → 编队控制器对比AB相对位置vs期望队形 → 算出各自需调整的速度/方向 → 各自单机控制器 → 执行器`, { code: true }));

C.push(hd(`1.4 技术栈索引`, 2));
C.push(tbl(
  [`技术`, `层级`, `解决的问题`, `重要程度`],
  [
    [`北斗 RTK`, `感知`, `厘米级定位`, `了解即可`],
    [`毫米波雷达 / 激光雷达`, `感知`, `障碍物检测`, `了解即可`],
    [`IMU 惯性导航`, `感知`, `车身姿态`, `了解即可`],
    [`卡尔曼滤波`, `感知`, `多传感器融合`, `了解原理`],
    [`运动学/动力学建模`, `控制`, `被控对象数学模型`, `★★★ 强相关`],
    [`PID 控制`, `控制`, `速度+转向跟踪`, `★★★ 必须掌握`],
    [`Pure Pursuit / Stanley`, `控制`, `几何路径跟踪`, `★★★ 必须掌握`],
    [`MPC 模型预测控制`, `控制`, `带约束的高精度控制`, `★★ 进阶掌握`],
    [`液压机械臂 / 电磁阀`, `执行`, `电信号→机械动作`, `★★★ 主战场`],
    [`V2V 通信`, `集群-通信`, `机间数据交换`, `了解延迟/可靠性`],
    [`Leader-Follower`, `集群-编队`, `主从间距保持`, `★★★ 集群入门`],
    [`一致性协议`, `集群-编队`, `分布式协同`, `★★ 集群进阶`],
    [`人工势场法`, `集群-编队`, `编队+避障`, `了解即可`],
    [`强化学习`, `集群-编队`, `自学习策略`, `了解即可`]
  ],
  [2400, 1400, 2800, 2000]
));
C.push(sp());
C.push(pb());

// Part 2: Single-machine control
C.push(hd(`第二部分  单机控制实现`, 1));

C.push(hd(`2.1 运动学与动力学建模`, 2));
C.push(bp(`压路机一般是铰接式结构（前车体+后车体通过铰接点连接），跟乘用车的阿克曼转向不一样——铰接式转向靠液压油缸推动前后车体相对偏转。铰接角是压路机运动学的核心状态量。`));
C.push(bp(`在软基路面上作业时，还需要额外考虑滑移和沉降——这是轮式车辆模型没有的问题。`));
C.push(sp());

C.push(hd(`关键参考资料`, 3));
C.push(tbl(
  [`资料`, `出处`, `年份`, `要点`],
  [
    [`铰接式无人压路机运动学建模与验证试验`, `《机械工程师》`, `2025`, `多体运动学方程，实车验证，位置误差 ≤ ±0.12m`],
    [`无人驾驶单钢轮碾压机最优换道路径规划`, `《现代制造工程》`, `2024`, `五阶贝塞尔曲线 + LSO优化，横向误差-3.8%`],
    [`离散元-多体动力学耦合路径跟踪 (专利)`, `同济大学`, `2025`, `DEM-MBD耦合 + MPC，适应非结构化路面`]
  ],
  [3200, 1600, 800, 3800]
));
C.push(sp());

C.push(hd(`2.2 线控化改造方案`, 2));
C.push(bp(`核心问题：压路机没有原生线控系统，必须后装改造才能接收控制器的电子指令。当前有两条技术路线：`));
C.push(sp());

C.push(hd(`路线一：外挂式机械臂（驾驶机器人）`, 3));
C.push(bp(`在方向盘、油门/制动踏板、挡位上安装液压机械臂，由辅助控制器（STM32/ECU）驱动机械臂模拟人类驾驶员操作。代表厂商：踏歌智行（与徐工合作）。`));
C.push(tbl(
  [`组件`, `功能`],
  [
    [`转向液压机械臂`, `伸张/收缩控制方向盘转角`],
    [`挡位液压机械臂`, `控制前进/后退/驻车`],
    [`控制电门`, `并联振动开关，控制振动压实`]
  ],
  [3000, 6400]
));
C.push(sp());
C.push(tp(`优点：不改原车液压系统，安装快，适合存量设备改造。`));
C.push(nt(`缺点：机械臂有延迟和磨损，精度受限。`));

C.push(hd(`路线二：直接控制液压油路（内嵌式）`, 3));
C.push(bp(`通过电脑模块 + 输入模块（GPS/毫米波雷达/红外/图像）+ 输出模块（行走/制动/转向/振动的液压油缸和电磁阀），直接控制液压油路。参考专利：CN208183487U。`));
C.push(tp(`优点：响应快、精度高。`));
C.push(nt(`缺点：需要改液压系统，适配不同车型工作量大。`));
C.push(bp(`趋势判断：当前行业处于传统液压 → 数字化液压控制过渡期。存量改造用路线一，新车型逐步走向路线二。`));

C.push(hd(`2.3 路径跟踪控制算法`, 2));
C.push(bp(`路径跟踪是单机控制的核心——把「当前位置与目标轨迹的偏差」翻译成「方向盘打多少、油门踩多少」。是控制层最关键的技术环节。`));
C.push(sp());

C.push(hd(`方案对比`, 3));
C.push(tbl(
  [`方案`, `原理`, `优点`, `缺点`, `适用场景`],
  [
    [`Pure Pursuit + PID`, `几何法：根据前视距离算转向角；PID调节速度`, `实现简单，工程最常用`, `大曲率路径精度低`, `入门首选，低速施工场景`],
    [`Stanley 控制器`, `基于前轴中心到路径的横向误差+航向误差`, `比PP更精确，鲁棒性好`, `需要调两个增益参数`, `农业/工程机械常用`],
    [`MPC 模型预测控制`, `用车辆模型预测未来N步轨迹，滚动优化`, `能处理约束，精度最高`, `计算量大，需要模型`, `高精度场景，进阶方向`],
    [`NMPC + 滑模控制`, `非线性MPC上层+滑模下层，级联架构`, `低附着工况仍稳定`, `设计复杂`, `恶劣工况（泥泞、坡道）`]
  ],
  [1800, 2200, 2000, 2000, 1400]
));
C.push(sp());

C.push(hd(`核心论文`, 3));
C.push(tbl(
  [`论文`, `方法`, `要点`],
  [
    [`Qiang et al., Electronics 2025`, `NMPC + 二阶滑模 + ST-UKF`, `实时估计地面附着系数，低附着工况稳态误差降20.62%`],
    [`Xu et al., Symmetry 2025`, `NMPC + ADRC防侧翻`, `引入侧翻能量壁垒(REB)概念`],
    [`Ma, Nonlinear Engineering 2025`, `MPC + U-K动力学`, `压路机-压实材料耦合建模，碾压速度0.3m/s`],
    [`Wu et al., CACAIE 2024`, `PID + 贝塞尔轨迹`, `实车验证，平均误差 <15cm`]
  ],
  [2400, 2400, 4600]
));
C.push(sp());
C.push(tp(`入门建议：先从 Pure Pursuit + PID 搞起（简单、工程常用），再进阶到 MPC（考虑约束、更精确）。`));

C.push(hd(`2.4 高精度定位`, 2));
C.push(bp(`定位是单机自动化的前提——连自己在哪都不知道，路径规划和控制就无从谈起。压路机施工场景要求厘米级定位。`));
C.push(sp());
C.push(tbl(
  [`供应商`, `产品/方案`, `精度`],
  [
    [`华测导航`, `RollNav TC63 智能压实系统`, `厘米级`],
    [`中海达`, `北斗压路机智能压实系统`, `1.5cm`],
    [`司南导航`, `M300 GNSS 接收机`, `1.5cm`],
    [`徐工`, `北斗 + 惯性导航 + 毫米波雷达融合`, `厘米级`]
  ],
  [2400, 4000, 2000]
));
C.push(sp());
C.push(bp(`系统组成：基准站（GNSS接收机+电台）→ 移动端（车载终端+压实传感器+IMU）`, { ni: true }));
C.push(pb());

// Part 3: Dual-machine cooperation
C.push(hd(`第三部分  双机协同实现`, 1));
C.push(bp(`在单机能自主行驶的基础上，两台压路机协同需要解决三个问题：怎么通信（交换数据）、保持什么队形（并排还是前后）、用什么算法保持队形（编队控制）。`));

C.push(hd(`3.1 通信架构`, 2));
C.push(bp(`两台压路机需要实时交换各自的位置、速度、状态信息。这是编队控制的前提——不知道对方在哪，就没法保持队形。`));
C.push(sp());
C.push(tbl(
  [`通信方式`, `特点`, `适用场景`],
  [
    [`ZigBee`, `低成本、低功耗、短距离(~100m)`, `原型验证、小范围施工`],
    [`LTE-V2X / NR-V2X`, `低延迟(ms级)、远距离、高可靠`, `工程化应用`],
    [`WiFi / 4G/5G`, `通用性强，延迟取决于网络`, `云端调度 + 本地直连备份`],
    [`LoRa`, `超远距离(km级)、低速率`, `广域监控、状态上报`]
  ],
  [2400, 4000, 3000]
));
C.push(sp());
C.push(bp(`实际工程中，三一、徐工采用「本地通信链路 + 云平台」双层架构——本地 V2V 做实时协同（毫秒级），云端做全局调度和状态监控。`));

C.push(hd(`3.2 编队策略`, 2));
C.push(bp(`两台压路机最常见的四种配合模式：`));
C.push(sp());
C.push(tbl(
  [`模式`, `描述`, `控制要点`],
  [
    [`并排碾压`, `两机并排、保持固定间距，同时碾压相邻车道`, `横向间距保持（重叠量~0.2m）+ 纵向速度同步`],
    [`Leader-Follower`, `领航机走预定轨迹，跟随机保持固定距离跟在后面`, `纵向距离保持 + 轨迹跟踪`],
    [`先后入场`, `第一台开始碾压→第二台延时入场→交替作业`, `入场时机 + 碰撞避免`],
    [`编队碾压`, `多机成编队同时碾压`, `全局路径规划 + 编队保持`]
  ],
  [1800, 3800, 3800]
));
C.push(sp());
C.push(bp(`两机场景最常用：并排碾压（侧向间距保持）和 Leader-Follower（纵向间距保持）。建议先搞懂这两种基本模式。`));

C.push(hd(`3.3 协同控制算法`, 2));
C.push(bp(`协同控制算法是双机编队的核心——它根据通信收到的对方状态，实时计算自己该怎么调整。`));
C.push(sp());

C.push(hd(`六种主流方法`, 3));
C.push(tbl(
  [`方法`, `工作原理`, `优点`, `缺点`],
  [
    [`Leader-Follower + PID`, `领航者发位置/速度 → 跟随者PID调节间距`, `最简单，工程最常用`, `领航者故障则全崩`],
    [`Leader-Follower + MPC`, `同上但控制律换MPC，能预测未来几步`, `精度高，能处理约束`, `计算量大`],
    [`人工势场法 (APF)`, `目标给引力、障碍物给斥力`, `天然避障`, `局部极小值问题`],
    [`虚拟结构法`, `定义虚拟刚体，各车跟踪刚体上的固定点`, `无单点故障`, `需要全局信息`],
    [`一致性协议`, `各车只跟邻居通信，所有车收敛到共同状态`, `分布式，可扩展`, `收敛速度取决于拓扑`],
    [`强化学习 (RL)`, `神经网络在线学习最优编队策略`, `适应复杂环境`, `训练成本高，可解释性差`]
  ],
  [1800, 2800, 2400, 2400]
));
C.push(sp());

C.push(hd(`入门推荐路线`, 3));
C.push(bp(`Leader-Follower + PID（2-3天跑通仿真）→ Leader-Follower + MPC（加入运动学约束）→ 人工势场法或虚拟结构（扩展到多机）`, { ni: true }));
C.push(sp());

C.push(hd(`核心参考论文`, 3));
C.push(tbl(
  [`论文`, `期刊`, `年份`, `核心内容`],
  [
    [`A cooperative methodology for multi-roller automation in pavement construction`, `CACAIE (IF 8.5)`, `2024`, `【必读】同济大学，实车改造 + PID + 贝塞尔 + MFBT策略，4台场地验证，误差<15cm`],
    [`RL-based optimal formation control of multiple robotic rollers`, `Robotics and Autonomous Systems`, `2025`, `强化学习+虚拟结构法，3台坝面仿真`],
    [`Co-operative control of double drum vibratory roller formation`, `中国工程机械学报`, `2025`, `人工势场+微分齐次变换，双钢轮MATLAB仿真`],
    [`Research on path-tracking control of unmanned rollers`, `Nonlinear Engineering`, `2025`, `U-K动力学+MPC+pilot-following，三台仿真`]
  ],
  [3800, 2000, 800, 2800]
));
C.push(sp());
C.push(pb());

// Part 4: Industry cases
C.push(hd(`第四部分  行业案例`, 1));

C.push(hd(`4.1 三一重工`, 2));
C.push(bp(`徐淮阜高速宿州段（2024启动，持续200+天，总里程200+km），最多15台设备协同施工。`));
C.push(tbl(
  [`维度`, `内容`],
  [
    [`机群构成`, `1台摊铺机 + 3台双钢轮 + 4台胶轮`],
    [`关键技术`, `融合感知定位 + 高精度路径跟踪 + 群控安全 + 全局协同调度`],
    [`特色`, `一键式施工：采集数据→自动建模→开启无人摊压`],
    [`成效`, `减少人员60%，日效率+20%，压实均匀性+10%`]
  ],
  [2000, 7400]
));
C.push(sp());

C.push(hd(`4.2 徐工机械`, 2));
C.push(bp(`智能化施工累计4000+km，车载气象站+路面温度扫描系统，2024上海宝马展演示双机协同自主贴边碾压。`));

C.push(hd(`4.3 其他案例`, 2));
C.push(tbl(
  [`项目`, `规模`, `效果`],
  [
    [`东兴高速（中交一公局）`, `摊铺+压路机群编队`, `跟踪精度3cm，贴边精度1cm`],
    [`东部高速养护`, `2台摊铺+6台压路机`, `效率+25%，油耗-15%`],
    [`贵平高速（徐工）`, `1人操作6台压路机`, `远程唤醒，全天候施工`],
    [`广西苍容高速`, `无人集群摊铺碾压`, `碾压精度2cm以内`]
  ],
  [2600, 2600, 4200]
));
C.push(sp());
C.push(pb());

// Part 5: Connection to major
C.push(hd(`第五部分  与线控底盘专业的结合`, 1));

C.push(hd(`5.1 线控底盘是执行层的核心`, 2));
C.push(bp(`在整个技术栈中，线控底盘处于执行层——不管上层协同算法多聪明，最后都得通过底盘执行器把动作做出来。`));
C.push(bp(`任务决策层 → 路径规划层 → 运动控制层 → 执行层（线控底盘）← 本专业主战场`, { code: true }));

C.push(hd(`5.2 具体结合方向`, 2));
C.push(tbl(
  [`方向`, `说明`],
  [
    [`底盘响应建模`, `转向延迟、制动建压时间——这些执行器特性直接影响编队稳定性`],
    [`执行器约束下的协同控制`, `MPC需要底盘提供准确的执行器饱和约束（最大转角、最大减速度）`],
    [`底盘级容错`, `执行器故障时，通过底盘冗余+上层协同重分配保证编队安全`],
    [`底盘动力学与通信拓扑耦合`, `铰接式车辆的纵横向耦合特性+V2V通信拓扑如何联合设计`],
    [`分布式底盘控制`, `多轴车辆各轮独立线控本身就是底盘级的协同控制问题`]
  ],
  [2800, 6600]
));
C.push(sp());

C.push(hd(`5.3 建议切入路径`, 2));
[
  `1. 先从单底盘精细控制入手：把转向、制动、驱动的跟踪精度做到极致`,
  `2. 补充多车通信基础：了解 V2V 通信协议（LTE-V2X/NR-V2X）的延迟与丢包特性`,
  `3. 搭建仿真验证环境：CarSim + Simulink 联合仿真单底盘 + 多车编队`,
  `4. 从小规模实车开始：两车编队先跑通，再逐步扩展到多车`
].forEach(t => C.push(bp(t)));

C.push(pb());

// Part 6: Quick-start guide
C.push(hd(`第六部分  快速上手指南`, 1));

C.push(hd(`6.1 建议学习路线`, 2));
C.push(sp());
C.push(tbl(
  [`步骤`, `内容`, `预计时间`],
  [
    [`第1步`, `B站「桂花米酒酿」一致性控制入门`, `2-3h`],
    [`第2步`, `读 Wu et al. 2024 CACAIE 论文（多压路机协同，有实车验证）`, `半天`],
    [`第3步`, `用 MATLAB/Simulink 跑 Leader-Follower + PID 双车编队仿真`, `1-2天`],
    [`第4步`, `搜「三一 京哈高速 压路机 机群」看行业案例技术细节`, `半天`],
    [`第5步`, `升级到 MPC 编队控制（参考 Qiang et al. 2025 NMPC 论文）`, `1-2天`],
    [`第6步`, `整理 PPT，按「背景→单机基础→双机协同→行业案例→总结」结构汇报`, `半天`]
  ],
  [1200, 6000, 1400]
));
C.push(sp());

C.push(hd(`6.2 仿真环境对比`, 2));
C.push(tbl(
  [`工具`, `用途`, `入门难度`],
  [
    [`MATLAB/Simulink + CarSim`, `车辆动力学 + 编队控制算法联仿`, `★★☆`],
    [`ROS2 + Gazebo Harmonic`, `多机器人编队仿真（ROS领域）`, `★★★`],
    [`Prescan + Simulink`, `自动驾驶场景仿真`, `★★★`]
  ],
  [3000, 3800, 1600]
));
C.push(sp());

C.push(hd(`6.3 论文阅读优先级`, 2));
C.push(bp(`面对大量论文，建议按以下优先级阅读：`));
C.push(sp());
C.push(tbl(
  [`优先级`, `论文`, `理由`],
  [
    [`★★★ 必读`, `Wu et al. 2024 CACAIE`, `唯一有实车验证的多压路机协同论文，最接近工程实际`],
    [`★★★ 必读`, `Qiang et al. 2025 Electronics`, `单机路径跟踪的完整方案（NMPC+滑模+附着估计），理解控制链路`],
    [`★★☆ 推荐`, `Ma 2025 Nonlinear Engineering`, `MPC + pilot-following，三台仿真，理解编队控制`],
    [`★★☆ 推荐`, `Wei et al. 2025 RAS`, `强化学习+虚拟结构，了解前沿方向`],
    [`★☆☆ 选读`, `Guo et al. 2025 中国工程机械学报`, `人工势场法，了解替代方案`]
  ],
  [1400, 3600, 4400]
));
C.push(sp());
C.push(pb());

// Appendix
C.push(hd(`附录  B站/MOOC学习资源速查`, 1));
C.push(tbl(
  [`UP主/课程`, `内容`, `难度`, `推荐指数`],
  [
    [`桂花米酒酿`, `图论 + 一致性理论`, `入门`, `★★★★★`],
    [`辣酱超人`, `论文讲解 + 编队控制`, `进阶`, `★★★★★`],
    [`Joymoss`, `编队 + 避障实战`, `进阶`, `★★★★`],
    [`uuid975`, `MATLAB 仿真`, `实战`, `★★★★`],
    [`AjenZzz`, `6分钟快速入门一致性`, `速览`, `★★★`],
    [`多智能体系统分布式编队控制`, `30+专题，14万播放`, `入门-进阶`, `★★★★★`]
  ],
  [2800, 3400, 1200, 1200]
));
C.push(sp());

// BUILD
const doc = new Document({
  styles: {
    default: { document: { run: { font: "SimSun", size: 24 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, color: "1F4E79", font: "Microsoft YaHei" },
        paragraph: { spacing: { before: 400, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 30, bold: true, color: "2E75B6", font: "Microsoft YaHei" },
        paragraph: { spacing: { before: 280, after: 160 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, color: "333333", font: "Microsoft YaHei" },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 2 } }
    ]
  },
  sections: [{
    properties: {
      page: { margin: { top: 1440, right: 1300, bottom: 1440, left: 1300 } }
    },
    headers: {
      default: new Header({ children: [new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [new TextRun({ text: `压路机单机控制与双机协同 — 实现方案与技术汇总`, size: 16, font: "Microsoft YaHei", color: "999999", italics: true })]
      })] })
    },
    footers: {
      default: new Footer({ children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: `第 `, size: 16, font: "SimSun" }), new TextRun({ children: [PageNumber.CURRENT], size: 16 }), new TextRun({ text: ` 页`, size: 16, font: "SimSun" })]
      })] })
    },
    children: C
  }]
});

Packer.toBuffer(doc).then(buf => {
  const outPath = `D:/桌面/Ob_Learning/集群控制/压路机单机与双机协同实现方案汇总.docx`;
  fs.writeFileSync(outPath, buf);
  console.log(`Done: ${outPath} (${(buf.length / 1024).toFixed(1)} KB)`);
});
