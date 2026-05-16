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

### 1.1 输入输出（cin / cout）

#### 1.1.1 声明命名空间

```cpp
#include <iostream>
using namespace std;

int main(void) {
    int n;
    cin >> n;
    cout << "hello " << ++n << endl;
    return 0;
}
```

#### 1.1.2 不声明命名空间

```cpp
#include <iostream>

int main(void) {
    int n;
    std::cin >> n;
    std::cout << "hello " << ++n << std::endl;
    return 0;
}
```

| C | C++ | 说明 |
|:--|:---|:-----|
| `scanf("%d", &n)` | `cin >> n` | 箭头向右，流入变量 |
| `printf("hello")` | `cout << "hello"` | 箭头向左，流入输出流 |
| `\n` | `endl` 或 `\n` | `endl` 会强制刷新缓冲区，嵌入式建议用 `\n` |

> [!warning] 注意
> `cin`/`cout` 比 `scanf`/`printf` 慢。嵌入式/竞赛中大量 IO 时慎用。

---

### 1.2 头文件

C++ 头文件去掉了 `.h`，加前缀 `c`：

| C | C++ |
|:--|:---|
| `#include <stdio.h>` | `#include <cstdio>` |
| `#include <string.h>` | `#include <cstring>` |
| `#include <stdlib.h>` | `#include <cstdlib>` |
| `#include <math.h>` | `#include <cmath>` |

---

### 1.3 变量声明位置

C++ 允许在 `for` 循环内部声明循环变量：

```cpp
// C: 变量必须在函数开头声明
int i;
for (i = 0; i < 10; i++) { }

// C++: 可以在 for 内声明
for (int i = 0; i < 10; i++) { }
```

---

### 1.4 bool 类型

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

#### 1.6.1 基本操作

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

#### 1.6.2 与 C 字符串对比

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

```cpp
struct Point {
    int x;
    int y;
};
Point p1;            // 直接用，不需要 struct Point
p1.x = 10;
```

| C | C++ |
|:--|:---|
| `typedef struct { int x, y; } Point;` | `struct Point { int x, y; };` |
| `Point p;` 或 `struct Point p;` | `Point p;` |

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

### 1.8 & 引用

引用是变量的别名，像普通变量一样使用，不需要取地址 `&` 和 `*` 解引用：

```cpp
void swap(int& a, int& b) {  // 形参用 & 声明
    int t = a;
    a = b;
    b = t;
}

int x = 1, y = 2;
swap(x, y);  // 直接传变量，底层自动传地址
```

| 对比 | 指针 | 引用 |
|:-----|:-----|:-----|
| 声明 | `int* p;` | `int& r = x;` |
| 传参 | `swap(&x, &y)` | `swap(x, y)` |
| 函数内修改 | `*p = 10;` | `r = 10;` |
| 可为空 | 可以 `nullptr` | 不可以（必须初始化） |

```cpp
// const 引用：只读访问，不拷贝
void print(const string& s) { cout << s; }

// 引用做输出参数（替代指针输出）
void divide(int a, int b, int& quot, int& rem) {
    quot = a / b;
    rem  = a % b;
}
int q, r;
divide(10, 3, q, r);  // q=3, r=1
```

---

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

`std::stack` 是栈容器适配器，后进先出（LIFO）。头文件 `<stack>`。

#### 2.4.1 创建

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


# 三、进阶篇

## 1. 运算符bitset

bitset就是一个二进制存储器，将二进制从低位到高位的顺序排列

1.1 初始化
bitset<5>b; 5表示5个二进制位，全部初始化为0
u为








