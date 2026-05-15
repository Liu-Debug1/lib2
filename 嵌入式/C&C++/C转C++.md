---
tags:
  - C++
  - C语言
  - 语法对比
  - 嵌入式
date: 2026-05-13
---

# C → C++ 语法速查

## 1. 输入输出（cin / cout）

### 声明命名空间

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

### 不声明命名空间

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

## 2. 头文件

C++ 头文件去掉了 `.h`，加前缀 `c`：

| C | C++ |
|:--|:---|
| `#include <stdio.h>` | `#include <cstdio>` |
| `#include <string.h>` | `#include <cstring>` |
| `#include <stdlib.h>` | `#include <cstdlib>` |
| `#include <math.h>` | `#include <cmath>` |

---

## 3. 变量声明位置

C++ 允许在 `for` 循环内部声明循环变量：

```cpp
// C: 变量必须在函数开头声明
int i;
for (i = 0; i < 10; i++) { }

// C++: 可以在 for 内声明
for (int i = 0; i < 10; i++) { }
```

---

## 4. bool 类型

```cpp
bool flag = true;   // true  = 非零值
bool ok = false;    // false = 0

if (flag) { }       // 直接用，不需要 flag == 1
```

C99 也有 `bool`（需 `#include <stdbool.h>`），但 C++ 内建直接可用。

---

## 5. const 常量

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

## 6. string 类

`std::string` 替代 C 的 `char[]`，自动管理内存。

### 基本操作

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

### 与 C 字符串对比

| 操作 | C | C++ |
|:-----|:--|:---|
| 声明 | `char buf[32];` | `string s;` |
| 拼接 | `strcat(buf, "world");` | `s += "world";` 或 `s1 + s2` |
| 长度 | `strlen(buf)` | `s.length()` |
| 含空格输入 | 麻烦（`gets` 危险） | `getline(cin, s)` |
| 内存管理 | 手动管理数组大小 | 自动扩缩 |

> `.length()` 是面向对象的写法——`.` 左边是对象，右边是方法。这和 C 的 `strlen(buf)` 函数式调用不同。


## 7. struct 结构体

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

![[Pasted image 20260514094330.png|500]]

---

## 8. & 引用

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

![[Pasted image 20260514094852.png|500]]

---

## 9. vector 动态数组

`std::vector` 是可变长度数组，头文件 `<vector>`。

### 创建与初始化

```cpp
#include <vector>

vector<int> v1;              // 空容器
vector<int> v2(5);           // 5 个元素，默认值 0
vector<int> v3(5, 10);       // 5 个元素，初始值 10
vector<int> v4 = {1, 2, 3};  // 初始化列表
vector<int> v5(v4);          // 拷贝构造
```

### 核心函数速查

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

### 迭代器遍历

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


10, SET

1. SET是集合，里面的元素各不相同
2. 头文件`#include<set>` 
3. 创建集合
	- `set<int> S`;
	-  `S`后不能像`vector`一样初始化内容
4. 处理集合
	1. 插入 s.insert<data>









