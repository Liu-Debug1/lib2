---
tags:
  - C++
  - C语言
  - 语法对比
  - 嵌入式
date: 2026-05-13
---

# C → C++ 语法速查

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

| C                 | C++               | 说明                          |
| :---------------- | :---------------- | :-------------------------- |
| `scanf("%d", &n)` | `cin >> n`        | 箭头向右，流入变量                   |
| `printf("hello")` | `cout << "hello"` | 箭头向左，流入输出流                  |
| `"\n"`            | `endl` 或 `"\n"`   | `endl` 会强制刷新缓冲区，嵌入式建议用 `\n` |
| 需要有占位符            | 不需要占位符            |                             |

> [!warning] 注意
> `cin`/`cout` 比 `scanf`/`printf` 慢。嵌入式/竞赛中大量 IO 时慎用。


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
```cpp
int Num1(1); //初始化为1
int Num2{1}; //初始化为1
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

| 操作 | C | C++ |
|:-----|:--|:---|
| 声明 | `char buf[32];` | `string s;` |
| 拼接 | `strcat(buf, "world");` | `s += "world";` 或 `s1 + s2` |
| 长度 | `strlen(buf)` | `s.length()` |
| 含空格输入 | 麻烦（`gets` 危险） | `getline(cin, s)` |
| 内存管理 | 手动管理数组大小 | 自动扩缩 |
> `.length()` 是面向对象的写法——`.` 左边是对象，右边是方法。这和 C 的 `strlen(buf)` 函数式调用不同。


### 1.7 struct 结构体

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

> C++ 的 `struct` 和 `class` 几乎相同，唯一区别是 `struct` 成员默认 public。

```cpp
// C: struct 只能放数据，操作函数需分离
typedef struct { int x, y; } Point;
void move(Point *p, int dx, int dy) { p->x += dx; p->y += dy; }

// C++: struct 可直接包含成员函数
struct Point {
    int x, y;
    void move(int dx, int dy) { x += dx; y += dy; }
};
```

---
### 1.7 enum枚举类型
C语言和C++语言都提供了枚举类型，两者是有一定区别。有如下定义：
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
    if (CIRCLE == MON)
    {
        cout<<"oh.yes";
    }
    ```
#### 3,C++中的 enum class 强枚举类型

首先是强枚举的标准定义示例：
```cpp
enum class SHAPE {CIRCLE,RECT,LINE,POINT};
enum class WEEK  {MON,TUE,WED,THI,FIR,SAT,SUN};
```

1. **特性1**：限定作用域
强枚举类型不会将枚举元素暴露到全局作用域，必须通过`枚举名::枚举元素`的方式访问内部枚举值
```cpp
cout<<SHAPE::RECT<<endl;    //输出 1，原文此处存在笔误，写成了`SHAPCE::RECT`
```
2.  **特性2**：类型安全校验
不相关的两个枚举类型不能直接进行比较，编译时会触发报错：
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

### 1.8 引用类型: 起别名

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

### 1.9三目运算符

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

### 1.10 动态内存分配
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

### 1.11 进制表达

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

> `set` 不能像 `vector` 一样用下标初始化一批相同元素，因为元素必须互异。

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
1. 使用 auto 类型推导的变量必须马上初始化
2. auto 不能在函数的参数中使用(但是能作为函数的返回值)
3. auto 不能作用于类的非静态成员变量（也就是没有 static 关键字修饰的成员变量）中
4. auto 关键字不能定义数组
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
2. 修改原容器 —— 用引用 &
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

#### 4.3.1 数字 → 字符串：to_string

```cpp
string s = to_string(123213);       // "123213"

// 遍历字符串的每个字符
int i = 0;
for (const auto& x : s)
    cout << x << "(" << i++ << ")  ";  // 1(0) 2(1) 3(2) 2(3) 1(4) 3(5)
cout << endl;

// 用 printf 输出需加 .c_str()
printf("%s\n", s.c_str());          // .c_str() 把 string 转成 const char*
```

#### 4.3.2 字符串 → 数字：stoi / stod / stol 系列

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