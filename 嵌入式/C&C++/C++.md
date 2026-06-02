---
tags:
  - C++
  - C语言
  - 语法对比
  - 嵌入式
date: 2026-05-13
---

## 一、基础篇

### 1.1 声明空间与输入输出（cin / cout）

#### 1.1.1 声明命名空间

>[!tip] 标准C++主程序格式
```cpp
#include <iostream>   //包含了cpp基本的输入输出函数
using namespace std;  //标准命名空间
int main(void) {
}
```

**1.命名空间的作用**
- 增加*标识符*的使用率，减少命名产生的冲突
- 充当*容器*，作用于不同的作用域
- 只能写在*全局区域*

 **2.命名空间的创建与访问**
- `::` 称*作用域分辨符*
- 使用成员格式 `空间名 :: 成员`
- 通过 `using namespace 空间名` 则可以不用使用前缀，直接调用`成员`。若*多个空间*的成员名一致时，调用using namespace 则程序就会出现二义性
- *命名空间的嵌套*，那么引用时，则需要用两个`::` + `::` ，如`MM::DD::num = 30`
- `::` 可修饰全局变量，使得：即使函数内部有同名函数，也会使用同名的全局变量
```cpp
namespace MM {
    int num;
    void print() {
        printf("MM\n");
    }
    namespace DD{
	    int num
    }
}
namespace GG {
    int num;
    void print() {
        printf("GG\n");
    }
}
int gnum = 1;
int main(void) {
	int gnum = 0; 
   // 使用作用域分辨符 :: 访问特定命名空间的成员
    MM::num = 10;
    GG::num = 20;
    MM::print();   // 输出: MM
    GG::print();   // 输出: GG

    // 使用 using namespace 后可直接调用成员
    using namespace MM;
    print();       // 调用 MM::print()
    // num = 30;   // ❌ 二义性！MM 和 GG 都有 num，编译器报错
	cout << ::gnum << endl << gunm <<endl //结果为1 0
    return 0;
}
//如果没有声明的话
#include <iostream>

int main(void) {
    int n;
    std::cin >> n;
    std::cout << "hello " << ++n << std::endl;
    return 0;
}
```

#### 1.1.2 cout与cin

##### 基本输入输出

| C                 | C++               | 说明                          |
| :---------------- | :---------------- | :-------------------------- |
| `scanf("%d", &n)` | `cin >> n`        | 箭头向右，流入变量                   |
| `printf("hello")` | `cout << "hello"` | 箭头向左，流入输出流                  |
| `"\n"`            | `endl` 或 `"\n"`   | `endl` 会强制刷新缓冲区，嵌入式建议用 `\n` |
| 需要有占位符            | 不需要占位符            |                             |

> [!warning] 注意
> `cin`/`cout` 比 `scanf`/`printf` 慢。嵌入式/竞赛中大量 IO 时慎用。

##### cin 常用成员函数一览

| 函数 | 作用 | 读不读空白字符 |
|------|------|:---:|
| `cin >> var` | 格式化输入，遇空白（空格、Tab、换行）停止 | 跳过 |
| `cin.get()` | 读**一个字符**，包括空格和换行 | 读 |
| `cin.getline(buf, n)` | 读一行到 `char[]` 数组，遇换行停止 | 读空格，不读换行 |
| `std::getline(cin, str)` | 读一行到 `string`，遇换行停止 | 读空格，不读换行 |
| `cin.ignore(n, ch)` | 丢弃缓冲区里最多 n 个字符，直到遇到 `ch` | — |
| `cin.peek()` | 偷看下一个字符，但不从缓冲区取走 | — |
| `cin.clear()` | 清除错误标志（恢复 `cin` 到可用状态） | — |
| `cin.fail()` | 检查输入是否失败（类型不匹配等） | — |

##### 各函数详解

**`cin >>` —— 格式化输入（最常用）**

根据右边变量的类型自动解析，遇空白字符（空格、Tab、换行）停止：

```cpp
int n;       cin >> n;      // 输入 123 → n = 123
double d;    cin >> d;      // 输入 3.14 → d = 3.14
char c;      cin >> c;      // 输入 hello → c = 'h'（只读一个）
string s;    cin >> s;      // 输入 hello world → s = "hello"（空格截断）
```

> [!tip] 类比：`cin >>` 像一个自动识别的快递分拣员——看到整数就往整数仓库送，看到小数就往浮点仓库送。

**`cin.get()` —— 读一个字符（含空白）**

和 `cin >> char` 的最大区别：**不会跳过空格和换行**。

```cpp
char c = cin.get();  // 输入一个空格 → c = ' '（>> 会直接跳过空格）
```

**`getline` —— 读一整行（含空格）**

`cin >>` 遇到空格就停了，要读带空格的整行用 `getline`。有两种形式：

```cpp
// 形式 1：读到 char[] 数组（成员函数）
char buf[100];
cin.getline(buf, 100);

// 形式 2：读到 string（全局函数，推荐）
string line;
getline(cin, line);
```

**`cin.ignore()` —— 清缓冲区里的垃圾**

最常见的使用场景：混用 `>>` 和 `getline` 时，`>>` 会在缓冲区留一个换行符，导致后面的 `getline` 直接读到空行。

```cpp
int n;
cin >> n;                    // 输入 42 并按回车 → 缓冲区还剩 '\n'
cin.ignore(100, '\n');       // 扔掉那个 '\n'
getline(cin, line);          // 现在正常读下一行
```

> [!tip] 类比：`>>` 像从盘子里夹菜，但筷子会残留汤汁（换行符）。`ignore` 是拿纸巾把筷子擦干净，下次夹菜才不会串味。

**`cin.peek()` —— 偷看一眼**

看一看下一个字符是什么，但不取走它：

```cpp
char ch = cin.peek();  // 偷看下一个字符
if (ch == '\n') {
    // 下一字符是换行，做点什么
}
```

**`cin.fail()` 和 `cin.clear()` —— 输入失败了怎么办**

当用户输入的类型不匹配时（比如要求输入 `int`，却输入了 `abc`），`cin` 会进入"失败状态"，之后所有的 `cin >>` 都会失效。

```cpp
int n;
cin >> n;              // 用户输入 "abc" → cin 进入失败状态
if (cin.fail()) {      // 检查是否失败
    cin.clear();       // 1. 先清除失败标志，恢复 cin 可用
    cin.ignore(10000, '\n');  // 2. 再把缓冲区里的垃圾扔掉
}
```

> [!warning] `clear()` 只清除错误状态，不清除缓冲区。两者必须搭配使用，顺序不能反：先 `clear()` 后 `ignore()`。


### 1.2 变量声明与初始化

#### 1.C++ 允许在 `for` 循环内部声明循环变量：
```cpp
// C: 变量必须在函数开头声明
int i;
for (i = 0; i < 10; i++) { }

// C++: 可以在 for 内声明
for (int i = 0; i < 10; i++) { }
```

#### 2.C++初始化方式新增，利用`（ ）`，`{ }`
`()`初始化对象：
 - 基本类型
 - string类型
`{}`初始化对象：
 - 初始化一切

```cpp
int Num1(1); //初始化为1
int Num2{1}; //初始化为1
string str("hello");
char a[20]{"hello world!"};//字符或字符串只允许用花括号，不允许用小括号
```
> [!tip] 对于数组、字符数组、字符串而言，`{  }` 初始化，未占满处自动初始化为0 



---

### 1.4 bool 类型

- 只有真和假，打印值只有（0，1）
- 占用1个字节
- 一般用为函数返回值或者标志位
```cpp
bool flag = true;   // true  = 非零值
bool ok = false;    // false = 0

if (flag) { }       // 直接用，不需要 flag == 1
```

C99 也有 `bool`（需 `#include <stdbool.h>`），但 C++ 内建直接可用。

---

### 1.5 const 常量

```cpp
const double PI = 3.14159;   // 不可修改的常量
PI = 3.0;                    // ❌ 编译报错
```

| 用法 | 说明 |
|:-----|:-----|
| `const int N = 100;` | 定义常量，替代 C 的 `#define N 100` |
| `const char *p` | 指向常量字符串的指针，内容不可通过 p 修改 |
| `void func(const Motor &m)` | 传引用 + const：不拷贝、不修改 |

> `const` 比 `#define` 更安全——有类型检查，可调试。嵌入式开发中 `const` 还能把数据放入 FLASH（`.rodata`），节省 RAM。

---

### 1.6 string 类

`std::string` 替代 C 的 `char[]`，自动管理内存。
#### 基本操作
```cpp
#include <string>
using namespace std;

string s1 = "hello";
string s2 = " world";

// 拼接
string s3 = s1 + s2;              // "hello world"

// 读取含空格的整行
string line;
getline(cin, line);               // 读入一整行（含空格）

// 获取长度
size_t len = s1.length();         // 5
```

#### 与 C 字符串对比

| 操作    | C                       | C++                         |
| :---- | :---------------------- | :-------------------------- |
| 声明    | `char buf[32];`         | `string s;`                 |
| 拼接    | `strcat(buf, "world");` | `s += "world";` 或 `s1 + s2` |
| 长度    | `strlen(buf)`           | `s.length()`                |
| 含空格输入 | 麻烦（`gets` 危险）           | `getline(cin, s)`           |
| 内存管理  | 手动管理数组大小                | 自动扩缩                        |
> `.length()` 是面向对象的写法——`.` 左边是对象，右边是方法。这和 C 的 `strlen(buf)` 函数式调用不同。

---
### 1.7 struct 与 class

C++ 中结构体名就是类型名，不需要 `typedef`：

| C                                     | C++                           |
| :------------------------------------ | :---------------------------- |
| `typedef struct { int x, y; } Point;` | `struct Point { int x, y; };` |
| `Point p;` 或 `struct Point p;`        | `Point p;`                    |

```cpp
struct Point {
    int x;
    int y;
};
Point p1;            // 直接用，不需要 struct Point
p1.x = 10;
```


#### 1、限定访问修饰符

三种访问修饰符：`public`、`private`、`protected`。核心就是一句话：谁能碰这个成员。

|修饰符|类内部|类外部|子类|
|:----|:----|:----|:----|
|`public`|✅|✅|✅|
|`private`|✅|❌|❌|
|`protected`|✅|❌|✅|

```cpp
class Motor {
public:
    int rpm;        // 谁都看得见、改得了
private:
    double current;  // 只有自己内部能碰
protected:
    int max_power;  // 自己和子类能碰，外部不行
};

Motor m;
m.rpm = 3000;       // ✅ public，随便用
// m.current = 5.0; // ❌ private，编译报错
// m.max_power = 100;// ❌ protected，编译报错
```

| 用什么         | 什么时候                          |
| :---------- | :---------------------------- |
| `private`   | 内部状态、底层细节——不想让外面乱改，只能通过公开函数操作 |
| `public`    | 对外接口——别人应该调用的函数               |
| `protected` | 留给子类用的东西——很少用，继承多了才需要         |
嵌入式开发里最常见的就是前两个：`private` 保护状态变量，`public` 暴露操作接口。`protected` 等到真写继承体系再说。
#### 2、struct 与 class 的核心区别

在 C++ 中，`struct` 和 `class` **本质上是同一个东西**，只有两个默认权限不同：

| 区别 | struct | class |
|:------|:-------|:------|
| 成员默认访问权限 | **public**（公开） | **private**（私有） |
| 默认继承方式 | public 继承 | private 继承 |

除此之外一切相同：都能有成员变量、成员函数、构造函数、析构函数、继承、多态。

**类比**：就像两台完全一样的车，出厂设置不同——struct 默认"车门开着"，class 默认"车门锁着"。

```cpp
// struct 版本：成员默认 public
struct Point_s {
    int x, y;
    void move(int dx, int dy) { x += dx; y += dy; }
};
Point_s ps;
ps.x = 10;   // ✅ 外部可访问

// class 版本：成员默认 private
class Point_c {
    int x, y;
public:      // 需要手动打开访问权限
    void move(int dx, int dy) { x += dx; y += dy; }
    int getX() { return x; }
};
Point_c pc;
pc.x = 10;   // ❌ 编译报错！x 是 private
pc.getX();   // ✅ 通过 public 接口访问
```

**初始化方式的区别**

```cpp
 // struct —— 默认 public，可以直接初始化成员
  struct Point {
      int x, y;
  };
  Point p1{10, 20};       // ✅ 聚合初始化
  Point p2 = {10, 20};    // ✅ 也可以

  // class —— 默认 private，有私有成员就不能聚合初始化
  class Point_c {
      int x, y;            // 默认 private
  public:
      Point_c(int a, int b) : x(a), y(b) {}  // 必须靠构造函数
  };
  Point_c p3{10, 20};     // ✅ 走构造函数，不是聚合初始化
  // Point_c p4 = {10, 20}; // ❌ 编译报错，private 成员无法直接赋值
```


> [!NOTE] 对于class的函数实现技巧
1. 类里面只放**函数的声明**
2. 成员函数的实现放在类的外部 a. 在函数名的前面加上作用域符`::`来指明所属类


> [!NOTE] 使用惯用法
>
- **struct** — 纯数据聚合体（一堆变量放一起），或者主动设为 public 的简单结构
- **class** — 有封装逻辑、需要保护内部数据不让外部乱改的复杂对象
这不是语法规定，是工程默契。`struct` 换个写法改成全 public 的 `class` 完全合法。
 
---


#### 3、C++ 类/结构体相比 C 的四大特色

**1. 成员函数**：操作和数据绑定在一起

```cpp
// C: 数据与操作分离
typedef struct { int rpm; double speed; } Motor;
void motor_setSpeed(Motor* m, double s) { m->speed = s; }

// C++: 操作封装在内部
struct Motor {
    int rpm;
    double speed;
    void setSpeed(double s) { speed = s; }  // 成员函数
};
Motor m;
m.setSpeed(3.0);  // 对象.方法()，直观
```

**2. 构造/析构函数**：对象创建和销毁时自动执行

```cpp
struct Motor {
    int rpm;
    Motor() { rpm = 0; }          // 构造函数——创建对象时自动调用
    Motor(int r) { rpm = r; }     // 重载版本——传参构造
    ~Motor() { /* 释放资源 */ }    // 析构函数——对象被销毁时自动调用
};
Motor m1;          // 自动调 Motor()，rpm = 0
Motor m2(3000);    // 自动调 Motor(int r)，rpm = 3000
```

**3. 访问控制**：public / private / protected

```cpp
class Motor {
private:
    int rpm;          // 外部不可直接访问
    double current;
public:
    void setRpm(int r) { if (r >= 0) rpm = r; }  // 带校验的赋值
    int getRpm() { return rpm; }
};
Motor m;
m.setRpm(-5);     // rpm 不会变成 -5，setRpm 内部拦截了非法值
// m.rpm = -5;    // ❌ private，编译报错
```

**4. 继承**：复用已有类的代码

```cpp
struct Vehicle {
    double speed;
    void accelerate(double a) { speed += a; }
};
struct Car : public Vehicle {  // Car 继承 Vehicle
    int doors;
    void openDoor() { }
};
Car c;
c.accelerate(10);   // 直接用父类的函数
c.openDoor();       // 自己的函数
```

---

#### 4、嵌入式struct/class 应用

**场景 1：寄存器映射（常用 struct）**

```cpp
// 用 struct 映射外设寄存器，数据成员全 public，天然匹配硬件布局
struct GPIO_Reg {
    volatile uint32_t MODER;    // 模式寄存器
    volatile uint32_t OTYPER;   // 输出类型
    volatile uint32_t OSPEEDR;  // 速度
    volatile uint32_t PUPDR;    // 上下拉
    volatile uint32_t IDR;      // 输入数据
    volatile uint32_t ODR;      // 输出数据
};
#define GPIOA ((GPIO_Reg*)0x48000000)   // 挂到硬件地址
GPIOA->MODER |= (1 << 0);              // 操作就像操作结构体
```

> 这类场景用 `struct` 而不用 `class`：寄存器本来就是公开的，无需封装。

**场景 2：设备驱动封装（常用 class）**

```cpp
class MotorDriver {
private:
    uint8_t pin_pwm;             // 硬件引脚
    uint8_t pin_dir;
    double current_speed;        // 内部状态，不允许外部随意改
    void pwm_setDuty(uint8_t d); // 底层操作，外部不需要知道

public:
    MotorDriver(uint8_t pwm, uint8_t dir);
    void setSpeed(double s);     // 公开接口
    double getSpeed();
    void emergencyStop();        // 安全功能
};
```

> 用 `class` 保护底层细节：外部只需调 `setSpeed()`，不需要知道 PWM 占空比怎么算的。

**场景 3：CAN / 通信帧解析（struct + 构造函数）**

```cpp
struct CAN_Frame {
    uint32_t id;
    uint8_t data[8];
    uint8_t len;

    CAN_Frame() : id(0), len(0) { memset(data, 0, 8); }  // 默认清零
    CAN_Frame(uint32_t i, uint8_t* d, uint8_t l);        // 从原始数据构造
    bool isExtended() { return id > 0x7FF; }              // 判断帧类型
};
CAN_Frame f(0x123, buf, 8);  // 一行构造并填充
```

**场景 4：状态机（class 封装）**

```cpp
class StateMachine {
private:
    enum State { IDLE, RUNNING, FAULT } state;

public:
    void init()    { state = IDLE; }
    void run()     { if (state == IDLE) state = RUNNING; }
    void fault()   { state = FAULT; /* 触发安全操作 */ }
    bool isFault() { return state == FAULT; }
};
```

**struct vs class 嵌入式选择指南**：

| 场景      | 推荐            | 原因             |
| :------ | :------------ | :------------- |
| 寄存器映射   | struct        | 全公开，匹配硬件       |
| 通信帧/数据包 | struct + 构造函数 | 数据为主，构造函数方便初始化 |
| 设备驱动    | class         | 封装底层细节，暴露安全接口  |
| 状态机     | class         | 保护状态变量，只允许合法转换 |
| 传感器数据点  | struct        | 纯数据聚合：x、y、z 值  |
| 配置参数    | struct        | 一堆默认值，公开直接读    |

> 嵌入式 C++ 基本原则：**零开销抽象**——编译后的代码不比你手写 C 多出任何东西。构造函数被 inline 优化后和手动赋初值一样的汇编。`class` 的封装在编译期检查，运行时零开销。

#### 5.类的声明与函数实现的分离

> [!tip] 类里面只放函数声明，成员函数的实现放在类的外部
> 在返回值后面，函数名前面加上作类的作用域，`类名 ::`
 
> [!tip] 类的声明也可份文件进行
> 1.类的成员与函数声明放置在`.h`文件中
> 2.类的函数实现放置在 `.c` 文件中

> [!tip] 构造函数：类成员实现简洁的初始化
> 可以使得在创建类的时候，就对成员进行初始化
```cpp
//类的声明
class Person {
private: //私人作用域
	string m_name;
	uint8_t m_age;
	string m_car;
public: //外部作用域
	Person(string name, uint8_t age, string car)  //构造函数，使得
		: m_name(name), m_age(age), m_car(car) {}
	string getName(); //类函数声明
};
//类函数实现
 string	Person::getName() {
	 return m_name;
 }
int main() {
	Person Father("dad",32,"baoma");//直接通过构造函数进行初始化成员
	cout << Father.getName() << endl; //输出dad
	return 0;
}
```

---
### 1.8 enum枚举类型
#### 1.C语言中的enum
```cpp
enum SHAPE {CIRCLE,RECT,LINE,POINT};
enum WEEK  {MON,TUE,WED,THI,FIR,SAT,SUN};
```
1.  **允许非枚举值赋值给枚举类型，也允许跨枚举类型赋值**
    ```cpp
    enum WEEK today = 3;    //正确
    today = CIRCLE;        //正确
    ```
2.  **枚举拥有外层作用域，容易引发命名冲突**
    在不同作用域不会冲突，但是遵循就近原则，无法访问外层作用域的枚举命名
    ```cpp
    enum OTHER { RECT };//error C2365: "RECT": 重定义；以前的定义是“枚举数”
    int RECT = 12;      //同上报错
    ```
3.  **不同类型的枚举值可以直接进行比较**
    ```cpp
    if (CIRCLE == MON)
    {
        printf("oh.yes");
    }
    ```
#### 2, C++中的enum
1.  **仅允许赋值合法的枚举值**
    ```cpp
    enum WEEK today = 3;    //错误  报错error C2440: "初始化": 无法从"int"转换为"main::WEEK"
    today = CIRCLE;        //错误  报错error C2440: "=": 无法从"main::SHAPE"转换为"main::WEEK"
    ```
2.  **枚举元素会暴露在全局作用域，同名枚举元素会引发命名冲突**
    不同枚举类型如果存在同名枚举值，会触发重定义错误，不过可以通过`枚举名::枚举元素`的方式访问指定枚举属性
    ```cpp
    enum OTHER { RECT };    //错误  报错error C2365: "RECT": 重定义；以前的定义是“枚举数”
    int RECT = 12;         //错误 同上报错
    OTHER::RECT;           //正确的访问方式
    ```
3.  **不同类型的枚举值依旧可以直接进行比较**
    ```cpp
    if (CIRCLE == MON) cout<<"oh.yes";
    ```
#### 3,C++中的 enum class 强枚举类型

首先是强枚举的标准定义示例：
```cpp
enum class SHAPE {CIRCLE,RECT,LINE,POINT};
enum class WEEK  {MON,TUE,WED,THI,FIR,SAT,SUN};
```

1. **特性1**：*限定作用域*
强枚举类型不会将枚举元素暴露到全局作用域，必须通过`枚举名::枚举元素`的方式访问内部枚举值
```cpp
cout<<SHAPE::RECT<<endl;    //输出 1，原文此处存在笔误，写成了`SHAPCE::RECT`
```
2.  **特性2**：*类型安全校验*
不相关的两个枚举类型不能直接进行比较，编译时2会触发报错：
```cpp
if (SHAPE::CIRCLE == WEEK::MON) //error C2676: 二进制"==":"main::SHAPE"不定义该运算符或到预定
义运算符可接收的类型的转换
{
    cout<<"oh.yes";
}
```
#### 4.可以用Switch函数，快速列出所有枚举成员
```cpp
	//1 通过编译器快捷补全switch函数
	//2 将枚举变量名字输入到switch（**SHAPE**）然后回车
	//3 最后再将SHAPE改成真正的枚举变量名
	switch (SHAPE)
	{
	case SHAPE::CIRCLE:
		break;
	case SHAPE::RECT:
		break;
	case SHAPE::LINE:
		break;
	case SHAPE::POINT:
		break;
	default:
		break;
	}
```

---

### 1.9 引用类型: 起别名

#### 作用
1.充当函数参数，替代指针同时防止拷贝本的产生
2.充当函数返回值类型，增加左值产生
3.**别名和原变量是同一个实体**
> 引用，顾名思义是某一个变量或对象的别名，对引用的操作与对其所绑定的变量或对象的操作完全等价

#### 语法
```cpp
类型 &引用名=目标变量名;
int b;
int &a = b;//整型类型，相当于给了b一个a的身份继续干活，但本质是a
int* ptr;
int* &a = ptr;//指针类型
int&& n_num = 134; //右值引用：相当于将134（右值）转化为了左值 n_num，相当于给了134一个身份n_num,之后n_num就可以当作普通变量来操作
```

>[!caution] 等号左边左值，右边右值
>| 类型  | 理解             | 例子                   |
| --- | -------------- | -------------------- |
| 左值  | 有名字、地址、能取地址、赋值 | `int a`、`int arr[0`] |
| 右值  | 临时值、用完即丢、没有名字  | `&a`、`1+1`、`42`      |

#### 充当函数参数的例子
```cpp
左值引用
void swap(int& x){//形参作为实参的别名
	x = 1111;
}
左值和右值均可传，const修饰后
void constswap(const int& x){  
	x = 1111; //❌错误的写法，const修饰后，只可引用，不可修改
	a = x; 
}
右值引用
void swap1(int&& x){  
	x++; //好处，可直接修改形参
}
int main（void）{
	int a =0 ;
	swap(a); //✅传变量a
	swap(1); //❌不可传右值
	
	constswap(a);//✅左值可传，但不可修改
	constswap(1);//✅右值可传，但不可修改
	
	swap1(a); //❌
	swap1((int&&)a); //✅可以将a强转为右值，但不符合常理。此时a = 1
	swap1(std::move(a))//✅✅可以将a强转为右值。此时a = 2
	swap1(0); //✅
}
```
> [!NOTE] 对于右值传递的理解（形参可以被操作）
> `&&`只是限制了谁会传递进来。如果将某变量的右值传递进去后，等价于该变量被传递进去操作

#### 充当函数返回值类型例子：
```cpp
  int a = 10;
  int getValue() {        // 返回值（副本）
      return a;
  }
  int& getRef() {         // 返回引用（别名）
      return a;
  }
  调用的区别：
  int x = getValue();     // ✅ x = 10，a 的副本
  int y = getRef();       // ✅ y = 10，也是副本？等一下...

  getValue() = 100;       // ❌ 编译错误！不能给临时值赋值
  getRef() = 100;         // ✅ a 变成了 100！因为返回的是 a 的别名
```

> [!warning] 局部变量（函数结束就释放内存），不可以用于**返回地址**或**引用**

#### 注意事项
1.  **引用必须初始化**
    ```cpp
    int& refa;      //错误 没有初始化
    int  a = 8;
    int& refa = a;  //正确
    ```
2.  **一旦引用被初始化为一个对象，就不能被指向到另一个对象**
    ```cpp
    int  a = 8,b = 9;
    int& refa = a;
    refa = b;       //只是把b的值赋值给了refa，而不是让refa引用b
    ```

#### 移动语义
- 在**不增加开销**的情况下转移资源
```cpp
	void restransfer(int* &&resource,int* && destination){
		destination = resource; //将资源转移给目标地址
		resource = nullptr；//释放源指针
	}
	
	int* resource = new int(20);
	int* destination = nullptr;
	restransfer(std::move(resource),std::move(destination)); //在无开消的情况下，显示的转移资源
	cout << resource <<"  "	<< destination << endl;	//结果
```







---

### 1.10三目运算符

以下是 C 和 C++ 三目运算符的核心区别：

| 对比维度         | C 语言                             | C++                                     |
| ------------ | -------------------------------- | --------------------------------------- |
| **返回值类别**    | 始终返回**右值**（值本身）                  | 两个分支都是同类型左值时，返回**左值**（变量引用）             |
| **能否赋值**     | ❌ `(a > b ? a : b) = 10;` 编译错误   | ✅ `(a > b ? a : b) = 10;` 合法，直接修改 b     |
| **类型不一致时**   | 按 C 隐式转换规则自动转换                   | 转换规则更严格，两个分支必须可互相转换，否则编译报错              |
| **const 限定** | 忽略 const（非 const 分支会污染 const 分支） | 严格保留 const 属性，`const int` 分支返回 const 引用 |
| **类类型支持**    | ❌ C 无类，只能用于基本类型和指针               | ✅ 可用于 `std::string`、自定义类等任何类型           |
| **引用折叠**     | 无此概念                             | 左右值引用混合时按引用折叠规则决定最终返回类型                 |
**核心一句话**：C 的三目运算符就是个"取值器"，C++ 把它升级成了"变量访问器"。
```cpp
int a = 2, b = 3;

// 用法1：表达式做右值（C 和 C++ 都支持）
int max = a > b ? a : b;   // max = 3

// 用法2：表达式做左值（仅 C++ 支持！）
(a > b ? a : b) = 55;      // b 被改为 55
// C++ 中三目运算符返回的是变量本身的引用，所以可以直接赋值
// C 语言中返回的是值，不能这样写
```

### 1.11 动态内存分配
#### new/delete和malloc/free
在软件开发过程中，常常需要动态地分配和释放内存空间，例如对动态链表中结点的插入与删除。在C语言中是利用库函数`malloc`和`free`来分配和释放内存空间的。C++提供了较简便而功能较强的运算符`new`和`delete`来取代`malloc`和`free`函数。
> 注意：`new`和`delete`是运算符，不是函数，因此执行效率高。
#### new申请内存
```cpp
// 1. 申请单个对象
指针变量 = new 类型;        //申请内存的时候初始化
// 2. 申请数组
指针变量 = new 类型[size];    //申请数组，创建数组时不能指定初始值
```
>[!tip] 申请空间的同时，可以用cpp新增的的（）和{ } 进行初始化
#### delete释放内存
```cpp
// 1. 释放单个对象
delete 指针变量;      //释放单个对象
// 2. 释放数组
delete[] 指针变量;   //释放数组
```
 >[!caution] 但释放后仍需要手动置空
#### 例子
```cpp
    int *page = new int(19);           // 使用new运算符动态分配一个整数，并初始化为19
    cout << "page: " << *page << endl; // 输出page指针所指向的值，即19
    delete page;                       // 释放之前分配的内存
    page = nullptr;                    // 指针置空，避免悬空
    cout << "page: " << page << endl;  // 输出page指针的值，此时为nullptr
    page = new int[12]{1, 23, 4, 512, 2}; // 使用new运算符动态分配一个整数数组，并初始化前5个元素，剩余元素默认为0
    for (int i = 0; i < 12; i++)
    {
        cout << "page[" << i << "]: " << *(page + i) << endl; // 输出page数组中的每个元素
    }
    delete[] page;                    // 释放数组占用的内存
    page = nullptr;                   // 指针置空，避免悬空
    cout << "page: " << page << endl; // 输出page指针的值，此时为nullptr
```

### 1.12 进制表达

```cpp
//十进制 不需要前缀
int dec = 520;
//八进制 以0开头
int oct = 01010;
//十六进制 以0x开头
int hex = 0x208;
//二进制  以0b开头
int bin = 0b1000001000;
cout << dec << " " << oct << " " << hex << " " << bin << " " << endl;
//有没有办法可以每四个位分隔一下,通过英文的单引号即可实现
int b1 = 0b10'0000'1000;
```

---
### 1.13typeid 获取对象的类型与信息
#### typeid使用
`typeid` 运算符用来获取一个表达式的类型信息。
`typeid` 的操作对象既可以是表达式，也可以是数据类型，下面是它的两种使用方法：
```cpp
typeid( dataType )
typeid( expression )
```
- `dataType` 是数据类型，`expression` 是表达式，这和 `sizeof` 运算符非常类似，只不过 `sizeof` 有时候可以省略括号，而 `typeid` 必须带上括号。
- `typeid` 会把获取到的类型信息保存到一个 `type_info` 类型的对象里面，并返回该对象的常引用；当需要具体的类型信息时，可以通过成员函数来提取。
####  示例代码
```cpp
//获取一个普通变量的类型信息
int n = 100;
const type_info& nInfo = typeid(n);
cout << nInfo.name() << " | " << nInfo.raw_name() << " | " << nInfo.hash_code() << endl;
//获取一个字面量的类型信息
const type_info& dInfo = typeid(25.65);
cout << dInfo.name() << " | " << dInfo.raw_name() << " | " << dInfo.hash_code() << endl;
//获取一个普通类型的类型信息
const type_info& charInfo = typeid(char);
cout << charInfo.name() << " | " << charInfo.raw_name() << " | " << charInfo.hash_code();
//获取一个表达式的类型信息
const type_info& expInfo = typeid(20 * 45 / 4.5);
cout << expInfo.name() << " | " << expInfo.raw_name() << " | " << expInfo.hash_code() << endl;
```

####  补充说明
本例中还用到了`type_info`类的几个成员函数，下面是对它们的介绍：
1.  `name()`：用来**返回类型的名称**。
2.  `raw_name()`：用来返回名字编码（Name Mangling）算法产生的新名称。
3.  `hash_code()`：用来返回当前类型对应的hash值。hash值是可以用来标识当前类型的整数，类似学号、身份证号、银行卡号。不过hash值依赖编译器实现，不同编译器下数值可能不同，但都可以唯一标识一个类型。


> [!NOTE] 除此之外，还可以用 == 比较两个类型是否相等， 如有以下定义:
```cpp
char *str;
int a = 2;
int b = 10;
float f;
```
类型判断结果为:

| 类型比较                            | 结果    | 类型比较                           | 结果    |
| ------------------------------- | ----- | ------------------------------ | ----- |
| `typeid(int) == typeid(int)`    | true  | `typeid(int) == typeid(char)`  | false |
| `typeid(char*) == typeid(char)` | false | `typeid(str) == typeid(char*)` | true  |
| `typeid(a) == typeid(int)`      | true  | `typeid(b) == typeid(int)`     | true  |
| `typeid(a) == typeid(a)`        | true  | `typeid(a) == typeid(b)`       | true  |
| `typeid(a) == typeid(f)`        | false | `typeid(a/b) == typeid(int)`   | true  |

--- 
### 1.14 内联函数inline

*为什么使用内联函数*？
内联函数没有普通函数调用时的额外开销（压栈、跳转、返回）

*方法*：使用`inline` + `函数名` 

*要求*：
1. 不允许函数内部有循环
2. 不允许函数内部代码过长（1~5行最佳）

*注意*：
3. `inline`只是个**请求**内联，实际上编译器不一定会允许。
4. 现代的C++编译器能够进行优化，有些函数没有进行`inline`声明也可能被优化成内联函数
5. 不能对函数进行任何**取地址**操作

---

### 1.15 函数重载

函数重载是指在同一作用域内，可以有一组具有相同函数名，不同参数列表的函数，这组函数被称为重载函数。重载函数通常用来命名一组功能相似的函数，这样做减少了函数名的数量，对于程序的可读性有很大的好处。

####  不同参数列表区分重载的规则：
1.  功能相似，参数列表不同
	- 参数个数不同
	- 参数类型不同
	- 参数顺序不同
2.  **函数重载与返回值类型无关**

####  为什么需要函数重载？
1.  试想如果没有函数重载机制，如在C中，你必须要这样去做：为这个`maxmum`函数取不同的名字，如`maxmum_int`、`maxmum_string`等等。这里还只是简单的几种情况，如果是很多个的话，就需要为实现同一个功能的函数取很多个名字，这样做很不友好！
2.  类的构造函数跟类名相同，也就是说：构造函数都同名。如果没有函数重载机制，要想实例化不同的对象，那是相当的麻烦！
3.  操作符重载，本质上就是函数重载，它大大丰富了已有操作符的含义，方便使用，如`+`可用于连接字符串等！

#### 重载函数的调用匹配规则
为了判断哪个重载函数最适合被调用，需要依次按照下列规则来匹配：
1.  **精确匹配**：参数匹配而不做转换，或者只是做微不足道的转换，如数组名到指针、函数名到指向函数的指针；
2.  **提升匹配**：即整数提升（如`bool` 到`int`、`char`到`int`、`short`到`int`），`float`到`double`
3.  **使用标准转换匹配**：如`int` 到`double`、`double`到`int`、`double`到`long double`、`Derived`到`Base`、`T`到`void`、`int`到`unsigned int`；
4.  **编译器报错：歧义调用**：如果在最高层有多个匹配函数找到，调用将被拒绝（因为有歧义、模凌两可）

```cpp
// 整型重载版本
int maxmum(int a, int b)
{
    return a > b?a:b;
}
// 长整型重载版本
long maxmum(long int a, long int b)
{
    return a > b ? a : b;
}
// 字符型重载版本
auto maxmum(int a, char b)
{
    return a > b ? a : b;
}
auto maxmum(char a, int b)
{
    return a > b ? a : b;
}
// 双精度浮点型重载版本
double maxmum(double a, double b)
// 针对const char*类型的重载版本，返回字典序更大的字符串
const char* maxmum(const char* str1,const char* str2)
{
    return strcmp(str1, str2)==1?str1:str2;
}
// 针对char*类型的重载版本，返回字典序更大的字符串
char* maxmum(char* str1, char* str2)
{
    return strcmp(str1, str2) == 1 ? str1 : str2;
}	
```

### 1.16构造与析构

#### 1、 构造函数

> [!note] 作用
创建类的对象时，系统会自动调用构造函数，帮你完成对象的数据成员初始化工作，不用手动逐个赋值。

> [!note] 定义：
1.**函数名必须和类名完全一致**，比如示例里的`Cuboid`类，构造函数就是`Cuboid()`
2.**没有返回值，也不需要写`void`**
3.支持重载，可以根据传入的参数创建不同初始化逻辑的构造函数

> [!note] 调用方式
1. **无参构造**：最常用的场景，创建对象时编译器自动执行无参构造函数，比如`Cuboid cub;`
2. **有参构造**：使用有参构造的时候，可以手动传入参数，比如`Cuboid cub(10,20,30);`
3. **拷贝构造**：拷贝构造函数的形参是 `const 类名&`，用来接收被拷贝的那个对象。
	- 拷贝构造函数，用于拷贝类，需要*手动创造*，如果没有，编译器会自己实现一个`按值拷贝`构造函数
	- 类传参需要引用（即`&类名`）。若不用`&`，函数*传值*后，编译器会*自己调用拷贝构造函数*，拷贝一个副本到函数里面进行操作（如果拷贝函数也不用`&`那么编译器又会自己调用拷贝构造函数一直循环）
	- 类作为*返回值直接返回*也可避免创建副本过程
	- **浅拷贝与深度拷贝**
		- 若赋值对象为*指针* ，无*先释放内存*，当赋值后指向新地址，可是旧地址却被断开且无人指向该处，导致*内存泄漏*
		- 浅拷贝：指针1赋值给指针2，那么两者共同指向*同一处地址*，二者对该处地址的操作，会影响对方（动态内存会存在于*堆区*中,由指针指向该地址）
		- 深拷贝：拷贝内容一致的内存空间，再让指针2指向该空间 
	```cpp
		class Point {
		    int x, y;
		public:
			Point(int a, int b) : x(a), y(b) {}; //有参构造
		    Point(const Point& p) : x(p.x), y(p.y) {  // 拷贝构造
		        cout << "拷贝了一份" << endl;
		    }
		};
		void func1(Point p) { };       // 传值——触发拷贝
		void func2(Point& p) { };      // 传引用——不拷贝
		Point creaPoint(){             // 只进行一次构造
			return Point( 1，1);
		};
		Point creaPoint(){             // 进行两次次构造
			p = Point( 1，1);          //  第一次构造
			return p;                  //  函数声明结束，p释放，第二次构造一个临时副本
		};
	```
4. **移动构造**：移动：直接"抢"走资源，原对象变空壳
	- 拷贝 == 复制粘贴， 移动 == 剪切粘贴
	- 函数返回*大对象*时：C++11 后编译器自动用*移动替代拷贝*，不产生*额外开销*
	- 容器扩容时：vector 里的元素直接"搬"到新空间，而不是先拷贝再销毁旧的
	- unique_ptr 只能移动不能拷贝：独占资源的所有权转移
```cpp
 class Point_c {
	  int x, y; // 默认 private
  public:
	  Point_c() : x(0), y(0) {}; // # 1.无参构造函数  
	  Point_c(int a, int b) : x(a), y(b) {};  // # 2.有参构造函数 
	  Point(const Point& p) : x(p.x), y(p.y) {  //# 3.拷贝构造
	     	cout << "拷贝了一份" << endl;
	  };
	  Point_C(const Point_c& ohter){
		  x = other.x;
		  y = ohter.y;
	  };
  };
```

#### 2、析构函数
> [!note] 作用：
> 在对象死亡（生命周期结束）时，会自动调用，释放创建的资源

> [!note] 定义
> 1. 函数名 = `~` + `类名`
> 2. 没有返回值， 不能带参数
```cpp
 class Buffer {
      int* data;     // 这是 new 出来的，不是你负责释放谁负责？
  public:
      Buffer() { data = new int[100]; }
      ~Buffer() { delete[] data; }   // ✅ 只有new 出来的指针需要 delete
  };
```

> [!NOTE] 如果这个类会被继承，析构函数还需要加 `virtual`，详见 [1.25 规则二](#规则二基类析构函数必须是-virtual)。

> [!caution] 构造与析构顺序
>- 先定义的，先构造，后析构
>- 后定义的，后构造，先析构
>- 和栈的顺序一样

#### 3、初始化参数列表

> [!example] 作用：作为一种初始化方式
1. 初始化本类与其他类
2. 初始化构造顺序，与类成员书写顺序有关，与构造函数的书写顺序无关

区别在于赋值时机：
```cpp
  // 方式1：不在初始化列表里（先创建再用=赋值）— 两步操作
  Motor(int rpm, double speed) {
      m_rpm = rpm;      // m_rpm 先被默认初始化为0，再赋值为 rpm
      m_speed = speed;
  }

  // 方式2：在初始化列表里直接初始化 — 一步到位
  Motor(int rpm, double speed)
      : m_rpm(rpm), m_speed(speed) {}  // m_rpm 直接用 rpm 的值创建出来

```

> [!note] 为什么要用初始化列表？ 三种情况必须用：
1. 成员是 const 常量（只能初始化，不能赋值）
2. 成员是引用类型（引用只能初始化绑定，不能"换绑"）
3. 成员是另一个类对象且该类没有默认构造函数

> [!example] 情况 1：成员是 const 常量
> ```cpp
> class Config {
> public:
>     Config(int port) : mPort(port) {}  // ✔ 初始化列表，OK
>     // Config(int port) { mPort = port; }  // ✗ 编译错误！const 不能赋值
> private:
>     const int mPort;
> };
> ```
> `const` 成员一旦创建就不能再赋值，构造函数体里的 `mPort = port` 是赋值操作，所以只能在初始化列表里做真正的初始化。

> [!example] 情况 2：成员是引用类型
> ```cpp
> class Wrapper {
> public:
>     Wrapper(int &ref) : mRef(ref) {}  // ✔ 初始化列表绑定引用
>     // Wrapper(int &ref) { mRef = ref; }  // ✗ 编译错误！
> private:
>     int &mRef;
> };
> ```
> 引用出生时就必须指名"我引的是谁"，这件事只能在初始化列表里完成。进了构造函数体就晚了——编译器不等你。
> 类比：遥控器出厂时必须配对一台电视，不能在遥控器造好之后再配对。

> [!example] 情况 3：成员类对象没有默认构造函数
> ```cpp
> class Motor {
> public:
>     Motor(int id) : mId(id) {}  // 只有带参构造，没有默认构造
> private:
>     int mId;
> };
> 
> class Chassis {
> public:
>     Chassis(int motorId) : mMotor(motorId) {}  // ✔ 必须这样
>     // Chassis(int motorId) {
>     //     mMotor = Motor(motorId);  // ✗ 走到这里时 mMotor 还没构造！
>     // }
> private:
>     Motor mMotor;
> };
> ```
> 进入构造函数体之前，所有成员已经完成了默认构造。但 `Motor` 没有默认构造函数，编译直接报错。只能通过初始化列表把参数传进去，让 `Motor` 直接使用带参构造。

#### 4、委托构造
> [!note] 作用：
- 但当一个类有多个构造函数、初始化逻辑复杂时，委托构造能消除重复代码：

> [!example] 使用规则： 位于初始化列表的位置，改成调另一个构造函数
```cpp
  class 类名 {
  public:
      // 主构造函数 — 真正干活的
      类名(参数1, 参数2, ...) : 成员1(值), 成员2(值) {
          // 初始化逻辑
      }
      // 委托构造函数 — 甩给主构造
      类名() : 类名(默认值1, 默认值2, ...) {}  // ← 核心语法：冒号后面跟自己的类名
  };
```
- 关键执行顺序：**被委托的先跑完 → 再回来跑自己的函数体**。
```cpp
Point(int v) : Point(v, v) {      // ① 委托给主构造
    // ③ 主构造跑完了，才轮到这里
    cout << "自定义逻辑";
}
//  ↓
Point(int a, int b) : x(a), y(b) {
    // ② 先跑这里
}
```

#### 5、默认函数
告诉编译器"帮我把无参构造自动生成出来"。什么时候必须写？你自定义了有参构造Stu(int)，编译器就*不再自动生成无参构造*，但你又想让 `Stu s;` 能用，就可以使用默认函数

```cpp
Stu() = default;
```

#### 6、删除函数
告诉编译器"禁止拷贝这个类的对象"。
效果：谁写 Stu a(zoey); 直接编译报错
> [!tip] 使用场景：
- 对象独占资源、不该被复制的时候
- 更新库之后，通过`delete`告诉使用库的用户，已被删除
```cpp
Stu(const Stu& other) = delete;
```

	### 1.17 explicit关键字

- 假设成员为整型，但是初始化为`‘a’`（97），于是编译器自动将*字符转化为整型*
- 以下有不合理的隐式转换，需要利用`explicit`来限制这种不合理情况
```cpp
MyString s(20);// 标准显式构造调用，合理
MyString ss = 10;// 隐式转换写法，被标记为不合理
MyString ts = MyString(10);// 显式匿名对象构造，合理
MyString s1 = 'a';// 隐式转换写法，被标记为不合理
MyString s2("磨课");// 标准显式构造调用，合理
MyString s3 = "maye";// 字符串字面量的隐式转换写法，被标记为不合理
```

- 发生隐式转换，除非有心利用，隐式转换常常带来程序逻辑的错误，而且这种错误一旦发生是很难察觉的。
- 原则上应该在所有的构造函数前加`explicit`关键字，当你有心利用隐式转换的时候再去解除explicit，这样可以大大减少错误的发生。

### 1.18 静态成员变量/函数的声明、定义和使用

####  1、变量
> [!note] 静态成员
1. C++11：必须在类的*内部声明* (必须加`Static`) ，在类的*外部定义初始化*（记住变量名前需要加`类名::`）
2. C++17：静态成员需要增加`inline`关键字
```cpp
Class Stu{
private:
	int age;
public:
	Stu():age(0) {classSize++;}
	Static int classSize;  //C++11：记录该类的成员有多少个
	inline Static int classSize;  //C++11：记录该类的成员有多少个
}
int Stu::classSize = 0; //外部初始化
```

> [!note] 如何访问？
```cpp
Stu zc;
//1, 通过对象访问静态成员变量
cout << zc.size << endl;
//2, 通过类访问成员变量（该方法仅限于静态成员）
cout << Stu::size << endl;
```

#### 2、函数
> [!note] 静态函数：仅需要`Static`
```cpp
Class Stu{
private:
	int age;
public:
	Stu():age(0) {classSize++;}
	Static int classSize;  //C++11：记录该类的成员有多少个
	inline Static int classSize;  //C++11：记录该类的成员有多少个
	Static int getclassSize(){return classSize;}
}
int Stu::classSize = 0; //外部初始化
```
> [!note] 使用
```cpp
Stu zc;
//1, 通过对象访问静态成员函数
int num = zc.getclassSize();
//2, 通过类访问成员函数（该方法仅限于静态函数）
int num = Stu::getclassSize();
```
> [!caution] 注意：
> 静态成员函数仅可访问和调用*静态成员变量/函数*
> **类外定义时不要加 `static`**：`static` 只在类内声明时用，类外定义只需写 `类型 类名::变量名 = 初值;`。
> ```cpp
> // 类外定义静态成员变量
> int Counter::count = 0;  ✅  类型 类名::变量名 = 初值
> static Counter::count = 0;  ❌  编译器不认识
> ```
> 如果把 `static` 写到类外，编译器会把它当成一个普通全局变量（静态全局），而不是类成员的定义。

### 1.19 this指针
#### 一、是什么

`this` 是 C++ 中每个**非静态成员函数**里隐含存在的一个指针，它指向**调用这个函数的对象本身**。
用人话类比：你（对象）做自我介绍时说"**我**今年 25 岁"——这里的"我"就是 `this`，指向你自己。
```cpp
class Student {
public:
    void introduce() {
        // this 就指向调用 introduce() 的那个 Student 对象
        cout << "我叫" << this->name << endl;  // this->name 就是 "我" 的 name
    }
private:
    string name;
};
```

#### 二、核心规则

1. **`this` 只在非静态成员函数里存在**——静态函数没有对象也能调用，所以没有 `this`
2. **`this` 是编译器自动隐式传入的**，你不需要声明它，直接在成员函数里用
3. **`this` 的类型是 `ClassName* const`**——指针本身不能改指向，但指向的对象内容可以改

#### 三、什么时候用

**情况 1：成员变量和参数同名时区分**

```cpp
class Car {
public:
    void setSpeed(int speed) {  // 参数也叫 speed
        this->speed = speed;    // this->speed 是成员变量，speed 是参数
    }
private:
    int speed;
};
```

> 这是最常用也几乎是唯一非用不可的场景。其他情况可写可不写，写了更明确。

**情况 2：链式调用——让函数返回自己**

```cpp
class Builder {
public:
    Builder& setA(int a) { this->a = a; return *this; }  // 返回自己
    Builder& setB(int b) { this->b = b; return *this; }

private:
    int a, b;
};
// 可以连着写
Builder b;
b.setA(1).setB(2).setA(3);  // 链式调用，流畅
```

**情况 3：需要把当前对象传给另一个函数**

```cpp
class Node {
public:
    void registerSelf(Manager& mgr) {
        mgr.addNode(this);  // 把"我"的地址传过去
    }
};
```

#### 四、一段完整的例子

```cpp
#include <iostream>
using namespace std;
class Counter {
public:
    Counter(int start = 0) { this->count = start; }
    Counter& increment() {   // 返回引用，支持链式
        this->count++;
        return *this;        // *this 就是"我自己"这个对象
    }
    void print() const {
        cout << "当前值：" << this->count << endl;
    }
private:
    int count;
};

int main() {
    Counter c(5);
    c.increment().increment().print();  // 输出：当前值：7
    return 0;
}
```

####  五、一个注意点

在 `const` 成员函数里，`this` 的类型会变成 `const ClassName* const`——既不能改指针指向，也不能通过 `this` 修改成员变量。这是 C++ 保证 const 正确性的底层机制。

> [!tip] **一句话总结：**
>  `this` 就是成员函数里的"我自己"，本质是指向当前对象的指针，最常用来区分同名参数，以及在链式调用和自传递时使用。


### 1.20 const修饰的成员变量
#### 一、是什么

`const` 成员变量就是**初始化之后不能再修改**的成员变量。一旦对象构造完成，这个值就被"锁死"了。
人话类比：身份证号——每个人（对象）出生时就确定了，一辈子不能改。
```cpp
class Person {
public:
    Person(string id) : idNumber(id) {}  // 初始化时赋值，之后不能再改
    void show() const { cout << idNumber << endl; }
private:
    const string idNumber;  // const 成员，一辈子不变
};
```

#### 二、核心规则

**规则 1：只能用初始化列表赋值，不能在里面用**
```cpp
class Demo {
public:
    Demo(int x) : value(x) {}   // 正确：初始化列表
    // Demo(int x) { value = x; }  // 错误！const 变量不能在函数体里赋值
private:
    const int value;
};
```
为什么？构造函数体里的 = 是"修改已存在的变量"，而 const 变量只允许"出生那一刻赋值"（即初始化）。初始化列表做的才是"出生赋值"。

**规则 2：每个对象可以有不同的 const 值**
```cpp
class Student {
public:
    Student(int id) : studentId(id) {}
private:
    const int studentId;
};

Student s1(1001);  // s1 的 studentId = 1001，永不改变
Student s2(1002);  // s2 的 studentId = 1002，永不改变
```
const 的意思是"我这个对象的值不变"，不是说"所有对象的值都一样"（那是 `static const` 的事）。

**规则 3：const 对象只能调用 const 成员函数**
```cpp
class Box {
public:
    int getValue() const { return value; }       // const 函数，const 对象可以调
    void setValue(int v) { value = v; }           // 非 const 函数，const 对象不能调
private:
    int value;
};

const Box b;          // const 对象
b.getValue();         // OK
// b.setValue(5);     // 编译错误！const 对象不能调非 const 函数
```
> [!caution] 注意const修饰函数需要放在*函数后面*
#### 三、什么时候用

**场景 1：值在构造时确定，之后绝不变**

```cpp
class Rectangle {
public:
    Rectangle(double w, double h) : width(w), height(h) {}
    double area() const { return width * height; }
private:
    const double width;   // 宽高创建后不变
    const double height;
};
```

**场景 2：每个对象有唯一的"身份证号"**

```cpp
class Order {
public:
    Order(int orderId) : orderId(orderId) {}
    int getId() const { return orderId; }
private:
    const int orderId;  // 订单号一旦生成不能改
};
```

**场景 3：配合引用型成员，绑定后不换对象**

```cpp
class Printer {
public:
    Printer(ostream& out) : output(out) {}
    void print(const string& msg) { output << msg; }
private:
    ostream& output;  // 引用成员：绑定后不能再指别人
};
// 注意：引用本身天然"const"，不需要加 const 关键字
```

#### 四、一个完整例子

```cpp
#include <iostream>
using namespace std;

class Battery {
public:
    Battery(double capacity, double voltage)
        : mCapacity(capacity), mVoltage(voltage), mMaxVoltage(voltage * 1.2)
    {}

    void showInfo() const {
        cout << "容量：" << mCapacity << "Ah" << endl;
        cout << "额定电压：" << mVoltage << "V" << endl;
        cout << "最大电压：" << mMaxVoltage << "V" << endl;
    }

    // 注意：这些是 const 成员，没有 setter 函数

private:
    const double mCapacity;     // 容量，出厂就定了
    const double mVoltage;      // 额定电压，出厂就定了
    const double mMaxVoltage;   // 由上两个计算得出，一并锁死
};

int main() {
    Battery lipo(5.0, 3.7);    // 一块 5Ah、3.7V 的锂电池
    lipo.showInfo();
    return 0;
}
```

#### 五、const 成员变量 vs 类内常量
初学者容易搞混这两个：

|                        |  `const` 成员变量  |    `static const` 成员     |
|:---------------------- |:------------------:|:--------------------------:|
| 每个对象值可以不同吗？ |        可以        | 不行，所有对象共享同一个值 |
| 占对象内存吗？         |         占         |     不占（存在全局区）     |
| 典型用途               | 身份证号、出厂参数 |     数学常数、配置上限     |

```cpp
class Motor {
public:
    Motor(double ratedTorque) : mRatedTorque(ratedTorque) {}
private:
    const double mRatedTorque;      // const 成员：每台电机额定扭矩可能不同
    static constexpr double PI = 3.14159;  // 类内常量：π 对谁都一样
};
```

---

**一句话总结：** `const` 成员变量让"创建后不再变"这件事由编译器强制执行，避免后续代码意外修改。最常用的场景就是"在构造函数初始化列表里一把定死，后面只读不写"。

### 1.21 友元（friend）— 尽量不用

#### 一、是什么

`friend` 让一个**外部函数**或**另一个类**拥有访问本类 `private` 成员的权限。
人话类比：你的银行卡密码是私有的（`private`），只有你自己能查。但你信任你老婆，在银行留了她的身份——她有"友元"身份，也可以查你的余额。

```cpp
class BankAccount {
    friend void showBalance(const BankAccount& acc);  // 声明：showBalance 是我的朋友
private:
    double balance = 1000.0;
};

void showBalance(const BankAccount& acc) {
    cout << acc.balance << endl;  // 朋友可以看私有成员
}
```

#### 二、核心规则

**规则 1：友元不是成员函数——不在类内部，没有 `this`**

```cpp
class Box {
    friend void open(const Box& b);  // 声明友元
private:
    int secret = 42;
};

void open(const Box& b) {
    cout << b.secret << endl;  // 通过对象访问，不是 this->secret
}
```

**规则 2：友元关系是单向的——A 是 B 的朋友，不代表 B 是 A 的朋友**

```cpp
class A {
    friend class B;  // B 可以访问 A 的私有
private:
    int a_secret = 1;
};

class B {
private:
    int b_secret = 2;
    void peek(A& a) { cout << a.a_secret; }  // OK：B 是 A 的朋友
};

// A 不能访问 B 的 b_secret，因为 A 不是 B 的朋友
```

**规则 3：友元关系不传递——A 是 B 的朋友，B 是 C 的朋友，不代表 A 是 C 的朋友**

```cpp
// 刘哥 → 我是刘哥的朋友 → 刘哥可以看我的私有
// 刘哥 → 老王是刘哥的朋友 → 老王可以看刘哥的私有
// 老王 → 我？我和老王没有直接 friend 关系，老王看不了我的私有
```

**规则 4：友元关系不继承——爸爸的朋友不是儿子的朋友**

```cpp
class Parent {
    friend class Doctor;  // Doctor 是 Parent 的朋友
private:
    int parentSecret = 1;
};

class Child : public Parent {
private:
    int childSecret = 2;
};

// Doctor 可以看 Parent 的 parentSecret
// Doctor 不能看 Child 的 childSecret（除非也显式声明 friend）
```

**规则 5：友元声明位置不限，放在 `public`/`private`/`protected` 区域效果一样**

```cpp
class Demo {
public:
    friend void f1();   // 访问权限区域对 friend 没影响
private:
    friend void f2();   // 放在 private 下面，朋友照样能访问
};
// f1 和 f2 的效果完全相同
```

#### 三、两种友元

**类型 1：友元函数（最常用）**

```cpp
class Point {
    friend double distance(const Point& a, const Point& b);  // 全局函数做朋友
private:
    double x, y;
public:
    Point(double x, double y) : x(x), y(y) {}
};

double distance(const Point& a, const Point& b) {
    double dx = a.x - b.x;  // 直接访问私有 x, y
    double dy = a.y - b.y;
    return sqrt(dx * dx + dy * dy);
}
```

**类型 2：友元类**

```cpp
class Engine {
    friend class Mechanic;  // 整个 Mechanic 类都是朋友
private:
    int rpm = 3000;
    double temperature = 90.5;
};

class Mechanic {
public:
    void diagnose(const Engine& e) {
        cout << "转速：" << e.rpm << endl;          // 直接访问
        cout << "温度：" << e.temperature << endl;  // 直接访问
    }
};
```

#### 四、什么时候用

**场景 1：需要访问两个类的私有数据——运算符重载**

```cpp
class Complex {
    friend Complex operator+(const Complex& a, const Complex& b);
private:
    double real, imag;
public:
    Complex(double r, double i) : real(r), imag(i) {}
};

Complex operator+(const Complex& a, const Complex& b) {
    return Complex(a.real + b.real, a.imag + b.imag);  // 需要同时访问两个对象的私有
}
```

**场景 2：全局函数操作你的对象内部**

```cpp
class Sensor {
    friend void calibrate(Sensor& s, double offset);  // 校准函数需要直接操作内部
private:
    double rawValue;
};

void calibrate(Sensor& s, double offset) {
    s.rawValue += offset;  // 只有朋友能这么做
}
```

#### 五、完整例子

```cpp
#include <iostream>
using namespace std;

class Motor {
    friend class MotorTester;                              // 友元类
    friend void printMotorState(const Motor& m);           // 友元函数

public:
    Motor(double torque, double speed) : mTorque(torque), mSpeed(speed) {}

private:
    double mTorque;  // N·m
    double mSpeed;   // rpm
};

// 友元函数：调试时直接看电机内部状态
void printMotorState(const Motor& m) {
    cout << "扭矩：" << m.mTorque << " N·m, 转速：" << m.mSpeed << " rpm" << endl;
}

// 友元类：测试台需要全面访问电机内部
class MotorTester {
public:
    void testLoad(Motor& m, double extraTorque) {
        m.mTorque += extraTorque;   // 测试时直接修改
        printMotorState(m);
    }

    void testOverload(Motor& m) {
        double old = m.mTorque;
        m.mTorque *= 1.5;           // 1.5 倍过载
        cout << "过载测试：" << old << " -> " << m.mTorque << " N·m" << endl;
        m.mTorque = old;            // 恢复
    }
};

int main() {
    Motor m(3.2, 1500);            // 3.2N·m, 1500rpm
    printMotorState(m);            // 友元函数查看

    MotorTester tester;
    tester.testLoad(m, 0.5);      // 友元类测试
    tester.testOverload(m);

    return 0;
}
```

#### 六、一个常见的纠结

> "友元破坏了封装性，是不是该少用？"

**该用就用。** 以下情况用 `friend` 是合理的：
- 运算符重载（比如 `operator<<` 输出对象内部状态）
- 测试类需要全面检查对象内部
- 两个类紧密协作（比如容器和它的迭代器）

不该用的情况：只是你想偷懒绕过 getter/setter——这种情况写个 public 接口才是正道。

---

**一句话总结：** `friend` 给外部函数或类开了一扇后门，让它们能访问你的私有成员。关系单向、不传递、不继承。最经典的用途是运算符重载和紧密耦合的类之间互相透底。

### 1.22 函数指针

> 普通（非成员）函数指针的语法和用法详见 [[C语言基础#7.7 函数指针|C语言基础 - 函数指针]]，本节只讲 C++ 特有的部分。

#### 一、C++ 的两种函数指针

C++ 里的函数指针分两种情况：

| 类型 | 指向目标 | 示例 |
|:-----|:-----|:-----|
| 普通函数指针 | 全局函数、静态成员函数 | `void (*p)(int) = func;` |
| 成员函数指针 | 类的非静态成员函数 | `void (Dog::*p)() = &Dog::bark;` |

两者**类型完全不同，不能互相转换**。截图里的报错就是这个原因：

```cpp
void (Dog::*pb)() = &Dog::bark;   // 成员函数指针
// 无法转换为 void (*)(void)       // 普通函数指针——类型不兼容
```

#### 二、成员函数指针——多了一个 `类名::`

```cpp
class Dog {
public:
    void bark() { cout << "汪汪" << endl; }
    void sit()  { cout << "坐下" << endl; }
};

// 声明：指向 Dog 的无参、返回 void 的成员函数
void (Dog::*pfunc)() = nullptr;

// 赋值：必须加 &，必须加类名限定
pfunc = &Dog::bark;

// 调用：必须通过对象或对象指针
Dog d;
(d.*pfunc)();        // 对象调用，用 .*
Dog* pd = &d;
(pd->*pfunc)();      // 指针调用，用 ->*
```

语法很难记？`typedef` 可以救命：

```cpp
typedef void (Dog::*DogAction)();   // 给类型起个短名
DogAction act = &Dog::bark;
(d.*act)();
```

#### 三、成员函数指针的应用——简单的命令映射

```cpp
class Robot {
public:
    void moveForward()  { cout << "前进" << endl; }
    void moveBackward() { cout << "后退" << endl; }
    void stop()         { cout << "停止" << endl; }

    void execute(int cmd) {
        static void (Robot::*table[])() = {
            &Robot::stop,         // 0
            &Robot::moveForward,  // 1
            &Robot::moveBackward  // 2
        };
        if (cmd >= 0 && cmd < 3)
            (this->*table[cmd])();
    }
};

Robot r;
r.execute(1);   // 前进
```

#### 四、现代 C++ 的替代方案：std::function

函数指针和成员函数指针各有各的类型，互不兼容。`std::function` 把它们统一了：

```cpp
#include <functional>

// std::function 可以装任何"可调用对象"
std::function<void()> f;

f = globalFunc;                     // 普通函数
f = [](void) { cout << "hi"; };    // lambda
f = std::bind(&Dog::bark, &d);     // 成员函数 + 对象

f();  // 统一调用方式
```

| | 函数指针 | std::function |
|:-----|:-----|:-----|
| 能绑普通函数 | 能 | 能 |
| 能绑 lambda | 仅无捕获的 lambda 可以 | 全部可以 |
| 能绑成员函数 | 需要单独的成员函数指针语法 | 能（配合 bind） |
| 类型检查 | 宽松（有隐式转换风险） | 严格 |
| 运行开销 | 几乎零（一个地址） | 有类型擦除开销 |
| 适用场景 | C API、嵌入式裸机 | 现代 C++ 应用代码 |

> [!tip] 选择原则
> **默认用 `std::function`**，可读性好、类型安全。性能敏感场景（嵌入式中断回调、大量循环调用）先用函数指针，再用 profiler 验证。

### 1.23 运算符重载

#### 一、是什么

运算符重载就是**让 `+`、`-`、== 、`<<` 这些运算符能作用于你自定义的类对象**。

人话类比：`+` 天生知道怎么加两个 `int`，但不知道两个 `Student` 对象怎么相加。运算符重载就是你**教编译器**："两个 Student 相加的意思是把他们的分数加起来"。

```cpp
// 没有运算符重载：只能写函数调用
Student s3 = s1.add(s2);   // 很别扭

// 有了运算符重载：直接用 +
Student s3 = s1 + s2;       // 自然、直观
```

#### 二、核心规则

**规则 1：只能重载已有运算符，不能自己造新的**

`+`、`-`、`*` 可以重载，但不能发明一个 `**` 表示幂运算。

**规则 2：不能重载的运算符只有 5 个**

| 运算符 | 不能重载的原因 |
|:---|:---|
| `.` 成员访问 | 语言最底层机制 |
| `.*` 成员指针访问 | 同上 |
| `::` 作用域分辨 | 同上 |
| `?:` 三目运算符 | 唯一的三元运算符，语法特殊 |
| `sizeof` | 编译期求值 |

除此之外，**其他所有运算符都可以重载**：`+` `-` `*` `/` `%`  ==  !=  `<` `>` `<=` `>=` =  `+=` `[]` `()` `->` `<<` `>>` `++` `--` `new` `delete` 等。

**规则 3：运算符的优先级和结合性不能改**

重载的 `+` 和原来的 `+` 优先级完全一样，编译器只是把 `+` 翻译成你的重载函数而已。

**规则 4：至少有一个操作数是自定义类型**

```cpp
int operator+(int a, int b);  // 错误！不能重载两个都是内置类型的操作数
```

**规则 5：两种实现方式——成员函数 或 友元函数**

| 实现方式 | 语法                                           | `a + b` 实际调用的是    | 适用场景               |
| :--- | :------------------------------------------- | :---------------- | :----------------- |
| 成员函数 | `T operator+(const T& b)`                    | `a.operator+(b)`  | 第一个操作数必须是你的类       |
| 友元函数 | `friend T operator+(const T& a, const T& b)` | `operator+(a, b)` | 两个操作数地位平等，或有隐式转换需求 |

```cpp
class Point {
public:
    // 方式1：成员函数——左操作数是 *this
    Point operator+(const Point& other) const {
        return Point(x + other.x, y + other.y);
    }
    // 方式2：友元函数——两个操作数都是参数
    friend Point operator-(const Point& a, const Point& b) {
        return Point(a.x - b.x, a.y - b.y);
    }
private:
    double x, y;
};
```


**规则 6：输入输出流的重载函数，必须使用全局函数重载**
> 为了支持链式编程，必须返回ostream流对象



#### 三、什么时候用

**场景 1：数学运算——像数字一样操作对象**

```cpp
Complex c1(3, 4), c2(1, 2);
Complex c3 = c1 + c2;    // 复数加法，数学直觉
Complex c4 = c1 * c2;    // 复数乘法
```

**场景 2：比较——让对象支持排序、查找**

```cpp
bool operator<(const Student& a, const Student& b) {
    return a.score < b.score;
}
vector<Student> students = {...};
sort(students.begin(), students.end());  // 按分数排序
```

**场景 3：流操作——打印和读取对象**

```cpp
ostream& operator<<(ostream& os, const Point& p) {
    os << "(" << p.x << ", " << p.y << ")";
    return os;   // 返回 os 本身，支持链式：cout << a << b
}
cout << p;   // 输出：(3, 4)
```

**场景 4：数组式访问——让对象像数组**

```cpp
class Vector3D {
    double data[3];
public:
    double& operator[](int i) { return data[i]; }
};
Vector3D v;
v[0] = 1.0;   // 像数组一样用
```

**场景 5：仿函数——让对象像函数一样被调用**

```cpp
class Multiply {
public:
    double operator()(double a, double b) { return a * b; }
};
Multiply mult;
double result = mult(3.0, 4.0);  // 对象名 + 括号 = 函数调用
```

#### 四、完整例子——最实用的几个重载

```cpp
#include <iostream>
using namespace std;

class Complex {
    // 重载 <<：打印复数（必须用友元，左操作数是 ostream）
    friend ostream& operator<<(ostream& os, const Complex& c) {
        os << c.real << " + " << c.imag << "i";
        return os;
    }
    // 重载 +：友元版（两个操作数对称）
    friend Complex operator+(const Complex& a, const Complex& b) {
        return Complex(a.real + b.real, a.imag + b.imag);
    }

public:
    Complex(double r = 0, double i = 0) : real(r), imag(i) {}

    // 重载 +=：成员函数版（修改自己，只能是成员函数）
    Complex& operator+=(const Complex& other) {
        real += other.real;
        imag += other.imag;
        return *this;
    }

    // 重载 ==：判断相等
    bool operator==(const Complex& other) const {
        return real == other.real && imag == other.imag;
    }

private:
    double real, imag;
};

int main() {
    Complex c1(3.0, 4.0), c2(1.0, 2.0);
    cout << c1 << endl;              // 3 + 4i
    cout << c1 + c2 << endl;         // 4 + 6i
    c1 += c2;
    cout << c1 << endl;              // 4 + 6i
    if (c1 == Complex(4, 6))
        cout << "相等" << endl;
    return 0;
}
```

#### 五、成员函数 vs 友元函数 速查

| 运算符                  | 推荐实现          | 原因                        |
| :------------------- | :------------ | :------------------------ |
| `=` `[]` `()` `->`   | **必须成员函数**    | 语言强制要求                    |
| `+=` `-=` `*=` 等复合赋值 | **成员函数**      | 修改自身状态                    |
| `++` `--`（前后置）       | **成员函数**      | 修改自身状态                    |
| == != `<` `>` 等比较    | 两者皆可，**偏好友元** | 两个操作数对称                   |
| `+` `-` `*` `/` 算术   | **偏好友元**      | 允许隐式转换作用于左操作数             |
| `<<` `>>` 流操作        | **必须友元**      | 左操作数是 `ostream`/`istream` |

#### 六、一个容易踩的坑

1. **意义应该"显然"**：`+` 表示加法/拼接可以，但如果 `+` 用来发送网络请求就是滥用
2. **相关运算符要成对重载**：重载了 == 就必须重载 `!=`，重载了 `<` 就应考虑 `>` `<=` `>=`

### 1.24 成员函数重载 vs 全局函数重载

运算符重载有两种写法，底层一样（最终都是函数调用），但适用场景不同。

#### 一、两种写法对比

```cpp
class Point {
public:
    // 成员函数重载：左操作数固定是 *this
    Point operator+(const Point& other) const {
        return Point(x + other.x, y + other.y);
    }
private:
    double x, y;
};

// 全局函数重载：两个操作数都是参数，地位平等
Point operator-(const Point& a, const Point& b) {
    return Point(a.x - b.x, a.y - b.y);
}
```

调用时完全相同：

```cpp
Point p1(1, 2), p2(3, 4);
p1 + p2;   // 调用 p1.operator+(p2)  —— 成员函数版
p1 - p2;   // 调用 operator-(p1, p2)  —— 全局函数版
```

编译器遇到 `a + b` 时，两种形式都会尝试。

#### 二、核心规则

**规则 1：只有 4 个运算符必须用成员函数**

| 运算符 | 必须成员的原因 |
|:---|:---|
| `=` 赋值 | 语言强制——赋值必须是左操作数自身的操作 |
| `[]` 下标 | 同上 |
| `()` 函数调用 | 同上 |
| `->` 箭头 | 同上 |

除此之外，其他运算符成员或全局都可以。

**规则 2：全局函数需要访问私有成员时要加 `friend`**

```cpp
class Point {
    friend Point operator+(const Point& a, const Point& b);
private:
    double x, y;
};
Point operator+(const Point& a, const Point& b) {
    return Point(a.x + b.x, a.y + b.y);  // friend 才能访问私有
}
```

如果类已经提供了 `getX()` / `getY()` 这类公有接口，全局函数也可以不靠 `friend`——直接用公有接口实现，封装更好。

**规则 3：全局函数必须在类外定义**

```cpp
class Point {
    Point operator+(const Point& b);   // 成员函数——声明在类内
    // 全局函数不能声明在类内（除非加 friend）
};
Point operator-(const Point& a, const Point& b);  // 全局函数——在类外
```

#### 三、什么时候选哪种

| 情况                               | 推荐       | 原因                     |
| :------------------------------- | :------- | :--------------------- |
| 左操作数**可能不是你的类**（如 `cout << obj`） | **必须全局** | 左操作数是 `ostream`，不是你写的类 |
| 两个操作数**地位完全对称**（`+`、== 、`<`）     | **偏好全局** | 允许两边都做隐式转换             |
| 修改左操作数自身（`+=`、`++`、`=`）          | **必须成员** | 操作的就是 `*this`          |
| 类型转换——左操作数需要隐式转换                 | **必须全局** | 成员函数不会对左操作数做隐式转换       |

**关键区别——隐式转换只对全局函数的左操作数生效：**

```cpp
class Number {
public:
    Number(int v) : val(v) {}  // 允许 int 隐式转为 Number
    Number operator+(const Number& b) const { return Number(val + b.val); }
private:
    int val;
};

Number n(10);
n + 5;   // OK：5 隐式转为 Number(5)，调用 n.operator+(Number(5))
5 + n;   // 错误！5 是 int，没有 operator+ 成员，左操作数不转换

// 加了全局版之后（需要 friend 或公有接口）：
Number operator+(const Number& a, const Number& b) { ... }
5 + n;   // OK：5 隐式转为 Number(5)
```

这就是"对称操作应该用全局函数"的核心原因。

#### 四、完整例子

```cpp
#include <iostream>
using namespace std;

class Vector2D {
    // 全局函数：对称运算用 friend
    friend ostream& operator<<(ostream& os, const Vector2D& v);
    friend Vector2D operator+(const Vector2D& a, const Vector2D& b);

public:
    Vector2D(double x = 0, double y = 0) : mX(x), mY(y) {}

    // 成员函数：修改自身的
    Vector2D& operator+=(const Vector2D& other) {
        mX += other.mX;
        mY += other.mY;
        return *this;
    }

    Vector2D& operator*=(double scalar) {
        mX *= scalar;
        mY *= scalar;
        return *this;
    }

    // 成员函数：必须用成员的运算符
    double operator[](int i) const {
        return i == 0 ? mX : mY;
    }

private:
    double mX, mY;
};

// 全局函数：对称算术
Vector2D operator+(const Vector2D& a, const Vector2D& b) {
    return Vector2D(a.mX + b.mX, a.mY + b.mY);
}

// 全局函数：流输出（左操作数是 ostream，只能全局）
ostream& operator<<(ostream& os, const Vector2D& v) {
    os << "(" << v.mX << ", " << v.mY << ")";
    return os;
}

// 全局函数：比较（用公有接口，不需要 friend）
bool operator==(const Vector2D& a, const Vector2D& b) {
    return a[0] == b[0] && a[1] == b[1];
}

int main() {
    Vector2D v1(1, 2), v2(3, 4);

    cout << v1 + v2 << endl;     // (4, 6)  —— 全局 operator+
    v1 += v2;
    cout << v1 << endl;          // (4, 6)  —— 成员 operator+=
    if (v1 == Vector2D(4, 6))
        cout << "相等" << endl;  // 全局 operator==

    return 0;
}
```

#### 五、速记表

|           | 成员函数版                          | 全局函数版                      |
| :-------- | :----------------------------- | :------------------------- |
| 左操作数      | 必须是本类对象                        | 任意类型                       |
| 声明位置      | 类内                             | 类外（或类内用 `friend`）          |
| 访问私有      | 直接访问                           | 需要 `friend` 或走公有接口         |
| 隐式转换对左操作数 | **不生效**                        | 生效                         |
| 适合哪类运算符   | ` = ` `[]` `()` `->` `+=` `++` | `+` `-`  ==  `<` `<<` `>>` |



### 1.25 类的继承
#### 一、继承是什么——一句话

**继承是一种在已有类型的基础上、通过添加或改写成员来构建新类型的机制。新类型"是一种"（is-a）旧类型。**

- 例子1：这就像生物分类：哺乳动物有"胎生、哺乳"等特征。你说"狗是哺乳动物"，狗自动继承了哺乳动物的所有特征，然后再加上"汪汪叫、摇尾巴"这类狗独有的东西。你不需要从零开始描述一只狗，你只需要描述**它和一般哺乳动物不同的那部分**。

- 例子2：子类对象的内存布局里，父类的成员实实在在地躺在里面，不是什么引用、指针、拷贝——它就是子类对象身体的一部分。可以想象成子类是在父类的基础上"长"出来的，父类的肉和子类自己的肉拼在一起，构成了一个完整的对象。

C++ 里一样的：
```cpp
class Animal {
public:
    void eat()  { /* 吃东西 */ }
    void sleep() { /* 睡觉 */ }
};

class Dog : public Animal {   // Dog 继承 Animal
public:
    void bark() { /* 汪汪叫——Dog 独有的 */ }
};

Dog d;
d.eat();    // OK——从 Animal 继承来的
d.sleep();  // OK——从 Animal 继承来的
d.bark();   // OK——Dog 自己的
```

注意这个 `: public Animal`——这就是继承声明，读作"Dog 公开继承自 Animal"。Dog 不写一行代码就拥有了 eat 和 sleep。

---

#### 二、继承解决什么问题

三个核心作用：

**1. 代码复用——不写重复代码**

没有继承时，假设你有 Car 和 Truck 两个类，它们都有 speed、position、start()、stop()。你只能在每个类里各写一遍——代码重复、改一处漏一处。

有了继承，把公共部分提到 Vehicle 基类，Car 和 Truck 只写各自特有的部分：

```cpp
class Vehicle {
protected:
    double speed;
    double position;
public:
    void start() { /* 通用启动逻辑 */ }
    void stop()  { /* 通用停止逻辑 */ }
};

class Car : public Vehicle {
    int passenger_count;  // Car 特有
};

class Truck : public Vehicle {
    double cargo_weight;  // Truck 特有
};
```

**2. 多态——用统一接口操作不同对象**

这是继承最重要的工程价值。一堆不同类型的对象，如果它们继承自同一个基类，你就可以通过基类指针/引用来统一操作它们，而不需要知道具体是哪个子类：

```cpp
Vehicle* fleet[3];
fleet[0] = new Car();
fleet[1] = new Truck();
fleet[2] = new Car();

for (auto v : fleet) {
    v->start();  // 不管是 Car 还是 Truck，都能启动
}
```

**3. 对现实世界层级关系的直接建模**

你在做线控底盘系统时，这种建模特别自然：`Actuator` → `BrakeActuator` / `SteerActuator` / `ThrottleActuator`。每个执行器有公共接口（init、selfTest、actuate），子类实现具体行为。代码结构直接反映系统结构——这就是我设计 class 和继承的初衷：让代码**直接表达设计意图**。

#### 三、使用规则

##### 规则一：只用在"is-a"关系上
```cpp
// ✓ Dog is-a Animal——正确
class Dog : public Animal { };

// ✗ Car has-a Engine——应该用组合，不是继承！
class Car : public Engine { };  // 错误！车不是引擎
```

判断口诀：**"B 是一种 A"说得通，才用继承。** "狗是一种动物"说得通。"车是一种引擎"说不通——车**有**引擎，应该把 Engine 作为 Car 的成员变量（这就是"组合"）。

##### 规则二：基类析构函数必须是 virtual

核心原则：**只要一个类被设计成"可以被继承"，它的析构函数就应该写 `virtual`。**

###### 为什么会有问题

如果父类析构不是 virtual，通过父类指针 `delete` 子类对象时，子类的析构函数不会被调用——子类自己申请的资源就泄漏了：

```cpp
class Animal {
public:
    ~Animal() { /* 非虚析构 */ }
};

class Dog : public Animal {
    int* data;
public:
    Dog()  { data = new int[100]; }
    ~Dog() { delete[] data; }  // 这个永远不会被调到！
};

Animal* p = new Dog();
delete p;  // 只调了 ~Animal，Dog::data 泄漏 100 个 int
```

`delete p` 时编译器只看指针的**静态类型** `Animal*`，不知道它实际指向 `Dog`。如果不是虚函数，它就只调用 `~Animal()`，`Dog` 自己的清理工作全被跳过了。

> [!tip] 人话类比——退房
> 你要退房（delete），房东只看你登记的身份（指针类型）。你的身份是"租客（Animal）"而不是"养狗的租客（Dog）"，房东就按普通租客的退房流程走——狗（Dog::data）就落在屋里了。虚析构函数相当于在身份登记上加了句"此人是养狗的，退房时请走特殊流程"。

###### 什么时候可以不用虚析构

| 场景 | 说明 |
|------|------|
| 类不会被继承 | 直接加 `final` 标记更明确 |
| 永远不会通过父类指针 `delete` 子类对象 | 比如栈上对象、智能指针直接持有子类类型 |
| 父类析构本身不需要做什么事 | 但依赖这点是侥幸心理，不推荐 |

###### 工程上的简单规则

> **1. 如果类里已经有任何虚函数，析构函数就应该也是虚的。**
> **2. 如果不打算被继承，析构函数不要加 virtual（省掉 vtable 开销）。**

Scott Meyers 在 Effective C++ 中的建议：如果类里有任何虚函数（说明你打算让子类重写行为），析构函数就应该也是虚的——因为多态的类大概率会被多态地使用。反过来，没有任何虚函数且不打算被继承的类，就别加 `virtual`。

简记：**不打算被继承 → 不加 virtual；打算被继承 → 析构必虚。**

##### 规则三：区分三种继承方式

| 继承方式      | 基类public成员  | 基类protected成员 | 基类private成员 | 含义                                 |
| :-------- | :---------- | :------------ | :---------- | ---------------------------------- |
| public    | 子类public    | 子类为protected  | 不可见         | "is-a"，最常用                         |
| protected | 子类protected | 子类为protected  | 不可见         | "is-implemented-in-terms-of"，罕见    |
| private   | 子类private   | 子类为private    | 不可见         | "is-implemented-in-terms-of"，用组合更好 |
> [!tip]  不同的继承方式会改变继承成员的访问属性
1.  **public继承**：父类成员在子类中保持原有访问级别
2.  **private继承**：父类成员在子类中变为private成员
3.  **protected继承**：父类中public成员会变成protected
    - 父类中protected成员仍然为protected
    - 父类中private成员仍然为private

private成员在子类中*依然存在*，但是却无法访问到。不论哪种方式继承，派生类都不能直接使用基类的私有成员。(可以通过提供接口访问)
 > [!example]  子类 = 派生类 =  继承

> [!caution] 如何恰当的使用public、protected、private为成员声明访问级别
1. 需要被外界访问的成员直接设置为 `public`
2. 只能在当前类中访问的成员设置为 `private`
3. 只能在当前类和子类中访问的成员设置为`protected`
4. 一般情况下没有特殊要求均使用`public`

---
##### 规则四：不想被继承就标记 final

```cpp
class Widget final {  // 此类不能被继承
    // ...
};
```

如果你设计了一个类但不希望别人继承它（比如继承会破坏它的不变量），用 `final` 明确表达这个意图。这也是给编译器优化机会。

##### 规则五：用 override 明确表达"我在改写"

```cpp
class Vehicle {
public:
    virtual void start() { /* 默认实现 */ }
};

class Car : public Vehicle {
public:
    void start() override { /* Car 特有的启动逻辑 */ }
    //          ^^^^^^^^  如果写错了签名，编译器会报错——不会悄悄地变成一个新函数
};
```

`override` 有两个好处：(1) 告诉读代码的人"这个函数是改写的"，一眼看出设计意图；(2) 让编译器帮你检查——如果你不小心把 `start` 拼成了 `strat`，编译器会说"基类没有这个虚函数可以改写"，而不是默默地创建一个新函数。


##### 规则六：子类必须调用父类初始化进行继承成员的初始化
```cpp
class Father {
public:
	Father(int money):mmoney(money){} //父类初始化
	int GetMoney() { return mmoney; }
protected:
	int mmoney;
};

class Child : public Father {
public:
	//子类初始化 = 父类继承成员初始化 + 自身成员初始化
	Child(int money, std::string girlname):Father(money),girlfriend{girlname}{} 
	std::string& GetGirlfriend(void) {
		return girlfriend;
	}
protected:
	std::string girlfriend;
};
```

> [!tip] 如果子类没有新成员，可以直接使用父类的构造函数初始化 `using A::A` 
```cpp
class Father {
public:
	Father(int money):mmoney(money){} //父类初始化
protected:
	int mmoney;
};

class Child : public Father {
public:
	using Father::Father(int money); //初始化时可以直接利用该构造
protected:
	std::string girlfriend;
};
```


##### 规则七：析构与构造

在继承关系中
1. 构造函数：先调用父类再调用子类（父类→组合类→子类）
2. 析构函数：先调用子类再调用父类



---

#### 四、一个完整的嵌入式例子

```cpp
// 基类：所有执行器的公共接口
class Actuator {
protected:
    bool is_initialized;
    uint8_t fault_code;

public:
    virtual ~Actuator() = default;

    virtual bool init() = 0;      // 纯虚函数——每个子类必须实现
    virtual bool selfTest() = 0;  // 纯虚函数
    virtual void actuate(double cmd) = 0;

    uint8_t getFault() const { return fault_code; }
};

// 制动执行器
class BrakeActuator : public Actuator {
    double max_pressure;
    double current_pressure;

public:
    BrakeActuator(double max_mpa) : max_pressure(max_mpa), current_pressure(0) { }

    bool init() override {
        // 初始化制动相关硬件：PWM、ADC、压力传感器
        is_initialized = true;
        return true;
    }

    bool selfTest() override {
        // 制动自检：泄压→建压→保压，检测传感器读数
        return true;
    }

    void actuate(double cmd) override {
        // cmd: 目标制动压力 (MPa)
        current_pressure = cmd;
        // PWM 输出...
    }
};

// 转向执行器
class SteerActuator : public Actuator {
    double max_angle;
    double current_angle;

public:
    SteerActuator(double max_deg) : max_angle(max_deg), current_angle(0) { }

    bool init() override {
        // 初始化转向电机、角度传感器
        is_initialized = true;
        return true;
    }

    bool selfTest() override {
        // 转向自检：左右打到底，检查角度反馈
        return true;
    }

    void actuate(double cmd) override {
        // cmd: 目标转角 (deg)
        current_angle = cmd;
        // CAN 发指令给转向电机...
    }
};

// 使用：统一的调度循环
int main() {
    Actuator* actuators[] = {
        new BrakeActuator(12.0),   // 最大压力 12MPa
        new SteerActuator(540.0)   // 最大转角 540°
    };

    // 统一初始化
    for (auto act : actuators) {
        act->init();
        act->selfTest();
    }

    // 运行时统一调度
    while (1) {
        double brake_cmd = calcBrakeCommand();
        double steer_cmd = calcSteerCommand();

        actuators[0]->actuate(brake_cmd);  // 制动
        actuators[1]->actuate(steer_cmd);  // 转向

        // 故障检测
        for (auto act : actuators) {
            if (act->getFault() != 0) {
                enterSafeMode();
            }
        }
    }
}
```

这里的关键设计决策：
- **公共部分**（fault_code、is_initialized、getFault()）在基类 Actuator 里——只写一次
- **差异化行为**（init、selfTest、actuate）是纯虚函数——强制每个子类必须实现，漏写了编译器不让你过
- **统一调度**：一个 Actuator 指针数组，循环调用——增加新执行器（油门、悬架）时，调度代码一行不改

这就是继承的正确用法：**用基类定义"是什么接口"，子类实现"怎么做"**。不是为偷懒少写几行代码，而是让系统的扩展性和局部化的修改成为一个自然的结果。

### 1.26 类型兼容性原则

#### 一、是什么

类型兼容性原则说的是：**派生类（子类）对象可以当作基类（父类）对象来用**。编译器默认允许，不需要显式类型转换。

类型兼容性共有 **5 种具体体现**，本质上都是同一条逻辑——向上转型（upcasting），即把*子类当成父类*来看：

---

**1. 子类对象可以当作父类对象使用**

只要是需要父类对象的地方，都可以直接传子类对象进去：

```cpp
class Father {
public:
    void show() const { cout << "我是爸爸" << endl; }
};
class Child : public Father {
public:
    void cry() const { cout << "哇哇大哭" << endl; }
};

// 函数形参是父类引用，实参可以传子类对象
void introduce(const Father& f) {
    f.show();   // 子类当父类用——函数只关心"是个人"，不关心是爸还是娃
}

int main() {
    Child son;
    introduce(son);   // ✅ 子类对象当作父类对象使用
    return 0;
}
```

**2. 子类对象可以直接赋值给父类对象**

```cpp
Child son;
Father dad;
dad = son;   // ✅ 子类对象赋值给父类对象
// 注意：赋值时发生切片（slicing），dad 只拷贝了 Father 那部分数据
```

**3. 子类对象可以直接初始化父类对象**

```cpp
Child son;
Father dad(son);    // ✅ 用子类对象初始化父类对象
Father dad2 = son;  // ✅ 等价写法，同样发生切片
```

> [!warning] 注意 2 和 3 的区别
> 赋值用 `=`，初始化用 `()` 或 `= xxx`（声明 + 初始化在同一行）。
> 两者都会发生**切片（slicing）**——新创建的父类对象只包含父类的成员，子类特有部分被切掉。

**4. 父类指针可以直接指向子类对象**

```cpp
Child son;
Father* p = &son;       // ✅ 父类指针指向子类对象
p->show();              // 通过父类指针调用父类的方法
```

**5. 父类引用可以直接引用子类对象**

```cpp
Child son;
Father& ref = son;      // ✅ 父类引用绑定到子类对象
ref.show();             // 通过父类引用调用父类的方法
```

> [!tip] 指针和引用不会切片
> 4 和 5 只存了地址/别名，不复制对象本身，所以子类的完整数据还在。这也是多态必须通过指针或引用实现的原因。

---

**5 种形式速记表**：

| 形式 | 语法示例 | 是否切片 |
|:-----|:-----|:-----|
| 子类当父类用（传参） | `func(Child_obj)` → 接受 `const Father&` | 否（引用） |
| 子类赋值给父类 | `dad = son;` | **是** |
| 子类初始化父类 | `Father dad(son);` | **是** |
| 父类指针指向子类 | `Father* p = &son;` | 否 |
| 父类引用绑定子类 | `Father& r = son;` | 否 |

人话类比：你说"狗是动物"——这句话在逻辑上天然成立。类型兼容性就是让 C++ 的类型系统也承认这件事：`Dog` 对象出现在需要 `Animal` 的地方，编译器自动放行。

**类型兼容性在内存层面是怎么成立的？**

类型兼容性不是语法糖——它是 C++ 对象内存布局的直接结果。子类对象在内存里**把父类部分放在最前面**，后面再拼接子类自己的成员。所以父类指针指向子类对象时，它看到的开头刚好就是父类那部分数据。

用前面 `Father` / `Child` 的例子来看（假设 64 位系统，`int` 4 字节，`string` 32 字节）：

```
Father 对象                Child 对象
┌──────────────┐          ┌──────────────┐
│  m_money     │ ← int    │  m_money     │ ← 继承自 Father，在最前面
│  (4 bytes)   │          │  (4 bytes)   │
│              │          │              │
└──────────────┘          ├──────────────┤
                          │  girlfriend  │ ← Child 自己的成员，接在后面
                          │  (32 bytes)  │
                          │              │
                          └──────────────┘

Father* p = &son;  →  p 指向 Child 对象的起始地址
                       p 看到的前 4 字节正好是 m_money
                       所以 p->GetMoney() 完全正常工作
```

这张图说明了类型兼容性的所有行为：

| 现象 | 内存层面的原因 |
|:-----|:-----|
| 父类指针/引用可以指向子类 | 父类部分的起始地址 = 子类对象的起始地址 |
| 通过父类指针只能访问父类成员 | 指针类型决定了"能看到多大范围"，`Father*` 只能看到前 4 字节 |
| 传值会发生切片 | 拷贝只按 `Father` 的大小拷贝——子类多出来的部分被裁掉 |
| 指针/引用不切片 | 存的只是地址，原始对象完整躺在那里，一个字节不少 |

> [!tip] 这是 C++ 零开销抽象的体现
> `Father* p = &son;` 编译后就是一条赋值指令——没有类型检查、没有额外的间接跳转。C++ 的设计原则是"你不用的东西不花钱"，类型兼容性在运行时完全零开销。

#### 二、为什么重要——它不只是语法糖

类型兼容性是 C++ 面向对象部分的**整个地基**。没有它，继承就只剩代码复用了——而那恰恰是最无聊、最危险的用法。

**核心价值：针对接口编程，而非针对实现编程。**

```cpp
// 不用类型兼容性——每加一个子类就要加重载
void doSomething(Child& c)    { c.action(); }
void doSomething(Daughter& d) { d.action(); }
void doSomething(Bastard& b)  { b.action(); }

// 用类型兼容性——一个函数搞定所有
void doSomething(Father& f) {   // 接受所有 Father 的派生类
    f.action();                 // 写代码时针对基类接口，运行时走子类实现
}
```

**类型兼容性 + 虚函数 = 多态**。缺一个都不成立：
- 类型兼容性让"用基类接口操作子类对象"在**语法上**可行
- 虚函数让它在**语义上**正确（调的是实际子类的函数，不是基类的）

#### 三、三条规则，决定它在你代码里怎么体现

**规则一：传指针或引用，才能保留多态性。传值会把子类的部分切掉（slicing）。**

```cpp
void byValue(Father f) { f.ShowFather(); }    // 切片！传的是 Father 的拷贝
void byRef(Father& f)  { f.ShowFather(); }    // 正常，保留实际类型
void byPtr(Father* p)  { p->ShowFather(); }   // 同上
```

`byValue(son)` 编译不会报错——类型兼容性原则允许 `Child` 传给 `Father` 参数——但进去之后它就只是一个 `Father` 对象了，子类部分被静默切除。这是 C++ 里最安静的 bug 之一。

**规则二：基类析构必须是虚的。否则通过基类指针 delete 子类是未定义行为。**

```cpp
class Father {
public:
    virtual ~Father() {}   // 少了这个，下面就是定时炸弹
};

Father* p = new Child(10);
delete p;   // 非虚析构 → 可能只释放了 Father 部分，Child 的资源泄漏了
```

类型兼容性 → 基类指针持有子类对象 → 你迟早要释放它 → 析构函数必须是虚的。这是一条因果链。

**规则三：类型安全的容器和算法都依赖类型兼容性。**

```cpp
std::vector<Father*> family;    // 一个容器装不同子类
family.push_back(new Child(10));
family.push_back(new Daughter(8));

for (auto* p : family) {
    p->ShowFather();    // 同一段代码，不同的实际行为（如果 ShowFather 是虚函数）
}
```

没有类型兼容性，`vector<Father*>` 就只能装 `Father` 对象——多态编程直接退回到 C 时代的函数指针表。

#### 四、同名遮蔽（name hiding）——继承里最容易静默出错的坑

子类中任何与父类同名的成员，都会**遮蔽**父类的那个成员——不管类型同不同、参数同不同。编译器按名字查找，在子类找到就停，父类的版本全部不可见。

**1. 变量遮蔽——编译零警告，结果错误**

```cpp
class Father {
protected:
    int value = 42;
public:
    int getValue() const { return value; }
};

class Child : public Father {
protected:
    double value = 3.14;   // 遮蔽了 Father::value！类型不同照样遮
public:
    Child() : value(3.14) {}  // 初始化的是 Child::value
    void update() {
        value = 99.9;       // 改的是 Child::value，Father::value 纹丝不动
    }
};

Child c;
c.update();
cout << c.getValue() << endl;  // 输出 42！！！因为 getValue() 在 Father 里，
                               // 它看到的 value 是 Father::value
```

**2. 函数遮蔽——所有重载版本一起消失**

```cpp
class Actuator {
public:
    void calibrate()          { /* 零参数校准 */ }
    void calibrate(double ref) { /* 参考值校准 */ }
};

class BrakeActuator : public Actuator {
public:
    void calibrate(double ref, int channel) { /* 只加了一个新版本 */ }
    // 但是 calibrate() 和 calibrate(double) 全部被遮蔽了！
};

BrakeActuator ba;
ba.calibrate();            // ❌ 编译错误！明明父类有无参版本
ba.calibrate(5.0);         // ❌ 编译错误！
ba.calibrate(5.0, 2);      // ✅ 只有这个能用
```

函数遮蔽比变量遮蔽好一点——至少编译器会报错。但如果你是接手别人代码，你可能花一下午才搞清楚："明明白白父类有这个函数，怎么会找不到？"

**3. 解决方式：不要定义同名变量；如果需要扩展函数，用 `using` 拉下来**

```cpp
class BrakeActuator : public Actuator {
public:
    using Actuator::calibrate;  // 把父类所有 calibrate 重载拉进子类
    void calibrate(double ref, int channel);  // 再加自己的新版本
    // 现在 calibrate()、calibrate(double)、calibrate(double, int) 全部可用
};
```

> [!tip] 核心原则
> **不要在子类重复定义父类已有的数据成员。** 父类的 `protected` 成员直接拿来用——子类对象内存里本来就有它们，不需要你再声明一遍。你写的是"第二份相同名字但完全独立的数据"，结果是"一个对象里有两份值，谁改谁的完全取决于你走哪个接口"。

#### 五、要点

- **永远用指针或引用持有派生类对象**。传值是切片的邀请函。
- **基类必须有虚析构**——除非你百分之百确定没有人会通过基类指针释放子类。但别人的代码你控制不了，所以加上它。
- **倾向于针对基类接口编程**。类型兼容性的价值不在于"能省几个重载"，而在于它迫使你思考：子类的共同契约是什么？这个契约就是你抽象出来的基类接口。
- **类型兼容性原则决定了 C++ 面向对象代码的组织方式**：函数参数用基类引用/指针，容器存基类指针，新增子类时依赖基类接口的代码一行都不应该改。做不到这些，继承和一个花哨的命名空间没区别。
- **不要在子类定义和父类同名的变量。** 如果函数需要扩展，用 `using Base::funcName;` 拉下来再加新版本。

### 1.27 static 在继承中的行为

#### 一、核心规则：static 成员只有一份，不属于任何对象

static 变量存储在全局数据区，与对象的继承布局**毫无关系**。子类继承父类时，不会为子类"拷贝"一份 static 变量——`Child::count` 本质上只是 `Father::count` 的别名。

```cpp
class Father {
public:
    static int count;
};
int Father::count = 0;        // 必须在类外定义并初始化

class Child : public Father { };

Father dad;
Child  son;

dad.count  = 1;
son.count  = 2;              // 改的是同一个 count！
Father::count = 3;

cout << Father::count << endl;   // 3——同一个变量
cout << Child::count  << endl;   // 3——Child 没有自己的 count，还是 Father 的
cout << dad.count   << endl;     // 3
cout << son.count   << endl;     // 3
```

内存视角：

```
对象内存布局（每个对象一份）：        全局数据区（整个类只有一份）：
┌──────────────────┐                ┌────────────────┐
│ Father::mname    │                │ Father::count  │ ← 就这一个，所有对象共享
│ Father::mage     │                └────────────────┘
│ (子类自有成员)    │
└──────────────────┘
```

#### 二、两种实际用法

**用法 1：统计整个类家族的实例总数**

```cpp
class Actuator {
protected:
    static int totalActuators;     // 所有执行器共用
public:
    Actuator()   { totalActuators++; }
    ~Actuator()  { totalActuators--; }
    static int getTotal() { return totalActuators; }
};
int Actuator::totalActuators = 0;

class BrakeActuator : public Actuator { };
class SteerActuator : public Actuator { };

BrakeActuator b1, b2;
SteerActuator s1;
cout << Actuator::getTotal();   // 3——所有子类都算在一起
```

这里子类不需要做任何额外的事——构造时自动调父类构造，父类构造里 `totalActuators++`。

**用法 2：每个子类需要自己的计数器——子类单独声明 static 变量**

```cpp
class Actuator {
protected:
    static int totalActuators;   // 全局总数
public:
    Actuator() { totalActuators++; }
    static int getTotal() { return totalActuators; }
};
int Actuator::totalActuators = 0;

class BrakeActuator : public Actuator {
public:
    static int brakeCount;       // BrakeActuator 自己的计数器
    BrakeActuator() { brakeCount++; }
};
int BrakeActuator::brakeCount = 0;

class SteerActuator : public Actuator {
public:
    static int steerCount;       // SteerActuator 自己的计数器
    SteerActuator() { steerCount++; }
};
int SteerActuator::steerCount = 0;
```

`brakeCount` 和 `steerCount` 各自独立，跟父类的 `totalActuators` 也无关。这不是什么语法特性——就是普通的"每个类声明自己的 static 成员"。

#### 三、静态成员函数同理

```cpp
class Father {
public:
    static void info() { cout << "Father" << endl; }
};

class Child : public Father {
public:
    static void info() { cout << "Child" << endl; }  // 子类自己定义了一个同名静态函数
};

Father::info();   // "Father"
Child::info();    // "Child"——这不算"覆盖"，是两个独立的静态函数
```

如果子类没有定义自己的 `info()`，那 `Child::info()` 调的就是 `Father::info()`。

#### 四、要点

- **父类的 static 成员，子类只继承访问权，不继承"数据"**——数据只有一份，属于父类
- **`Child::staticVar` 本质上是 `Father::staticVar` 的别名**——除非子类自己单独声明了一个同名 static
- **静态成员函数没有多态**——它不通过对象调用，不走虚函数表，只看类名
- **需要每个子类有自己的计数器时**，在子类里单独声明一个 static 变量——跟普通的"每个类有自己的成员"一样，不涉及继承机制

### 1.28 C/C++ 程序内存布局

一个运行中的 C/C++ 程序，内存从低地址到高地址分成 6 个区域：

```
高地址
┌─────────────┐
│    栈区     │ ← 局部变量、函数参数、返回地址。后进先出，自动管理
│   (Stack)   │   向低地址方向增长
├─ ↓  ── ↓ ──┤
│    空隙     │   栈和堆之间的预留空间
├─ ↑  ── ↑ ──┤
│    堆区     │ ← new/malloc 分配的内存。向高地址方向增长
│   (Heap)    │   手动管理，不释放就泄漏
├─────────────┤
│  BSS 段     │ ← 未初始化或初始化为 0 的全局变量/静态变量
├─────────────┤
│  DATA 段    │ ← 已初始化且初值非 0 的全局变量/静态变量
├─────────────┤
│ 常量区      │ ← 字符串字面量、const 全局常量
│ (.rodata)   │   只读，写操作触发段错误
├─────────────┤
│ 代码段      │ ← 程序的机器指令、函数体
│  (.text)    │   只读，不可修改
低地址
```

#### 一、各区详解

**1. 代码段（.text）**

存放编译后的机器指令。你写的每个函数体都变成指令存在这里。

```cpp
void func() {          // func 的机器指令存在代码段
    int a = 1;         // 这条赋值也编译成指令存于此
}
```

- 只读：试图写代码段会触发段错误（Segmentation Fault）
- 函数指针指向的就是这片区域
- 嵌入式对应：STM32 的 Flash 区域，掉电不丢失

**2. 常量区（.rodata）——只读数据**

```cpp
const char* p = "hello";   // "hello" 存在 .rodata，p 本身在栈上
const int MAX = 100;       // 全局 const 放在 .rodata
```

- 存放：字符串字面量、`const` 修饰的全局变量
- 试图修改 `"hello"[0] = 'H'` 会导致崩溃
- 嵌入式：也可以放在 Flash 里，节省 RAM

**3. DATA 段——已初始化且初值非 0 的全局/静态变量**

```cpp
int g_count = 10;          // DATA 段——有非零初值
static int s_id = 1;       // DATA 段
```

- 初值在程序加载时就写好了
- 嵌入式：初值从 Flash 拷贝到 RAM，启动代码负责这件事

**4. BSS 段——未初始化或初始化为 0 的全局/静态变量**

```cpp
int g_buffer[1024];        // BSS 段——没初始化
static int s_counter;      // BSS 段——初始化为 0
```

- 程序启动时被自动清零
- **不占可执行文件体积**——DATA 段需要存初值，BSS 段只需要记录"这块要多大空间"
- 嵌入式：启动代码跑 `memset` 清空 BSS 区域

**5. 堆区（Heap）——手动申请、手动释放**

```cpp
int* p = new int(42);      // 堆上分配 4 字节
int* arr = new int[100];   // 堆上分配 400 字节
delete p;                  // 释放！不释放就内存泄漏
delete[] arr;
```

- `new`/`malloc` 从这里拿内存，`delete`/`free` 还回去
- 忘了释放 → 内存泄漏（程序跑久了可用内存越来越少）
- 释放了还继续用 → 悬空指针（指向已归还的内存，行为未定义）

**6. 栈区（Stack）——编译器自动管理**

```cpp
void func(int param) {     // param 压栈
    int a = 10;            // a 压栈（先声明的在高地址）
    double b = 3.14;       // b 压栈
}                          // 函数结束，a、b、param 自动弹出，零开销
```

- 后进先出（LIFO）：先入栈的变量后出栈
- `}` 就是隐式的"弹栈"指令——出了作用域，栈上那块空间直接回收，只需要移动一下栈指针
- 嵌入式特别注意：MCU 的栈通常只有几 KB（STM32 默认约 1KB），大数组放栈上有**栈溢出**风险——溢出后数据覆盖到堆或全局区，导致变量莫名其妙被改、程序跑飞

```cpp
// 嵌入式反例：函数里的大数组
void process() {
    int buf[2048];   // 2KB 的数组直接压在栈上——STM32 默认栈才 1KB，直接溢出！
    // ...
}

// 正确做法：用 static 放到 DATA/BSS，或用 new 放到堆
void process() {
    static int buf[2048];  // BSS 段，不占栈空间
    // ...
}
```

#### 二、快速对比

| | 栈 | 堆 | DATA / BSS | 代码段 / 常量区 |
|:-----|:-----|:-----|:-----|:-----|
| 管理方式 | 编译器自动 | 程序员手动 | 程序加载时确定 | 编译时固化 |
| 生命周期 | 离开 `{}` 就死 | `delete`/`free` 才死 | 程序运行全程 | 程序运行全程 |
| 大小 | 小（嵌入式几 KB） | 大（取决于可用 RAM） | 编译时确定 | 编译时确定 |
| 速度 | 极快（动一下栈指针） | 较慢（要查找空闲块） | 快 | 快 |
| 典型问题 | 栈溢出 | 内存泄漏、碎片 | — | 段错误（试图写入） |
| 嵌入式对应 | RAM | RAM | Flash → RAM（初值） | Flash |

#### 三、构造与析构在各区的行为

不同类型的变量，构造和析构的时机完全不同：

| 变量类型 | 所在内存区 | 构造时机 | 析构时机 |
|:-----|:-----|:-----|:-----|
| 栈上的局部对象 `Motor m;` | 栈 | 执行到声明处 | 离开 `}` 作用域（自动） |
| 堆上的对象 `new Motor;` | 堆 | `new` 时 | `delete` 时（手动，忘了就泄漏） |
| 全局对象 | DATA / BSS | `main()` 之前 | `main()` 结束后 |
| static 局部对象 | DATA / BSS | 第一次执行到声明处 | `main()` 结束后 |
| 成员对象（类里面有另一个类对象） | 跟着宿主走 | 宿主构造时 | 宿主析构时 |

```cpp
class Motor {
public:
    Motor()  { cout << "构造" << endl; }
    ~Motor() { cout << "析构" << endl; }
};

Motor g_motor;               // 全局对象——main 之前构造，程序结束析构

void func() {
    Motor local_motor;       // 栈对象——进入函数构造，离开函数析构
    static Motor s_motor;    // 静态局部——第一次调用 func 时构造，程序结束析构
    Motor* p = new Motor();  // 堆对象——new 时构造，只有 delete 才析构
    // 忘写 delete p; → 析构函数永远不会执行，泄漏
}
```

> [!tip] "程序结束才析构"在嵌入式里基本不发生
> 嵌入式 MCU 的程序通常是个死循环 `while(1)`，永远不会"正常结束"。所以全局对象和 static 局部对象的析构函数在嵌入式里几乎不会被执行——不要在析构函数里放"必须发生"的操作（如写入关键数据到 EEPROM），要手动调用保存函数。


### 1.29 C++的多态

#### 一、是什么

多态（polymorphism）这个词来自希腊语，意思是"多种形态"。在 C++ 里，**多态就是：同一个函数调用，根据实际指向的对象类型不同，执行不同的函数版本。**

人话类比：你去一家店说"结账"——店员可能会根据你是会员、新客、员工这三种身份，给你不同的折扣算法。你说的指令是一样的（"结账"），但因为你的身份不同，执行的结果也不同。

```cpp
// 没有多态：根本做不到"统一指令，不同行为"
MotorA a;  a.start();   // 你得知道具体是什么电机，调不同的函数
MotorB b;  b.start();

// 有多态：你只管发 start 指令，具体怎么启动，各电机自己知道
Motor* motors[] = {&a, &b};
for (auto m : motors) {
    m->start();   // 同一句代码，A 和 B 执行各自的启动逻辑
}
```

底层发生了什么？用一个图来理解——没有 `virtual` 和有 `virtual` 的根本区别：

没有 `virtual`（静态绑定）：
编译器只看指针的**静态类型**（声明时写的类型），不管实际指向什么。

```
Father* p = &son;
p->show();
  ↓
编译器: "p 是 Father*，调 Father::show()"
——哪怕 p 实际指向 son，也还是调 Father 的版本
```

有 `virtual`（动态绑定）：
运行时通过虚函数表查到**实际类型**，调对应的函数。

```
Father* p = &son;
p->show();
  ↓
运行时查虚函数表: "p 实际指向 Child，调 Child::show()"
——p 实际指什么，就调谁的版本
```

> [!NOTE] 多态的三要素
> 1. **要有继承关系**——子类从父类派生
> 2. **要用父类指针/引用指向子类对象**——类型兼容性原则（见 [[#1.26 类型兼容性原则|1.26 节]]）是多态的前提，不用指针/引用会切片
> 3. **要有虚函数重写**——父类函数加 `virtual`，子类用同名函数重写。推荐子类加 `override` 关键字让编译器帮你检查

---

#### 二、有什么用

**1. 用统一接口操作不同对象——写一次代码，适配所有子类**

这是多态最核心的工程价值。没有多态时，每加一种新设备，就要在主循环里加一个分支：

```cpp
// 没有多态：每新增一种设备就要改主循环
if (device == MOTOR_A)      motorA_start();
else if (device == MOTOR_B)  motorB_start();
else if (device == MOTOR_C)  motorC_start();   // 每次加新设备都要改这里

// 有多态：主循环永远不用改
Actuator* devices[] = {&motorA, &motorB, &motorC};
for (auto d : devices) {
    d->start();   // 不管有多少种设备，这一行就够了
}
```

**2. 支持开闭原则——对扩展开放，对修改关闭**

你写了一个控制器框架，后期想加一个新传感器类型。如果用了多态，你只需要写一个新的派生类，框架代码一行不用动。没有多态的话，你得在框架里到处加 `else if`。

**3. 让代码直接表达设计意图**

你做线控底盘，`Actuator` 有个 `emergencyStop()` 虚函数。刹车电机实现"立即制动"，转向电机实现"回正"，油门电机实现"断油"。代码结构直接对应系统设计——看代码就知道系统是怎么设计的。

---

#### 三、怎么用

**完整示例：从声明到调用**

```cpp
#include <iostream>
using namespace std;

// 步骤 1：定义基类，在需要"子类有不同行为"的函数前加 virtual
class Actuator {
public:
    virtual void start() {        // virtual = 允许子类重写
        cout << "执行器：通用启动" << endl;
    }
    virtual void emergencyStop() {
        cout << "执行器：紧急停止" << endl;
    }
    virtual ~Actuator() {}        // 基类析构必须 virtual（见 1.25 节规则二）
};

// 步骤 2：子类重写虚函数，加 override 让编译器帮你检查
class BrakeActuator : public Actuator {
public:
    void start() override {       // override = 明确告诉编译器"我在重写"
        cout << "刹车电机：缓慢释放刹车，预加压" << endl;
    }
    void emergencyStop() override {
        cout << "刹车电机：立即全力制动！" << endl;
    }
};

class SteerActuator : public Actuator {
public:
    void start() override {
        cout << "转向电机：自检后回到中位" << endl;
    }
    void emergencyStop() override {
        cout << "转向电机：保持当前角度，不断电" << endl;
    }
};

// 步骤 3：通过基类指针/引用调用——同一句代码，不同行为
int main() {
    BrakeActuator brake;
    SteerActuator steer;

    Actuator* fleet[] = {&brake, &steer};

    for (auto a : fleet) {
        a->start();          // 根据实际类型，分别调 BrakeActuator::start()
    }                        // 和 SteerActuator::start()

    cout << "--- 紧急情况！---" << endl;
    for (auto a : fleet) {
        a->emergencyStop();  // 同一句代码，刹车全力制动，转向保持角度
    }

    return 0;
}

/* 输出：
刹车电机：缓慢释放刹车，预加压
转向电机：自检后回到中位
--- 紧急情况！---
刹车电机：立即全力制动！
转向电机：保持当前角度，不断电
*/
```

**调用方式只有两种**：

```cpp
BrakeActuator brake;

// 方式一：基类指针（最常用）
Actuator* p = &brake;
p->start();

// 方式二：基类引用
Actuator& r = brake;
r.start();

// 这两种都不会发生切片，子类数据完整保留
// 传值会切片，丢失多态——见 1.26 节规则一
```

---

#### 四、需要注意什么

**1. 基类析构函数必须是 virtual**

```cpp
Actuator* p = new BrakeActuator();
delete p;   // 如果 ~Actuator() 不是 virtual：
            // 只调 Actuator 的析构，BrakeActuator 的成员没释放 → 内存泄漏
```

> 详细解释见 [[#1.25 类的继承|1.25 节]] 规则二。

**2. 子类一定要加 `override`，别裸着重写**

```cpp
class BrakeActuator : public Actuator {
public:
    void strat() override { ... }  // 编译报错！"strat"不是基类的虚函数
    //   ^^^^^ 拼错了，马上被发现

    void start() { ... }           // 没加 override，悄悄地变成了一个新函数
    // 编译器不会报错，但多态失效了——这种 bug 很难找
};
```

**3. 传值会切断多态（切片 slicing）**

```cpp
void test(Actuator a) {   // 传值——会发生切片
    a.start();            // 永远调 Actuator::start()，子类部分已被切掉
}

void test(Actuator& a) {  // 传引用——保留多态
    a.start();            // 实际类型是什么就调谁的 start()
}
```

**4. 构造函数里不要调虚函数**

```cpp
class Actuator {
public:
    Actuator() { start(); }         // 构造函数里调了虚函数
    virtual void start() { ... }
};

class BrakeActuator : public Actuator {
public:
    BrakeActuator() { ... }
    void start() override { ... }   // 构造期间还不会生效
};
// 创建 BrakeActuator 对象时，构造函数里调的总是 Actuator::start()
// 因为在 BrakeActuator 构造完成之前，对象的虚表指向的还是基类
```

一句话：构造和析构期间，虚函数机制**不工作**。

**5. 嵌入式场景的性能考量**

虚函数有微小开销——每个对象多一个 vtable 指针（通常 4 或 8 字节），每次虚函数调用多一次间接跳转。在 STM32 这类 MCU 上：

- **大多数场景完全够用**：现代编译器优化能力强，间接跳转开销通常可忽略
- **ISR（中断服务函数）里避免虚函数调用**：中断里追求确定的执行时间，间接跳转引入了不确定性
- **极度频繁调用的小函数**（如每微秒调一次）可以不用 virtual，用编译期多态（模板）替代

> 一句话：默认先用虚函数把架构写对，用 profiler 找到真正的瓶颈再优化。别提前优化。

**6. 纯虚函数和抽象类——"我只定规矩，不实现"**

有时候基类的函数完全没法给一个"默认实现"，因为每种子类的做法完全不同。这时候用纯虚函数：

```cpp
class Actuator {
public:
    virtual void start() = 0;   // = 0 表示"纯虚函数"——只声明，不实现
    virtual ~Actuator() {}      // 抽象类也必须有 virtual 析构
};

// Actuator a;  // 编译错误！有纯虚函数的类不能创建对象——叫"抽象类"

class BrakeActuator : public Actuator {
public:
    void start() override { ... }  // 必须实现！不实现就也是抽象类
};
```

抽象类 = 接口规范。它说："谁继承我，谁就必须实现这些函数，否则编译器不让创建对象。"






### 1.30 重载、重写、重定义

#### 一、三者核心区别

|                 | 重载（Overload） | 重写（Override）  | 重定义（遮蔽，Hide） |
| :-------------- | :----------- | :------------ | :----------- |
| 在哪发生            | 同一个类里        | 父子类之间         | 父子类之间        |
| 函数名             | 相同           | 相同            | 相同           |
| 参数              | **必须不同**     | **必须相同**      | 随便，同不同都遮蔽    |
| 父类有没有 `virtual` | 无关           | **必须有**       | **没有**       |
| 调用谁             | 编译时根据参数决定    | 运行时根据实际对象类型决定 | 编译时看指针/引用类型  |
| 子类关键字           | 不需要          | 加 `override`  | 什么也不加（隐患）    |

#### 二、一段代码看清三者

```cpp
class Father {
public:
    // 重载：同一个类里，同名不同参
    void calibrate()          { cout << "Father: 零参校准" << endl; }
    void calibrate(double r)  { cout << "Father: 单参校准" << endl; }

    // 虚函数：允许子类重写
    virtual void start()      { cout << "Father: 通用启动" << endl; }

    // 普通函数：没有 virtual
    void stop()               { cout << "Father: 通用停止" << endl; }
};

class Child : public Father {
public:
    // ✅ 重写（override）：父类有 virtual，子类用同名同参覆盖
    void start() override { cout << "Child: 子类启动" << endl; }

    // ❌ 重定义（遮蔽）：父类 stop() 没加 virtual，子类写了个同名的
    void stop()           { cout << "Child: 子类停止" << endl; }

    // ❌ 重定义 + 遮蔽：父类的 calibrate 不是 virtual，子类写了同名函数
    // 结果：父类两个 calibrate() 全被遮，只剩这一个
    void calibrate(double r, int ch) { cout << "Child: 带通道校准" << endl; }
};
```

调用结果：

```cpp
Child c;
Father* p = &c;
Father& r = c;

// 1. 重载 — 编译时根据参数选，不管指针指向啥
p->calibrate();         // "Father: 零参校准" —— 只看指针类型 Father*
p->calibrate(5.0);      // "Father: 单参校准"

// 2. 重写 — 运行时看实际类型
p->start();             // "Child: 子类启动" —— 虚函数，看实际对象是 Child

// 3. 重定义 — 只看指针类型，多态不生效
p->stop();              // "Father: 通用停止" —— 不是虚函数，只看指针类型

// 4. 遮蔽 —— 父类的 calibrate() 和 calibrate(double) 全没了
c.calibrate(5.0, 2);    // ✅ 唯一可用的
// c.calibrate();       // ❌ 编译报错！被遮蔽了
// c.calibrate(5.0);    // ❌ 编译报错！被遮蔽了
```

---

#### 三、怎么区分使用

**重载 — "一个函数，多种参数组合"**

需要同一操作支持不同类型或不同数量的参数时用。典型场景：构造函数（无参、有参、拷贝），`setSpeed(double rpm)` 和 `setSpeed(double rpm, double torque)`。

```cpp
class Motor {
public:
    void setSpeed(double rpm);           // 只设转速
    void setSpeed(double rpm, double t); // 转速 + 扭矩一起设
};
```

**重写 — "同一句代码，不同行为"（多态的核心）**

父类声明 `virtual`，子类 `override`。用基类指针/引用操作不同子类对象时，自动走到各自的实现。典型场景：`Actuator::start()`，刹车和转向各有各的实现。

```cpp
class Actuator {
public:
    virtual void start() { /* 默认实现 */ }
};
class BrakeActuator : public Actuator {
public:
    void start() override { /* 刹车特有的启动 */ }
};
```

**重定义 — 尽量别用**

如果你确实想在子类里写一个和父类同名的普通函数，说明你大概率需要的是重写（给父类加 `virtual`），或者换一个函数名。如果只是想给父类的重载函数加新版本，用 `using` 拉下来：

```cpp
class Child : public Father {
public:
    using Father::calibrate;  // 把父类所有 calibrate 重载拉进子类
    void calibrate(double r, int ch);  // 再加自己的新版本
    // 现在 calibrate()、calibrate(double)、calibrate(double, int) 全部可用
};
```

---

#### 四、补充：`override` 和 `final`

`override` 和 `final` 都是 C++11 引入的，写在函数声明的末尾，用于约束虚函数的继承行为。

```cpp
class Father {
public:
    virtual void start() { }
    virtual void selfTest() { }
};

class Child : public Father {
public:
    void start() override { }     // ✅ 明确告诉编译器"我在重写"
    // void strat() override { }  // ❌ 编译报错！拼写错误被编译器发现

    void selfTest() final { }     // final = "这是最终版本，子类不能再重写"
};

class GrandChild : public Child {
public:
    // void selfTest() override { }  // ❌ 编译报错！Child 已经标记为 final
};
```

| 关键字        | 作用                             | 放哪     | 什么时候用                             |
| :--------- | :----------------------------- | :----- | :-------------------------------- |
| `override` | 告诉编译器"我在重写基类虚函数"，编译器帮你检查签名是否匹配 | 子类函数末尾 | **重写虚函数时每次都加**——零开销的保险            |
| `final`    | 禁止后代类继续重写这个虚函数                 | 虚函数末尾  | 某个虚函数的实现已经是"最终版"，再重写会破坏不变量        |
| `final`    | 禁止此类被继承                        | 类名后    | `class Motor final { }`——此类不应该有子类 |

> [!tip] 工程习惯
> `override` 不需要犹豫，重写虚函数时写上它，和写 `virtual` 在父类一样自然。`final` 谨慎用——加了之后所有子类都不能重写，可能妨碍别人扩展。通常只在有明确的安全/正确性理由时才加（比如析构链、线程安全保证等）。
	





### 1.31 纯虚函数与抽象类

#### 一、是什么

**纯虚函数**是在基类里只声明、不实现的虚函数，用 `= 0` 标记：

```cpp
class Base {
public:
    virtual void doWork() = 0;   // 纯虚函数：我只规定"必须会做这件事"，怎么做由子类决定
};
```

**抽象类**是包含至少一个纯虚函数的类。它像一个"半成品模板"——框架搭好了，但关键步骤留了空，必须由子类填上才能用。

> [!NOTE] 类比理解
> 抽象类就像一份"产品需求文档"：它规定产品必须具备哪些功能（纯虚函数），但不规定具体怎么实现。子类是各个厂商的"具体产品"，必须把文档里列的功能全部做出来才能上市（实例化）。

| 概念 | 说明 | 能否实例化 |
| :--- | :--- | :---: |
| 普通类 | 所有函数都有实现 | ✅ 能 |
| 抽象类 | 至少一个纯虚函数 | ❌ 不能 |
| 纯虚函数 | `virtual void f() = 0;` | — |

#### 二、有什么用

抽象类的核心价值：**定义接口契约，强制子类遵守**。

最常见的三个场景：

1. **统一操作接口**——比如一个传感器抽象层，温度传感器和压力传感器的 `read()` 实现完全不同，但上层代码只需要知道"调用 read() 就能拿到数据"：

```cpp
class Sensor {
public:
    virtual double read() = 0;     // 纯虚函数：定义接口
    virtual void calibrate() = 0;
    virtual ~Sensor() {}           // 虚析构（后面讲）
};

class TempSensor : public Sensor {
public:
    double read() override { return readADC() * 0.488; }  // ADC 转温度
    void calibrate() override { /* 温度校准逻辑 */ }
private:
    double readADC();
};

class PressureSensor : public Sensor {
public:
    double read() override { return readSPI() * 0.015; }  // SPI 转压力
    void calibrate() override { /* 压力校准逻辑 */ }
private:
    double readSPI();
};
```

2. **多态调度**——用基类指针/引用，同一句代码操作不同子类：
```cpp
void pollAllSensors(Sensor* sensors[], int count) {
    for (int i = 0; i < count; i++) {
        cout << "传感器" << i << ": " << sensors[i]->read() << endl;
        // 不需要知道具体是哪种传感器，多态自动调到正确的 read()
    }
}
```

3. **禁止实例化基类**——有时候基类本身就是个抽象概念，不应该被直接创建（比如"动物"不能实例化，但"狗"可以）：
```cpp
class Animal {
public:
    virtual void speak() = 0;   // Animal 是抽象概念，不应该直接被 new
};
// Animal a;   ❌ 编译错误！抽象类不能实例化
```

#### 三、怎么用

**完整示例：嵌入式电机控制抽象层**
```cpp
// ===== 抽象基类：定义"电机必须能做什么" =====
class Motor {
protected:
    double currentSpeed = 0;
    bool isRunning = false;

public:
    virtual void start() = 0;                       // 纯虚函数
    virtual void stop() = 0;                        // 纯虚函数
    virtual void setSpeed(double rpm) = 0;          // 纯虚函数

    // 非纯虚函数：所有电机通用的逻辑可以直接写在基类
    double getSpeed() const { return currentSpeed; }
    bool running() const { return isRunning; }

    virtual ~Motor() {}    // 虚析构（重要：见第四部分）
};

// ===== 具体子类：步进电机 =====
class StepperMotor : public Motor {
private:
    int stepPin, dirPin;
    int currentStep = 0;

public:
    StepperMotor(int step, int dir) : stepPin(step), dirPin(dir) {}

    void start() override {
        isRunning = true;
        // 使能步进驱动器
    }

    void stop() override {
        isRunning = false;
        currentSpeed = 0;
        // 禁用步进驱动器
    }

    void setSpeed(double rpm) override {
        currentSpeed = rpm;
        // 根据 rpm 计算脉冲频率，配置定时器
    }
};

// ===== 具体子类：直流电机（带编码器） =====
class DCMotor : public Motor {
private:
    int pwmPin;
    int encoderPin;

public:
    DCMotor(int pwm, int enc) : pwmPin(pwm), encoderPin(enc) {}

    void start() override {
        isRunning = true;
        // 输出 PWM 使能
    }

    void stop() override {
        isRunning = false;
        currentSpeed = 0;
        // 停止 PWM 输出
    }

    void setSpeed(double rpm) override {
        currentSpeed = rpm;
        // PID 闭环调速
    }
};

// ===== 上层控制代码：不需要关心是什么电机 =====
void emergencyStop(Motor* motors[], int count) {
    for (int i = 0; i < count; i++) {
        motors[i]->stop();  // 多态：自动调用各自 stop()
    }
}

int main() {
    StepperMotor stepper(2, 3);
    DCMotor dc(5, 6);

    Motor* motors[] = { &stepper, &dc };

    for (auto m : motors) {
        m->start();
        m->setSpeed(1200);
    }

    emergencyStop(motors, 2);
    return 0;
}
```

#### 四、需要注意什么

| 规则               | 说明                                                        |
| :--------------- | :-------------------------------------------------------- |
| **抽象类不能实例化**     | `Motor m;` ❌ 编译报错。只能作为指针/引用使用                             |
| **子类必须实现所有纯虚函数** | 少实现一个，子类本身也变成抽象类，无法实例化                                    |
| **纯虚函数可以有实现**    | 虽然写了 `= 0`，仍可在类外给出默认实现，子类通过 `Base::func()` 显式调用           |
| **纯虚析构函数必须提供定义** | `virtual ~Base() = 0;` 之后必须在类外写 `Base::~Base() {}`，否则链接报错 |
| **抽象类可以有非虚成员**   | 可以有普通函数、成员变量、构造函数——它们被子类继承，减少重复代码                         |
| **构造函数不能是虚函数**   | 构造时对象类型已确定，不需要多态                                          |

**纯虚析构的特殊性：**

```cpp
class AbstractBase {
public:
    virtual ~AbstractBase() = 0;   // 纯虚析构
};
AbstractBase::~AbstractBase() {}   // ✅ 必须提供定义！否则链接报错
```

> [!warning] 为什么纯虚析构必须有定义？
> 子类析构时会自动调用基类析构函数。如果基类析构只有声明没有定义，链接器找不到它的函数体，直接报 `undefined reference` 错误。纯虚析构是唯一"声明为纯虚但必须有实现"的特殊情况。

**纯虚函数带默认实现：**

```cpp
class Logger {
public:
    virtual void log(const string& msg) = 0;   // 声明为纯虚
};

// 类外提供默认实现
void Logger::log(const string& msg) {
    cout << "[LOG] " << msg << endl;
}

class FileLogger : public Logger {
public:
    void log(const string& msg) override {
        Logger::log(msg);   // 显式调用基类的默认实现
        // 再追加写文件逻辑...
    }
};
```

> [!tip] 使用建议
> 如果基类的某个函数"概念上所有子类都必须有，但基类给不出有意义的实现"，就写成纯虚函数。如果基类能给出通用实现但希望子类可以覆盖，写成普通虚函数（非纯虚）。不要把有默认行为的函数写成纯虚——那样反而让子类困惑。

### 1.32 函数模板

#### 一、是什么——一句话

**函数模板不是函数，而是一个"函数配方"。** 编译器根据你调用时传的参数类型，自动生成对应的函数。

#### 二、解决什么问题——为什么需要它

假设你需要写一个取最大值的函数。没有模板时，每种类型都要写一遍：

```cpp
int   max_int  (int   a, int   b)   { return a > b ? a : b; }
double max_double(double a, double b) { return a > b ? a : b; }
char   max_char  (char   a, char   b)   { return a > b ? a : b; }
// 再来个 unsigned long long？再抄一遍……
```

**这些函数的逻辑一模一样，唯一不同的就是类型。** 函数模板就是用来消灭这种重复的：

```cpp
template<typename T>   // T 是"类型占位符"——具体是什么类型，调用时再定
T maxVal(T a, T b) {
    return a > b ? a : b;
}

// 同一个模板，自动适应所有类型
int    a = maxVal(3, 5);        // T → int
double b = maxVal(3.14, 2.72);  // T → double
char   c = maxVal('x', 'y');    // T → char
```

> [!tip] 类比
> 函数模板就像**月饼模具**。模具本身不是月饼——你往里面填什么馅（传什么类型），就压出什么月饼（生成什么函数）。换馅不换模具，一套模具对应所有馅料。

#### 三、基本语法

```cpp
template <typename T>        // 也可以写 class，效果完全一样
返回值 函数名(参数列表) {
    // 函数体，用 T 代替具体类型
}
```

`typename` 和 `class` 在这里没有任何区别，混用也行。初学建议统一用 `typename`，语义更清晰——"T 是一个类型，不一定是类"。

#### 四、编译器做了什么——模板的"真身"

模板本身不产生任何代码。**只有被调用时，编译器才根据实参类型生成一份真正的函数**，这个过程叫"模板实例化"：

```cpp
// 你写的是：
cout << maxVal(3, 5) << endl;     // 调用 int 版本
cout << maxVal(1.5, 2.8) << endl; // 调用 double 版本

// 编译器自动生成（你永远看不到，但实际参与编译）：
// int maxVal(int a, int b) { return a > b ? a : b; }          ← 实例化 1
// double maxVal(double a, double b) { return a > b ? a : b; } ← 实例化 2
```

两个关键后果：
1. **不同的类型调用会生成不同的函数**，每种类型一份，不会共享
2. **编译错误延迟到实例化时才暴露**——模板里的语法错误，如果这个类型从来没被调用过，编译器可能不报错

#### 五、核心规则

##### 规则 1：T 必须支持模板里用到的所有操作
编译器不会检查模板本身写得对不对，而是检查**你用某个类型实例化时合不合法**：
```cpp
template<typename T>
T add(T a, T b) { return a + b; }

add(1, 2);           // ✅ int 有 + 操作
add(string("a"), string("b"));  // ✅ string 有 + 操作（拼接）
// add(myStruct, myStruct);     // ❌ 如果 myStruct 没有重载 +，编译报错
```

报错信息会很长——这是模板的特点，习惯就好。出错时从下往上找"你写的代码"的第一行就是问题所在。

##### 规则 2：多个模板参数
一个 T 搞不定时（比如两个参数类型可能不同），加参数：
```cpp
template<typename T1, typename T2>
void print(T1 a, T2 b) {
    cout << a << " and " << b << endl;
}
print(42, 3.14);     // T1 → int, T2 → double
print("hello", 100); // T1 → const char*, T2 → int
```

##### 规则 3：类型自动推导 & 显式指定
大多数情况下编译器能自动推导 T，不需要你写：
```cpp
maxVal(3, 5);         // 自动推导 T = int
maxVal(1.2, 3.4);     // 自动推导 T = double
```

但当推导有歧义时，需要手动指定：
```cpp
maxVal(3, 5.0);       // ❌ 编译错误：T 到底是 int 还是 double？
maxVal<double>(3, 5.0); // ✅ 显式指定 T = double，3 自动转为 3.0
```

##### 规则 4：模板可以重载
和普通函数一样，模板也能重载——参数个数不同、或模板参数个数不同：
```cpp
template<typename T>
T maxVal(T a, T b) { return a > b ? a : b; }         // 两个参数版

template<typename T>
T maxVal(T a, T b, T c) { return maxVal(maxVal(a, b), c); }  // 三个参数版
```

##### 规则 5：模板 vs 普通函数——同名时优先选普通函数

当模板和普通函数都可以匹配同一个调用时，编译器按以下优先级选择：

```
普通函数 > 模板特化 > 泛型模板
```

**基本示例：**

```cpp
// 泛型模板（最低优先级）
template<typename T>
T maxVal(T a, T b) {
    cout << "模板版" << endl;
    return a > b ? a : b;
}

// 普通函数（最高优先级）
int maxVal(int a, int b) {
    cout << "int普通版" << endl;
    return a + b;  // 故意用加法，方便看出调了哪个版本
}

// 调用
maxVal(3, 5);       // → "int普通版"（int 有普通函数，优先匹配）
maxVal(3.14, 2.72); // → "模板版"（double 没有普通函数，模板顶上）
maxVal('A', 'B');   // → "模板版"（char 没有普通函数，模板顶上）
```

**怎么强制选模板？** 加空尖括号 `<>`，编译器就跳过普通函数只看模板：

```cpp
maxVal<>(3, 5);     // → "模板版"（强制跳过普通函数）
```

> [!NOTE] 编译器逻辑
> 专门为某类型写了普通函数 → 那个版本更懂这个类型的特殊需求 → 优先用。模板是"通用方案"，有专用方案就用专用的。

**多类型的情况：**

```cpp
template<typename T> void print(T val) { cout << "模板: " << val << endl; }

void print(int val)    { cout << "int版: " << val << endl; }
void print(double val) { cout << "double版: " << val << endl; }

print(42);    // int版——有精确匹配的普通函数
print(3.14);  // double版——有精确匹配的普通函数
print('A');   // 模板版——char 没有普通版，模板推导 T=char
print(42L);   // 模板版——long 没有普通版，模板推导 T=long
```

##### 规则 6：模板函数必须放在头文件里

模板和普通函数不同——**声明和定义不能分开放在 `.h` 和 `.cpp` 里**，必须全部放在头文件（或被 include 的文件）中。

**为什么？**

```cpp
// ===== mymath.h =====
template<typename T>
T maxVal(T a, T b);   // 只有声明

// ===== mymath.cpp =====
template<typename T>
T maxVal(T a, T b) { return a > b ? a : b; }  // 定义在 cpp

// ===== main.cpp =====
#include "mymath.h"
int x = maxVal(3, 5);  // ❌ 链接错误！找不到 maxVal<int> 的实现
```

编译器在编译 `main.cpp` 时，看到了调用但只看到了 `.h` 里的声明，没看到 `.cpp` 里的实现，无法实例化。编译器假设"实现在别的 `.cpp` 里"，留了个符号等链接器去找。但 `mymath.cpp` 里虽然写了模板定义，那里没人调用 `maxVal<int>`，所以也没生成代码。**两头都没生成，链接器就找不到。**

换句话说：模板是"配方"，编译器拿到配方才能做菜（实例化），配方不在眼前就干不了活。

**正确做法：全部放头文件**

```cpp
// ===== mymath.h =====
template<typename T>
T maxVal(T a, T b) {      // 声明 + 定义一起
    return a > b ? a : b;
}

// ===== main.cpp =====
#include "mymath.h"
int x = maxVal(3, 5);     // ✅ 编译器看到了完整定义，直接实例化
```

如果想看起来"分离"，可以用 `.hpp` 或 `.tpp` 后缀，在头文件末尾 `#include "xxx.tpp"`：

```cpp
// mymath.h
template<typename T> T maxVal(T a, T b);  // 声明
#include "mymath.tpp"                      // 把实现 include 进来

// mymath.tpp
template<typename T>
T maxVal(T a, T b) { return a > b ? a : b; }
```

本质上还是全部内容对编译器可见，只是多了一层文件组织。

> [!warning] 关键区别
> | 普通函数 | 模板函数 |
> |----------|----------|
> | `.h` 声明 + `.cpp` 定义，分开编译链接 | **声明和定义必须在同一个文件里** |
> | 编译一次，链接时组装 | 每次调用时现场实例化，必须看到完整定义 |

#### 六、什么时候用、什么时候不用

| 用模板                                 | 不用模板                        |
| ----------------------------------- | --------------------------- |
| 逻辑完全相同，只是类型不同（`max`、`swap`、`sort`）  | 不同类型的逻辑本来就不同（用函数重载）         |
| 写库代码——不知道用户会用哪些类型                   | 类型就那么两三种且不会扩展（直接写普通函数更简单）   |
| 容器类——`vector<int>`、`vector<double>` | 嵌入式对代码体积敏感（模板每种类型生成一份，体积膨胀） |

> [!warning] 嵌入式注意
> 模板是编译期展开的，每种类型生成一份独立代码。用 `maxVal` 处理 5 种不同类型，flash 里就会有 5 份几乎一样的函数。MCU 上 FLASH 紧张时，评估模板带来的代码膨胀是否可接受。

#### 七、一图总结

```text
┌─────────────────────────────────────────────────────┐
│                   template<typename T>               │
│                   T maxVal(T a, T b)                 │
│                   函数模板（配方）                     │
│                                                     │
│   调用 maxVal(3,5)    调用 maxVal(1.2,3.4)           │
│   T → int             T → double                    │
│        ↓                    ↓                        │
│   int maxVal(...)     double maxVal(...)             │
│   编译器生成的         编译器生成的                     │
│   具体函数             具体函数                        │
└─────────────────────────────────────────────────────┘
```

简记：**模板 = 类型参数化 = 一套逻辑适配所有类型 = 编译期自动生成代码。**



## 二、STL

### 2.1 vector 动态数组

`std::vector` 是可变长度数组，头文件 `<vector>`。
#### 2.1.1 创建与初始化

```cpp
#include <vector>

vector<int> v1;              // 空容器
vector<int> v2(5);           // 5 个元素，默认值 0
vector<int> v3(5, 10);       // 5 个元素，初始值 10
vector<int> v4 = {1, 2, 3};  // 初始化列表
vector<int> v5(v4);          // 拷贝构造
```

#### 2.1.2 核心函数速查

| 分类     | 函数                                            | 说明             |
| :----- | :-------------------------------------------- | :------------- |
| **创建** | `vector<T> v;`                                | 创建空数组          |
|        | `vector<T> v(n);`                             | n 个元素（默认值）     |
|        | `vector<T> v(n, val);`                        | n 个 val        |
|        | `vector<T> v = {a, b, c};`                    | 初始化列表          |
| **增删** | `v.push_back(x)`                              | 末尾添加元素         |
|        | `v.pop_back()`                                | 末尾删除元素         |
|        | `v.insert(pos, x)`                            | 在 pos 位置前插入    |
|        | `v.erase(pos)`                                | 删除 pos 位置元素    |
|        | `v.clear()`                                   | 清空所有元素         |
| **访问** | `v[i]`                                        | 下标访问（不检查越界）    |
|        | `v.at(i)`                                     | 下标访问（越界抛异常）    |
|        | `v.front()`                                   | 第一个元素          |
|        | `v.back()`                                    | 最后一个元素         |
| **大小** | `v.size()`                                    | 元素个数           |
|        | `v.empty()`                                   | 是否为空           |
|        | `v.resize(n)`                                 | 调整大小（新元素默认填 0） |
|        | `v.reserve(n)`                                | 预留容量，避免重复扩容    |
|        | `v.capacity()`                                | 当前已分配容量        |
| **遍历** | `for (auto x : v)`                            | 范围 for（只读）     |
|        | `for (auto& x : v)`                           | 范围 for（可修改）    |
|        | `for (auto p = v.begin(); p != v.end(); p++)` | 迭代器，`*p` 访问元素  |

#### 2.1.3 迭代器遍历

```cpp
v.push_back(21);
cout << "v: ";
for (auto p = v.begin(); p != v.end(); p++) {
    cout << *p << " ";
}
cout << endl;
// 打印结果: 2 2 2 2 2 2 2 2 2 2 21
```

> 遍历结束后 `p` 指向 `v.end()`（最后一个元素的下一个位置），不是最后一个元素。`reserve(n)` 是常用性能优化——预知大小时提前分配，避免多次重新分配内存。



### 2.2 set 集合

`std::set` 是数学上的集合——元素唯一、自动排序，头文件 `#include<set>`。

#### 2.2.1 创建集合

```cpp
#include <set>
using namespace std;

set<int> s;              // 空集合
set<int> s2 = {3, 1, 2}; // 初始化列表，自动排序为 1 2 3
```
> [!caution] `set` 不能像 `vector` 一样用下标初始化一批相同元素，因为元素必须互异。

#### 2.2.2 核心函数速查

| 分类     | 函数                                            | 说明                                   |
| :----- | :-------------------------------------------- | :----------------------------------- |
| **插入** | `s.insert(x)`                                 | 插入元素 x（已存在则忽略），返回 `<iterator, bool>` |
| **删除** | `s.erase(x)`                                  | 按值删除 x，返回删除个数（0 或 1）                 |
|        | `s.erase(pos)`                                | 按迭代器位置删除                             |
|        | `s.clear()`                                   | 清空所有元素                               |
| **查找** | `s.find(x)`                                   | 查找 x，返回迭代器；未找到返回 `s.end()`           |
|        | `s.count(x)`                                  | 统计 x 出现次数（set 中只会是 0 或 1）            |
|        | `s.lower_bound(x)`                            | 返回第一个 ≥ x 的迭代器                       |
|        | `s.upper_bound(x)`                            | 返回第一个 > x 的迭代器                       |
| **大小** | `s.size()`                                    | 元素个数                                 |
|        | `s.empty()`                                   | 是否为空                                 |
| **遍历** | `for (auto x : s)`                            | 范围 for（自动升序遍历）                       |
|        | `for (auto p = s.begin(); p != s.end(); p++)` | 迭代器遍历，`*p` 访问元素                      |

#### 2.2.3 遍历示例

```cpp
set<int> s = {3, 1, 4, 1};  // 重复的 1 自动去重，排序后: 1 3 4

// 范围 for
for (auto x : s) { cout << x << " "; }  // 1 3 4

// 迭代器
for (auto p = s.begin(); p != s.end(); p++) {
    cout << *p << " ";                   // 1 3 4
}
```


### 2.3 map 键值对

`std::map` 存储键值对，自动按 key 从小到大排序。头文件 `<map>`。

#### 2.3.1 创建

```cpp
#include <map>
using namespace std;

map<string, int> m;
map<string, int> m2 = {{"a", 1}, {"b", 2}};  // C++11 初始化列表
```

#### 2.3.2 核心操作

| 操作 | 代码 | 说明 |
|:-----|:-----|:-----|
| 添加/修改 | `m["hello"] = 2;` | key 存在则修改，不存在则插入 |
| 访问 | `cout << m["world"];` | key 存在返回值，不存在返回默认值（int 返回 0） |
| 查找 | `m.find(key)` | 返回迭代器，未找到返回 `m.end()` |
| 删除 | `m.erase(key)` | 按 key 删除 |
| 大小 | `m.size()` | 键值对个数 |
| 判空 | `m.empty()` | 是否为空 |

#### 2.3.3 遍历

```cpp
for (auto& p : m) {
    cout << p.first << ": " << p.second << endl;
}
```

- `p.first` — 键（key）
- `p.second` — 值（value）

> 迭代器 `p` 类似指向结构体的指针，也可用 `p->first`、`p->second` 访问。

### 2.4 Stack（栈）
#### 2.4.1 创建
`std::stack` 是栈容器适配器，后进先出（LIFO）。头文件 `<stack>`。
```cpp
#include <stack>
using namespace std;

stack<int> s;
```
#### 2.4.2 核心操作

| 操作 | 代码 | 说明 |
|:-----|:-----|:-----|
| 压栈 | `s.push(x)` | 将元素 x 压入栈顶 |
| 出栈 | `s.pop()` | 弹出栈顶元素（不返回值） |
| 访问栈顶 | `s.top()` | 返回栈顶元素的引用 |
| 大小 | `s.size()` | 元素个数 |
| 判空 | `s.empty()` | 是否为空 |

> [!warning] 注意
> `pop()` 不返回值，如需获取栈顶值请先用 `top()` 再 `pop()`。

### 2.5 queue（队列）

`std::queue` 是队列容器适配器，先进先出（FIFO）。头文件 `<queue>`。

#### 2.5.1 创建

```cpp
#include <queue>
using namespace std;

queue<int> q;
```

#### 2.5.2 核心操作

| 操作 | 代码 | 说明 |
|:-----|:-----|:-----|
| 入队 | `q.push(x)` | 将元素 x 加入队尾 |
| 出队 | `q.pop()` | 弹出队首元素（不返回值） |
| 访问队首 | `q.front()` | 返回队首元素引用 |
| 访问队尾 | `q.back()` | 返回队尾元素引用 |
| 大小 | `q.size()` | 元素个数 |
| 判空 | `q.empty()` | 是否为空 |

> [!warning] 注意
> `pop()` 不返回值，先用 `front()` 取值再 `pop()`。

### 2.6 无序的 set 与 map

当不需要排序、只关心查找速度时，使用无序容器。基于哈希表实现，插入/查找/删除平均 O(1)。

| 有序 | 无序 | 头文件 |
|:-----|:-----|:-----|
| `set` | `unordered_set` | `<unordered_set>` |
| `map` | `unordered_map` | `<unordered_map>` |

```cpp
#include <iostream>
#include <unordered_map>
#include <unordered_set>
using namespace std;

int main(void) {
    unordered_map<string, int> m;
    unordered_set<int> s;

    s.insert(1);
    s.insert(7);
    s.insert(5);

    m["Hello"] = 1;
    m["world"] = 2;
    m["ha"] = 3;
    m["hklwe"] = 4;

    for (auto p = s.begin(); p != s.end(); p++)
        cout << *p << endl;
    for (auto p = m.begin(); p != m.end(); p++)
        cout << p->first << " " << p->second << endl;
    return 0;
}
```

> 无序容器元素不排序，遍历顺序不可预测。适用于纯去重/查找场景。


## 三、进阶篇

### 3.1 bitset 位集

`bitset` 是一个二进制存储器，按从低位到高位的顺序排列。头文件`<bitset>`
#### 3.1.1 初始化

| 写法                        | 说明                                |
| :------------------------ | :-------------------------------- |
| `bitset<N> b;`            | N 个二进制位，全部初始化为 0                  |
| `bitset<N> b(u);`         | u 为 `unsigned long long`，按二进制位初始化 |
| `bitset<N> b(s);`         | s 为 `"0101"` 字符串，从左到右对应高位到低位      |
| `bitset<N> b(s, pos, n);` | 从字符串 s 的 pos 位置取 n 个字符            |
```
  bitset<8> b("1101");     // 字符串短 → 高位补 0 → 00001101
  bitset<4> b("11110000"); // 字符串长 → 取低位（右侧） → 0000
```
#### 3.1.2 成员函数

| 函数             | 说明                 |
| :------------- | :----------------- |
| `b.any()`      | 是否有任意位为 1          |
| `b.none()`     | 是否所有位为 0           |
| `b.count()`    | 值为 1 的位数           |
| `b.size()`     | 总位数（N）             |
| `b.test(i)`    | 测试第 i 位是否为 1       |
| `b.set(i)`     | 将第 i 位设为 1         |
| `b.reset()`    | 将所有位设为 0           |
| `b.reset(i)`   | 将第 i 位设为 0         |
| `b.flip()`     | 翻转所有位              |
| `b.flip(i)`    | 翻转第 i 位            |
| `b.to_ulong()` | 转为 `unsigned long` |
| `b.to_ullong()` | 转为 `unsigned long long` |
| `b.to_string()` | 转为 `"0101"` 字符串 |

**例如**

```cpp
#include <iostream>
#include <bitset>
using namespace std;

int main(void) {
    bitset<5> b(19);            // 19 = 0b10011
    cout << b << endl;          // 10011

    for (int i = 0; i < b.size(); i++)
        cout << b[i] << " ";    // 1 1 0 0 1（左→右，从低位到高位），cout<< s可以直接打印，不用遍历
    cout << endl;

    cout << "any: "   << b.any()   << endl;  // 1
    cout << "count: " << b.count() << endl;  // 3
    cout << "size: "  << b.size()  << endl;  // 5

    cout << "test(0): " << b.test(0) << endl; // 1（第0位为1）

    b.flip(1);                   // 翻转第1位：1→0
    cout << b << endl;           // 10001

    unsigned long a = b.to_ulong();
    cout << a << endl;           // 17
}
```


### 3.2 sort函数

#### 1.主要功能
对数组`int arr[]`或`vector()`进行排序

>`vector`的首尾：`v.begin()，v.end()`
>`int arr[n]`的首位: `arr`表示首地址，`arr+n`表示尾部
>注意包含头文件:`#include <algorithm>`

#### 2.使用方法
```cpp
sort（v.begin()，v.end()）
```

#### 3.cmp对sort的排序进行调整

```cpp
bool cmp(int a,int b)
{
  return a < b;   // 升序（小的在前）
  return a > b;   // 降序（大的在前）
}
vector<int> v = {3, 1, 4, 1, 5};
sort(v.begin(), v.end());               // 不传 cmp → 1 1 3 4 5（升序）
sort(v.begin(), v.end(), [](int a, int b) { return a < b; });  // 1 1 3 4 5（升序）
sort(v.begin(), v.end(), [](int a, int b) { return a > b; });  // 5 4 3 1 1（降序）
```


>[!note] 注意
>  - 不能自相矛盾：如果 cmp(a, b) 为真，那 cmp(b, a) 必须为假
>  - 不能用 >= 或 <=，只能用 > 或 <

### 3.3 cctype 字符处理函数

头文件 `<cctype>`，用于判断和转换字符。

| 函数           | 说明               |
| :----------- | :--------------- |
| `isalpha(c)` | 是否为字母            |
| `islower(c)` | 是否为小写字母          |
| `isupper(c)` | 是否为大写字母          |
| `isdigit(c)` | 是否为数字（0-9）       |
| `isalnum(c)` | 是否为字母或数字         |
| `isspace(c)` | 是否为空白（空格、\t、\n等） |
| `tolower(c)` | 转小写              |
| `toupper(c)` | 转大写              |

```cpp
#include <iostream>
#include <cctype>
using namespace std;

int main(void) {
    char c = 'A';
    cout << "isalpha: " << isalpha(c) << endl;   // 1 是否为字母
    cout << "islower: " << islower(c) << endl;   // 0 是否为小写
    cout << "isupper: " << isupper(c) << endl;   // 1 是否为大写
    cout << "isalnum: " << isalnum(c) << endl;   // 1 是否为字母或数字
    cout << "isspace: " << isspace(c) << endl;   // 0 是否为空白

    char s = tolower(c);   // 'a' 转小写
    cout << s << endl;

    char s1 = toupper(c);  // 'A' 转大写
    cout << s1 << endl;
}
```
## 四、C++11 常用特性

### 4.1 auto 类型推导
让编译器根据初始值自动推断变量类型。

```cpp
auto i = 10;           // int
auto d = 3.14;         // double
auto s = "hello";      // const char*
auto v = {1, 2, 3};    // initializer_list<int>

// 遍历容器时替代冗长的迭代器类型
vector<int> nums = {1, 2, 3};
for (auto p = nums.begin(); p != nums.end(); p++)
    cout << *p << " ";
```

> [!caution] auto 使用的限制规则：
1. 使用 auto 类型推导的变量**必须初始化**
2. auto 不能在函数的参数中使用(但是能作为**函数返回值**)
3. auto 不能作用于类的非静态成员变量（也就是没有 static 关键字修饰的成员变量）中
4. auto 关键字不能定义**数组**
5. auto 不能作用于模板参数

---
### 4.2 基于范围的 for 循环

#### 4.2.1 三种写法对比

| 写法              | 是否拷贝 | 能否修改原值 | 适用场景                   |
| --------------- | ---- | ------ | ---------------------- |
| `auto x`        | 拷贝一份 | 不能改    | 元素是小类型（int/char），不需要修改 |
| `auto& x`       | 不拷贝  | 能改     | 需要修改容器元素               |
| `const auto& x` | 不拷贝  | 不能改    | **最常用**（省开销，避免开辟空间）    |

使用规则: `类型 表达式1: 表达式2`。 表达式1，用来去数组里面取值的，表达式2，就是需要遍历的数组
```cpp
for (int val : ages){
	cout << val << " ";
}
```
以后可直接将 `类型`替换为`auto`自动判断类型
1. 只读 —— 拷贝一份
```cpp
vector<int> v = {1, 2, 3};
for (auto x : v) {
    x = 99;        // 改的是副本，v 不变
}// v 还是 {1, 2, 3}
```
2. 修改原容器 —— 用引用 `&`
```cpp
for (auto& x : v) {
    x = 99;        // 直接修改原元素
}// v 变成 {99, 99, 99}
```
 3. 只读但避免拷贝（最常用）
```cpp
for (const auto& x : v) {
    // x 是原元素的 const 引用，不能改，也不拷贝
}
```

#### 4.2.2 各种容器遍历示例

```cpp
// 序列容器
vector<int> v = {1, 2, 3};
list<int> l = {4, 5, 6};
deque<int> d = {7, 8, 9};
array<int, 3> a = {10, 11, 12};
string s = "CAN";

for (const auto& x : v) cout << x << " ";   // 1 2 3
for (const auto& x : l) cout << x << " ";   // 4 5 6
for (const auto& x : d) cout << x << " ";   // 7 8 9
for (const auto& x : a) cout << x << " ";   // 10 11 12
for (const auto& c : s) cout << c << " ";   // C A N

// 关联容器
set<int> st = {3, 1, 2};
map<string, int> m = {{"brake", 1}, {"steer", 2}};

for (const auto& x : st) cout << x << " ";                 // 1 2 3（自动排序）
for (const auto& pair : m)                                 // 每个元素是 pair
    cout << pair.first << ":" << pair.second << " ";       // brake:1 steer:2
for (const auto& [k, v] : m)                               // C++17 结构化绑定
    cout << k << ":" << v << " ";

// 多维
vector<vector<int>> mat = {{1, 2}, {3, 4}};
for (const auto& row : mat) {
    for (const auto& x : row)
        cout << x << " ";
    cout << endl;
}
```

---

### 4.3 字符串与数字转换

头文件 `#include <string>`。

#### 1 数字 → 字符串：to_string

```cpp
string s = to_string(123213);       // "123213"

// 遍历字符串的每个字符
int i = 0;
for (const auto& x : s)
    cout << x << "(" << i++ << ")  ";  // 1(0) 2(1) 3(2) 2(3) 1(4) 3(5)
cout << endl;

// 用 printf 输出需加 .c_str()
printf("%s\n", s.c_str());          // .c_str() 把 string 转成 const char*
// cout可以直接输出
cout << s <<endl;
```

#### 2 字符串 → 数字：stoi / stod / stol 系列

| 函数 | 作用 |
|------|------|
| `stoi(s)` | string → int |
| `stol(s)` | string → long |
| `stoll(s)` | string → long long |
| `stoul(s)` | string → unsigned long |
| `stoull(s)` | string → unsigned long long |
| `stof(s)` | string → float |
| `stod(s)` | string → double |
| `stold(s)` | string → long double |

```cpp
int i = stoi("123");           // 123
long l = stol("123456");       // 123456
long long ll = stoll("123");   // 123
float f = stof("3.14");        // 3.14
double d = stod("123.24");     // 123.24
long double ld = stold("3.14");// 3.14
```

