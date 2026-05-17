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

- C++引用C的头文件时可以去掉`.h`，加前缀 `c`：`#include <cstdio>`
- 可按照原来的`.h`方式: `#include <stdio.h>`
- ***自己的文件***仍然需要`.h`方式: `#include "stdio.h"`

| C                     | C++                  |
| :-------------------- | :------------------- |
| `#include <stdio.h>`  | `#include <cstdio>`  |
| `#include <string.h>` | `#include <cstring>` |
| `#include <stdlib.h>` | `#include <cstdlib>` |
| `#include <math.h>`   | `#include <cmath>`   |

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

#### 1.8.1c++中`&`有两层含义
  1. 取地址
  2. 引用
	- 省去了取地址 `&` 然后在 `*` 解引用的过程。直接传变量即可，内部自动取地址+解引用
	- 利用`const`进行访问可以只传值不修改
	- 引用必须初始化，这样就防止了空指针的进入，省去了空指针保护的环节
	
```cpp
  // C 写法 —— 手动取地址 + 手动解引用
  void swap(int* a, int* b) {
      int t = *a;    // 手动解引用
      *a = *b;       // 手动解引用
      *b = t;        // 手动解引用
  }
  swap(&x, &y);      // 手动取地址
--------------------------------------------------------------------------------------------------
  // C++ 写法 —— 编译器帮你干了这两步
  void swap(int& a, int& b) {
      int t = a;     // 编译器自动解引用
      a = b;         // 编译器自动解引用
      b = t;         // 编译器自动解引用
  }
  swap(x, y);        // 编译器自动取地址

 
```

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

## 四、C++11篇

### 4.1 Auto声明

1. auto作用：可以让编译器根据初始值，推断出变量的类型，自动定义
2. 作为迭代器：数组、集合、键值对、字符串等进行遍历，无需考虑长度

---

### 4.2 基于范围的for循环

1.仅用于传值（对**所有容器**都可以）：
2.修改原变量的值，需要加上取地址`&`

| 写法              | 是否拷贝 | 能否修改原值 | 适用场景                    |
| --------------- | ---- | ------ | ----------------------- |
| `auto x`        | 拷贝一份 | 不能改原值  | 元素是 int/char 等小类型，不需要修改 |
| `auto& x`       | 不拷贝  | 能改     | 需要修改容器元素                |
| `const auto& x` | 不拷贝  | 不能改    | 最常用（省开销，避免开辟空间）         |

```cpp
  vector<int> v = {1, 2, 3};

  // 1. 只读 —— 每次循环都拷贝一个元素出来
  for (auto x : v) {
      x = 99;      // 改的是副本，v 不变
  }
  // v 还是 {1, 2, 3}

  // 2. 修改原容器 —— 用引用 &
  for (auto& x : v) {
      x = 99;      // 直接修改原元素
  }
  // v 变成 {99, 99, 99}

  // 3. 只读但避免拷贝（最常用的写法）
  for (const auto& x : v) {
      // x 是原元素的 const 引用，不能改，也不拷贝
  }
```

>[!note] 对于所有容器遍历打印
```cpp
 // 序列容器
      vector<int> v = {1, 2, 3};
      list<int> l = {4, 5, 6};
      deque<int> d = {7, 8, 9};
      array<int, 3> a = {10, 11, 12};
      string s = "CAN";

      for (const auto& x : v) cout << x << " ";    // 1 2 3
      for (const auto& x : l) cout << x << " ";    // 4 5 6
      for (const auto& x : d) cout << x << " ";    // 7 8 9
      for (const auto& x : a) cout << x << " ";    // 10 11 12
      for (const auto& c : s) cout << c << " ";    // C A N

      // 关联容器
      set<int> st = {3, 1, 2};
      map<string, int> m = {{"brake", 1}, {"steer", 2}};

      for (const auto& x : st) cout << x << " ";          // 1 2 3（自动排序）
      for (const auto& pair : m)                          // 每个元素是 pair
          cout << pair.first << ":" << pair.second << " "; // brake:1 steer:2
      for (const auto& [k, v] : m)                         // C++17 结构化绑定更清爽
          cout << k << ":" << v << " ";

      // 多维
      vector<vector<int>> mat = {{1,2}, {3,4}};
      for (const auto& row : mat) {
          for (const auto& x : row)
              cout << x << " ";
          cout << endl;
      }
```

---

### 4.3 to_string stoi stod 函数

***引用头文件***`#include<string>` 
- to_string
	能够将数字转换为字符，
```cpp
	int i = 0;                              // 计数器，记录当前是第几次循环
	string s = to_string(123213);            // 把数字转成字符串，s = "123213"
	for(const auto& x : s)                  // 遍历字符串 s 的每个字符，x 是每个字符的只读引用
      cout << x << "(" << i++ << ")  ";    // 打印字符 + 它对应的序号
	cout << endl;                            // 换行
	//打印结果1(0)  2(1)  3(2)  2(3)  1(4)  3(5)
	printf("%s \n",s.str()); //使用printf输出，需要加一个.c_str()
							 //.c_str() 把 string 转成 C 风格的 const char*
```
- stoi = string to int
	字符串→整数
- stod = string to double
	字符串→浮点数
- 补充，还有`stdo stold stol stoll stoul stoull`
```cpp
  int i = stoi("123");           // "123" → 123
  long l = stol("123456");       // → long
  long long ll = stoll("123");   // → long long
  float f = stof("3.14f");       // → float
  double d = stod("123.24");     // → double
  long double ld = stold("3.14");// → long double
```








