from PIL import Image, ImageDraw, ImageFont


WIDTH = 1800
HEIGHT = 1200
BG = "white"
BLACK = (20, 20, 20)
BLUE = (36, 99, 235)
RED = (210, 45, 45)
GRAY = (110, 110, 110)
LIGHT = (245, 247, 250)


def load_font(size: int, bold: bool = False):
    font_candidates = [
        "C:/Windows/Fonts/msyhbd.ttc" if bold else "C:/Windows/Fonts/msyh.ttc",
        "C:/Windows/Fonts/simhei.ttf",
        "C:/Windows/Fonts/arial.ttf",
    ]
    for path in font_candidates:
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            continue
    return ImageFont.load_default()


FONT_TITLE = load_font(34, bold=True)
FONT_SUB = load_font(24, bold=True)
FONT_TEXT = load_font(19)
FONT_NOTE = load_font(17)


img = Image.new("RGB", (WIDTH, HEIGHT), BG)
draw = ImageDraw.Draw(img)


def text(x, y, s, font=FONT_TEXT, fill=BLACK, anchor=None):
    draw.text((x, y), s, font=font, fill=fill, anchor=anchor)


def arrow(p1, p2, fill=BLUE, width=3, head=10):
    draw.line([p1, p2], fill=fill, width=width)
    x1, y1 = p1
    x2, y2 = p2
    dx = x2 - x1
    dy = y2 - y1
    length = (dx * dx + dy * dy) ** 0.5 or 1
    ux = dx / length
    uy = dy / length
    px = -uy
    py = ux
    hx = x2 - ux * head
    hy = y2 - uy * head
    draw.polygon(
        [
            (x2, y2),
            (hx + px * head * 0.45, hy + py * head * 0.45),
            (hx - px * head * 0.45, hy - py * head * 0.45),
        ],
        fill=fill,
    )


def double_arrow(p1, p2, fill=BLUE, width=3, head=10):
    arrow(p1, p2, fill=fill, width=width, head=head)
    arrow(p2, p1, fill=fill, width=width, head=head)


def dim_h(x1, x2, y, ext_y1, ext_y2, label):
    draw.line([(x1, ext_y1), (x1, y)], fill=BLUE, width=2)
    draw.line([(x2, ext_y2), (x2, y)], fill=BLUE, width=2)
    double_arrow((x1, y), (x2, y))
    text((x1 + x2) / 2, y - 18, label, fill=BLUE, anchor="mm")


def dim_v(x, y1, y2, ext_x1, ext_x2, label):
    draw.line([(ext_x1, y1), (x, y1)], fill=BLUE, width=2)
    draw.line([(ext_x2, y2), (x, y2)], fill=BLUE, width=2)
    double_arrow((x, y1), (x, y2))
    text(x + 18, (y1 + y2) / 2, label, fill=BLUE, anchor="lm")


def leader(start, mid, end, label):
    draw.line([start, mid, end], fill=RED, width=3)
    arrow(mid, end, fill=RED, width=3, head=9)
    text(start[0], start[1] - 10, label, fill=RED, anchor="ls")


def hole(center, r_outer=24, r_inner=10):
    cx, cy = center
    draw.ellipse((cx - r_outer, cy - r_outer, cx + r_outer, cy + r_outer), outline=BLACK, width=3)
    draw.ellipse((cx - r_inner, cy - r_inner, cx + r_inner, cy + r_inner), outline=BLACK, width=3)
    draw.line((cx - 36, cy, cx + 36, cy), fill=GRAY, width=1)
    draw.line((cx, cy - 36, cx, cy + 36), fill=GRAY, width=1)


def bezier(points, steps=40):
    out = []
    for i in range(steps + 1):
        t = i / steps
        a = (1 - t) ** 3
        b = 3 * (1 - t) ** 2 * t
        c = 3 * (1 - t) * t ** 2
        d = t ** 3
        x = a * points[0][0] + b * points[1][0] + c * points[2][0] + d * points[3][0]
        y = a * points[0][1] + b * points[1][1] + c * points[2][1] + d * points[3][1]
        out.append((x, y))
    return out


text(900, 40, "零件二维图表达草图（示意）", font=FONT_TITLE, anchor="mm")
text(900, 80, "目标：先把视图布局和尺寸表达逻辑定下来，再回 CAD 标真实尺寸", font=FONT_TEXT, fill=GRAY, anchor="mm")

# Front view panel
draw.rounded_rectangle((60, 120, 920, 690), radius=18, outline=(200, 205, 215), width=2, fill=LIGHT)
text(90, 145, "1. 主视图（建议用这一视图做主控）", font=FONT_SUB)

# Frame
left_col = [(180, 270), (240, 230), (290, 230), (290, 610), (220, 610), (180, 570)]
right_col = [(690, 230), (740, 230), (800, 270), (800, 570), (760, 610), (690, 610)]
draw.line(left_col + [left_col[0]], fill=BLACK, width=5)
draw.line(right_col + [right_col[0]], fill=BLACK, width=5)

top_outer = bezier([(290, 250), (410, 210), (560, 210), (690, 250)])
top_inner = bezier([(330, 290), (430, 270), (550, 270), (650, 290)])
bot_outer = bezier([(290, 520), (410, 560), (560, 560), (690, 520)])
bot_inner = bezier([(330, 480), (430, 500), (550, 500), (650, 480)])
draw.line(top_outer, fill=BLACK, width=5)
draw.line(top_inner, fill=BLACK, width=5)
draw.line(bot_outer, fill=BLACK, width=5)
draw.line(bot_inner, fill=BLACK, width=5)
draw.line([(290, 250), (330, 290)], fill=BLACK, width=5)
draw.line([(690, 250), (650, 290)], fill=BLACK, width=5)
draw.line([(290, 520), (330, 480)], fill=BLACK, width=5)
draw.line([(690, 520), (650, 480)], fill=BLACK, width=5)

hole((300, 245), 26, 9)
hole((680, 245), 26, 9)
hole((235, 365), 21, 8)
hole((745, 365), 21, 8)

draw.line([(490, 180), (490, 640)], fill=GRAY, width=1)
for y in range(180, 640, 14):
    draw.line([(486, y), (494, y + 7)], fill=GRAY, width=1)

dim_h(180, 800, 655, 610, 610, "L 总宽")
dim_v(130, 230, 610, 180, 180, "H 总高")
dim_h(300, 680, 205, 245, 245, "P1 孔中心距")
dim_v(840, 245, 365, 800, 800, "P2 孔高差")

leader((560, 165), (625, 185), (670, 220), "孔系尺寸优先：孔径、孔距、孔到基准面")
leader((350, 620), (390, 585), (430, 520), "下梁外轮廓只标关键圆弧/关键控制尺寸")
leader((585, 430), (640, 430), (680, 402), "右端台阶槽口做局部放大")
leader((150, 215), (180, 240), (225, 260), "左侧立柱外形只保留包络必要尺寸")
text(490, 675, "基准建议：A=底面，B=对称中心面，C=左上主孔轴线", font=FONT_NOTE, fill=GRAY, anchor="mm")

# Top view panel
draw.rounded_rectangle((970, 120, 1740, 690), radius=18, outline=(200, 205, 215), width=2, fill=LIGHT)
text(1000, 145, "2. 俯视图（表达前后深度、梁宽、端部厚度）", font=FONT_SUB)

outer = [
    (1080, 240), (1160, 210), (1270, 230), (1440, 230), (1540, 210), (1620, 240),
    (1590, 320), (1495, 350), (1460, 480), (1495, 560), (1590, 590), (1620, 660),
    (1540, 690), (1440, 670), (1270, 670), (1160, 690), (1080, 660), (1110, 590),
    (1205, 560), (1240, 480), (1205, 350), (1110, 320), (1080, 240)
]
draw.line(outer, fill=BLACK, width=5)
inner1 = bezier([(1200, 300), (1300, 345), (1410, 345), (1510, 300)])
inner2 = bezier([(1200, 600), (1300, 555), (1410, 555), (1510, 600)])
draw.line(inner1, fill=BLACK, width=5)
draw.line(inner2, fill=BLACK, width=5)
draw.line([(1200, 300), (1200, 600)], fill=BLACK, width=5)
draw.line([(1510, 300), (1510, 600)], fill=BLACK, width=5)
draw.rectangle((1100, 255, 1170, 645), outline=BLACK, width=4)
draw.rectangle((1530, 255, 1600, 645), outline=BLACK, width=4)

dim_h(1080, 1620, 725, 660, 660, "D 前后总深")
dim_v(1665, 255, 645, 1620, 1620, "L2 端部长度")
dim_h(1200, 1510, 275, 300, 300, "W 梁间净距")
leader((1355, 185), (1380, 220), (1435, 230), "上梁宽、下梁宽、壁厚 t 在俯视图表达")
leader((1030, 400), (1070, 400), (1100, 390), "端块厚度、装配包络从端面基准标")
leader((1460, 515), (1490, 520), (1515, 560), "曲线若非标准圆弧，不要碎尺寸硬标")

# Section panel
draw.rounded_rectangle((60, 735, 920, 1130), radius=18, outline=(200, 205, 215), width=2, fill=LIGHT)
text(90, 760, "3. A-A 剖视图（表达台阶、槽深、壁厚）", font=FONT_SUB)

section = [
    (180, 1020), (180, 900), (260, 900), (260, 840), (400, 840), (430, 790),
    (560, 790), (590, 840), (730, 840), (730, 900), (810, 900), (810, 1020),
    (700, 1020), (700, 945), (585, 945), (560, 980), (430, 980), (405, 945),
    (290, 945), (290, 1020), (180, 1020)
]
draw.polygon(section, outline=BLACK, fill=(252, 252, 252))
for x in range(190, 805, 18):
    draw.line([(x, 1010), (x + 38, 820)], fill=(150, 150, 150), width=1)

dim_v(135, 790, 1020, 180, 180, "H1")
dim_h(260, 730, 815, 840, 840, "S1 槽宽")
dim_v(845, 840, 900, 810, 810, "S2 槽深")
dim_v(620, 790, 840, 560, 560, "t 壁厚/耳厚")
leader((355, 1080), (385, 1035), (430, 980), "剖视图是解决“里面到底怎么标”的关键")
leader((600, 1080), (620, 1020), (700, 945), "所有台阶高度尽量在剖视里闭合表达")

# Detail panel
draw.rounded_rectangle((970, 735, 1740, 1130), radius=18, outline=(200, 205, 215), width=2, fill=LIGHT)
text(1000, 760, "4. 局部放大 B（孔座 + 卡槽）", font=FONT_SUB)

draw.ellipse((1120, 820, 1320, 1020), outline=BLACK, width=5)
draw.ellipse((1195, 895, 1245, 945), outline=BLACK, width=4)
draw.rectangle((1320, 875, 1485, 965), outline=BLACK, width=5)
draw.polygon([(1485, 875), (1560, 845), (1560, 995), (1485, 965)], outline=BLACK, fill=(252, 252, 252))
draw.polygon([(1090, 930), (1120, 930), (1120, 910), (1160, 895), (1160, 945), (1120, 965), (1120, 945), (1090, 945)],
             outline=BLACK, fill=(252, 252, 252))

dim_h(1120, 1320, 1060, 1020, 1020, "d1 外耳直径")
dim_h(1195, 1245, 840, 895, 895, "d2 孔径")
dim_h(1320, 1485, 1035, 965, 965, "b 槽长")
dim_v(1600, 875, 965, 1560, 1560, "h 槽高")
leader((1030, 820), (1070, 840), (1120, 870), "孔附近细节不要塞主视图里")
leader((1420, 820), (1450, 835), (1498, 875), "倒角、退刀槽、局部台阶集中到放大图")

# Notes block
draw.rounded_rectangle((1220, 1010, 1710, 1110), radius=12, outline=(220, 220, 220), width=2, fill=(255, 252, 246))
notes = [
    "标注顺序：孔系 -> 基准尺寸 -> 总体尺寸 -> 截面尺寸 -> 轮廓尺寸",
    "对称结构只标半边，并注明“关于中心面 B 对称”",
    "自由曲线尽量依托三维模型，不建议靠密集线性尺寸拼轮廓",
]
for i, line in enumerate(notes):
    text(1245, 1035 + i * 24, f"- {line}", font=FONT_NOTE, fill=(90, 70, 30))

text(900, 1160, "这张图的用途：给你一个二维工程图“怎么表达”的模板，不是成品零件图。", font=FONT_TEXT, fill=GRAY, anchor="mm")

img.save("D:/桌面/Ob_Learning/outputs/零件二维表达草图.png")
