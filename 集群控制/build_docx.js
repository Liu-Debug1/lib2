const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType,
  LevelFormat, Header, Footer, PageNumber, PageBreak
} = require("docx");

// ── styles ──
const tableBorder = { style: BorderStyle.SINGLE, size: 1, color: "AAAAAA" };
const cellBorders = { top: tableBorder, bottom: tableBorder, left: tableBorder, right: tableBorder };
const headerShading = { fill: "1F4E79", type: ShadingType.CLEAR };
const altRowShading = { fill: "F2F7FB", type: ShadingType.CLEAR };
const noteShading = { fill: "FFF8E1", type: ShadingType.CLEAR };

function headerCell(text, width) {
  return new TableCell({
    borders: cellBorders, width: { size: width, type: WidthType.DXA }, shading: headerShading,
    verticalAlign: "center",
    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text, bold: true, color: "FFFFFF", size: 20, font: "Microsoft YaHei" })] })]
  });
}
function cell(text, width, opts = {}) {
  return new TableCell({
    borders: cellBorders, width: { size: width, type: WidthType.DXA },
    shading: opts.alt ? altRowShading : undefined,
    children: [new Paragraph({ children: [new TextRun({ text, size: 20, font: "SimSun", ...opts })] })]
  });
}

function bodyPara(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 120 }, indent: opts.noIndent ? undefined : { firstLine: 480 },
    children: [new TextRun({ text, size: 24, font: "SimSun", ...opts })]
  });
}
function heading(text, level) {
  return new Paragraph({
    heading: level,
    spacing: { before: level === HeadingLevel.HEADING_1 ? 400 : 280, after: 200 },
    children: [new TextRun({ text, size: level === HeadingLevel.HEADING_1 ? 36 : level === HeadingLevel.HEADING_2 ? 30 : 26, bold: true, font: "Microsoft YaHei" })]
  });
}
function note(text) {
  return new Paragraph({
    spacing: { before: 120, after: 120 }, indent: { left: 360 },
    border: { left: { style: BorderStyle.SINGLE, size: 6, color: "E6A817" } },
    shading: noteShading,
    children: [new TextRun({ text, size: 20, font: "SimSun", italics: true })]
  });
}
function code(text) {
  return new Paragraph({
    spacing: { before: 80, after: 80 }, indent: { left: 360 },
    shading: { fill: "F5F5F5", type: ShadingType.CLEAR },
    children: [new TextRun({ text, size: 18, font: "Consolas" })]
  });
}

function makeTable(headers, rows, colWidths) {
  return new Table({
    columnWidths: colWidths,
    rows: [
      new TableRow({ tableHeader: true, children: headers.map((h, i) => headerCell(h, colWidths[i])) }),
      ...rows.map((row, ri) => new TableRow({
        children: row.map((c, ci) => cell(c, colWidths[ci], { alt: ri % 2 === 1 }))
      }))
    ]
  });
}

// ═══ CONTENT ═══
const children = [];

// Title page
children.push(new Paragraph({ spacing: { before: 3000 }, children: [] }));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER, spacing: { after: 200 },
  children: [new TextRun({ text: "集群协同控制调研报告", size: 52, bold: true, font: "Microsoft YaHei", color: "1F4E79" })]
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER, spacing: { after: 600 },
  children: [new TextRun({ text: "—— 背景、方法、应用及与线控底盘方向的结合点", size: 28, font: "Microsoft YaHei", color: "555555" })]
}));
children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 120 }, children: [new TextRun({ text: "2026年5月", size: 24, font: "SimSun", color: "888888" })] }));

// page break
children.push(new Paragraph({ children: [new PageBreak()] }));

// ── 一、什么是集群协同控制 ──
children.push(heading("一、什么是集群协同控制", HeadingLevel.HEADING_1));
children.push(heading("1.1 核心定义", HeadingLevel.HEADING_2));
children.push(bodyPara("集群协同控制（Swarm / Cluster Cooperative Control）是指：多个智能体（Agent）之间通过局部有限邻居信息交互，以分布式方式完成复杂的协同行为，实现 1+1 > 2 的整体任务效能提升。"));
children.push(bodyPara("「协同」被定义为“集群系统执行任务和智能涌现的保障与途径”。"));

children.push(heading("1.2 集群系统建模三要素（北航，2025）", HeadingLevel.HEADING_2));
children.push(makeTable(
  ["要素", "描述"],
  [["智能体 (Agent)", "构成集群的基本单元，如无人机、无人车、无人艇、压路机、拖拉机等"],
   ["交互方式 (Interaction)", "智能体间的信息传输拓扑关系（谁跟谁通信、怎么组网）"],
   ["行为规则 (Behavior Rules)", "智能体收到交互信息后的反应规律（协同控制律的生成规则）"]],
  [2500, 6860]
));
children.push(new Paragraph({ spacing: { after: 120 }, children: [] }));

children.push(heading("1.3 智能涌现的四个特征", HeadingLevel.HEADING_2));
children.push(bodyPara("1. 自主性 —— 不依赖中心节点/服务器，自主完成任务"));
children.push(bodyPara("2. 协同性 —— 通过局部交互协调合作"));
children.push(bodyPara("3. 扩展性 —— 智能体增减时弹性自适应（大规模可拓展）"));
children.push(bodyPara("4. 涌现性 —— 宏观行为实现单个智能体能力的非线性增强（1+1>2）"));

// ── 二、控制架构 ──
children.push(heading("二、控制架构", HeadingLevel.HEADING_1));
children.push(heading("2.1 三大经典架构", HeadingLevel.HEADING_2));
children.push(makeTable(
  ["架构", "原理", "优点", "缺点", "适用场景"],
  [
    ["集中式", "中央控制器收集全局信息，统一优化下发指令", "全局最优性好", "单点故障风险，计算通信压力大", "结构固定、任务明确（如车间AGV）"],
    ["分布式", "各智能体基于自身传感器 + 邻居通信自主决策", "鲁棒性强、可扩展", "设计复杂，难保全局最优", "动态不确定环境（无人机集群、农机编队）"],
    ["混合式", "上层协调器做宏观调度，下层保持自主协同", "兼具两者优点", "设计复杂度中等", "当前工业应用最实用的方案"]
  ],
  [1200, 2000, 1500, 2000, 2660]
));
children.push(new Paragraph({ spacing: { after: 120 }, children: [] }));

children.push(heading("2.2 前沿架构：IOODA 体系（北航 2025 封面论文）", HeadingLevel.HEADING_2));
children.push(bodyPara("在传统 OODA（观察-判断-决策-执行）基础上加入交互 (Interaction) 要素："));
children.push(makeTable(
  ["层次", "功能", "类比"],
  [["自组织交互 (I)", "智能体间信息交互与智能协商", "人的“神经系统”"],
   ["协同感知 (O)", "环境感知、目标跟踪、相对导航定位", "人的“眼睛”"],
   ["协同认知 (O)", "态势判断与预测、全局认知", "人的“认知大脑”"],
   ["协同决策规划 (D)", "任务分解、分配、轨迹规划", "人的“决策大脑”"],
   ["协同制导控制 (A)", "宏观运动控制与执行", "人的“小脑”和“肌肉”"]],
  [2400, 4400, 2560]
));
children.push(new Paragraph({ spacing: { after: 120 }, children: [] }));

// ── 三、实现方法与关键技术 ──
children.push(heading("三、实现方法与关键技术", HeadingLevel.HEADING_1));
children.push(heading("3.1 五大核心算法方向", HeadingLevel.HEADING_2));
children.push(makeTable(
  ["方向", "方法", "核心思想"],
  [
    ["一致性算法", "Leader-Follower 一致性、无领导者一致性、二分一致性、固定/有限时间一致性", "所有智能体收敛到共同状态"],
    ["编队控制", "领航-跟随法、虚拟结构法、行为法、人工势场法、仿射编队", "维持预定义的几何队形"],
    ["分布式优化", "分布式 MPC、分布式梯度下降、凸优化", "仅用局部信息实现全局最优目标"],
    ["AI/学习类", "深度强化学习 (DRL)、RBF 神经网络、迭代学习控制", "数据驱动，适应复杂非线性环境"],
    ["事件触发控制", "仅在必要时通信/更新控制量", "降低通信和计算负担"]
  ],
  [2000, 3860, 3500]
));
children.push(new Paragraph({ spacing: { after: 120 }, children: [] }));

children.push(heading("3.2 关键支撑技术", HeadingLevel.HEADING_2));
["通信组网：V2V / V2X 通信、IEEE 1588 精确时钟同步、TSN 时间敏感网络",
 "高精度定位：北斗 RTK（厘米级）、UWB（卫星不可用场景）",
 "协同感知：多传感器融合（激光雷达 + 视觉 + 毫米波）、红外热成像",
 "避障与安全：人工势场法、MPC 约束避障、SOTIF 预期功能安全",
 "容错机制：通信中断下的优雅退化、动态拓扑重配置"].forEach(t => children.push(bodyPara("• " + t)));

children.push(heading("3.3 控制尺度（Automatica, 2025）", HeadingLevel.HEADING_2));
children.push(makeTable(
  ["尺度", "控制方式"],
  [["宏观", "所有节点接收相同全局控制输入"], ["微观", "每个节点独立控制"], ["中观", "基于聚类聚合特征的 MPC 控制——降低计算量、保持精度"]],
  [2000, 7360]
));
children.push(new Paragraph({ spacing: { after: 120 }, children: [] }));

// ── 四、典型应用场景 ──
children.push(heading("四、典型应用场景", HeadingLevel.HEADING_1));
children.push(heading("4.1 工程机械：无人摊铺碾压机群", HeadingLevel.HEADING_2));
children.push(bodyPara("模式：“自然人统筹 → 数字人研判 → 无人机执行” 三层协同"));
children.push(makeTable(
  ["项目", "规模", "效果"],
  [["徐淮阜高速（三一）", "15台设备协同", "减少人员60%，日效率+20%"],
   ["东兴高速（中交一公局）", "摊铺+压路机群编队", "跟踪精度 3cm，贴边精度 1cm"],
   ["东部高速养护", "2台摊铺+6台压路机", "效率+25%，油耗-15%"],
   ["贵平高速（徐工）", "1人操作6台压路机", "远程唤醒，全天候施工"]],
  [2600, 2600, 4160]
));
children.push(new Paragraph({ spacing: { after: 120 }, children: [] }));
children.push(bodyPara("技术栈：北斗 RTK + 车载通信链路 + 多传感器避障 + 云平台数据闭环"));

children.push(heading("4.2 无人机集群", HeadingLevel.HEADING_2));
["编队控制：领航-跟随、虚拟结构、行为法、一致性法",
 "协同避障：人工势场 + MPC",
 "任务分配：拍卖算法、一致性协商、强化学习"].forEach(t => children.push(bodyPara("• " + t)));
children.push(bodyPara("2024 年研究热点：异构集群协同、AI 赋能、复杂对抗环境联合作战"));

children.push(heading("4.3 农机：多机协同作业", HeadingLevel.HEADING_2));
children.push(makeTable(
  ["方向", "方法", "效果"],
  [["路径规划", "启发式覆盖规划、自适应精英差分进化 (AEDE)", "转弯时间 -3.85%，作业时间 -1.46%"],
   ["协同控制", "Pure Pursuit + Stanley + PID 编队保持", "作业时间 -17.47s，效率 +15.29%"],
   ["延时补偿", "MPC 延时补偿器", "提高通信延迟下的编队跟踪精度"],
   ["协同转向", "虚拟车道 + 改进 NMPC", "适合非结构化农田环境"]],
  [1800, 4000, 3560]
));
children.push(new Paragraph({ spacing: { after: 120 }, children: [] }));

// ── 五、作用与优势 ──
children.push(heading("五、集群协同控制的作用与优势", HeadingLevel.HEADING_1));
children.push(makeTable(
  ["维度", "效果"],
  [["效率倍增", "多机并行执行，效率提升 15%~27%"],
   ["精度提升", "毫米/厘米级协同定位，杜绝漏/过/欠作业"],
   ["人工缩减", "减少操作人员 40%~60%，一人操控多台"],
   ["鲁棒性强", "单点故障不影响全局，分布式架构天然容错"],
   ["全天候作业", "支持 24h 连续作业，不受疲劳/光照限制"],
   ["成本下降", "能耗降低 ~15%，全生命周期成本降低"],
   ["质量可追溯", "全过程数据闭环，云端可复盘"]],
  [2400, 6960]
));
children.push(new Paragraph({ spacing: { after: 120 }, children: [] }));

// ── 六、与本专业结合点 ──
children.push(heading("六、与本专业（线控底盘）的结合点讨论", HeadingLevel.HEADING_1));
children.push(heading("6.1 线控底盘在集群中的角色", HeadingLevel.HEADING_2));
children.push(bodyPara("线控底盘是集群系统中执行层的核心。上层协同算法算出“该怎么做”（编队轨迹、速度指令），底盘执行层负责“能不能做到”（转向精度、制动响应、加速度跟踪）。"));
children.push(code("任务决策层 → 路径规划层 → 运动控制层 → 执行层（线控底盘）"));
children.push(note("↑ 本专业主战场"));

children.push(heading("6.2 具体结合方向", HeadingLevel.HEADING_2));
children.push(makeTable(
  ["方向", "说明"],
  [["底盘响应建模", "转向延迟、制动建压时间、加速响应——这些执行器特性影响编队稳定性和一致性协议设计"],
   ["执行器约束下的协同控制", "MPC 协同控制器需要底盘提供准确的执行器饱和约束（最大转角、最大减速度）"],
   ["底盘级容错", "执行器故障时，如何通过底盘冗余 + 上层协同重分配保证编队安全"],
   ["底盘动力学与信息拓扑耦合", "车辆底盘的纵横向耦合特性 + V2V 通信拓扑如何联合设计协同控制器"],
   ["分布式底盘控制", "多轴车辆各轮独立线控（独立转向/独立制动）本身就是底盘级的“协同控制问题”"]],
  [3000, 6360]
));
children.push(new Paragraph({ spacing: { after: 120 }, children: [] }));

children.push(heading("6.3 为什么线控底盘是集群协同的关键使能技术", HeadingLevel.HEADING_2));
children.push(bodyPara("传统机械底盘：转向/制动/油门靠人操作，响应慢、精度低，无法接收上层协同算法的精细指令。"));
children.push(bodyPara("线控底盘：电信号替代机械传动，响应快（ms 级）、精度高、接口数字化——这是集群协同算法能落地的物理基础。"));

children.push(heading("6.4 建议的切入路径", HeadingLevel.HEADING_2));
["1. 先从单底盘精细控制入手：把转向、制动、驱动的跟踪精度做到极致",
 "2. 补充多车通信基础：了解 V2V 通信协议（LTE-V2X / NR-V2X）的延迟与丢包特性",
 "3. 搭建仿真验证环境：Prescan/CarSim + Simulink/ROS2 联合仿真单底盘 + 多车编队",
 "4. 从小规模实车开始：两车编队先跑通，再逐步扩展到多车"].forEach(t => children.push(bodyPara(t)));

// ── 参考文献 ──
children.push(heading("参考文献来源", HeadingLevel.HEADING_1));
[
  "董希旺, 于江龙等 (2025). 集群系统智能协同IOODA技术体系架构与关键技术. 航空学报, 2025(4).",
  "张鹏飞等 (2024). 无人机集群协同控制技术综述. 兵器装备工程学报, 45(4).",
  "任鸿儒等 (2024). 无人自主系统分布式协同控制研究综述. 广东工业大学学报, 41(4).",
  "Coraggio, M. et al. (2025). Controlling Complex Systems. Springer.",
  "Erofeeva, V. et al. (2025). Meso-scale coalitional control in large-scale networks. Automatica, 177.",
  "马倩, 徐胜元 (2024). 多智能体系统分布式协调控制理论与方法. 科学出版社."
].forEach(t => children.push(bodyPara("[" + (children.length + 1) + "] " + t, { noIndent: true })));

// ═══ BUILD ═══
const doc = new Document({
  styles: {
    default: { document: { run: { font: "SimSun", size: 24 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, color: "1F4E79", font: "Microsoft YaHei" },
        paragraph: { spacing: { before: 400, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 30, bold: true, color: "2E75B6", font: "Microsoft YaHei" },
        paragraph: { spacing: { before: 280, after: 180 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, color: "333333", font: "Microsoft YaHei" },
        paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 2 } }
    ]
  },
  sections: [{
    properties: {
      page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
    },
    headers: {
      default: new Header({ children: [new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [new TextRun({ text: "集群协同控制调研报告", size: 18, font: "Microsoft YaHei", color: "999999", italics: true })]
      })] })
    },
    footers: {
      default: new Footer({ children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "第 ", size: 18, font: "SimSun" }), new TextRun({ children: [PageNumber.CURRENT], size: 18 }), new TextRun({ text: " 页", size: 18, font: "SimSun" })]
      })] })
    },
    children
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("D:/桌面/Ob_Learning/集群控制/集群协同控制调研报告.docx", buf);
  console.log("Done: 集群协同控制调研报告.docx (" + (buf.length / 1024).toFixed(1) + " KB)");
});
