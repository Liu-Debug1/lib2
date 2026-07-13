# 一、C++刷题与工程练习路线




   对嵌入式、ROS2、线控底盘方向来说，C++ 不是为了写花哨语法，而是为了能写出**稳定、清晰、可维护的工程代码**。

   ```text
   C++基础语法题       20%
   工程小项目/模块题   50%
   基础算法题         30%
   ```

## 1.推荐刷题网站

1. **Exercism C++：练 C++ 语言手感**
官网：[Exercism C++ Track](https://exercism.org/tracks/cpp)
适合用途：
   - 练基础语法。
   - 练函数、类、字符串、容器、简单 STL。
   - 通过小题建立 C++ 代码手感。

   推荐刷法：

   - 每天刷 1-2 个小练习。
   - 刷完后回看别人更简洁的写法。
   - 重点关注：**参数怎么传、返回值怎么写、容器怎么用、类怎么组织**。

3. **ROS2 官方 C++ 教程：练工程上下文**

   官网：[ROS2 Foxy C++ Publisher and Subscriber](https://docs.ros.org/en/foxy/Tutorials/Beginner-Client-Libraries/Writing-A-Simple-Cpp-Publisher-And-Subscriber.html)

   适合用途：

   - 把 C++ 放进 ROS2 工程里练。
   - 理解节点、发布者、订阅者、服务、客户端、参数。
   - 熟悉 `rclcpp` 的常见 API。

   推荐刷法：

   - 不要只复制代码，至少手写 2-3 遍。
   - 每写完一个节点，主动改话题名、消息类型、节点名。
   - 从“照着写”逐步过渡到“关掉教程自己写”。

4. **LeetCode：补基础算法和边界处理**

   官网：[LeetCode](https://leetcode.com/problemset/algorithms/)

   适合用途：

   - 训练逻辑表达。
   - 训练边界条件处理。
   - 补数据结构和算法基础。

   推荐刷法：

   - 只刷 Easy 和少量 Medium。
   - 不追求题量，追求把代码写清楚。
   - 每周 3-5 题即可。

## 2.具体应该刷什么

1. **C++基础语法题**

   - **变量、作用域、生命周期**
   - **指针和引用**
   - **`const`、`static`、`auto`**
   - **函数参数传递**
   - **类、构造函数、析构函数**
   - **继承、多态**
   - **`std::string`、`std::vector`、`std::map`**
   - **智能指针：`std::shared_ptr`、`std::unique_ptr`**

   推荐练习方式：
   ```text
   LearnCpp 查概念
       ↓
   Exercism 做小题
       ↓
   自己写 20-50 行小例子
       ↓
   回到 ROS2 代码里识别这个语法
   ```

2. **工程小模块题**

   目标：训练嵌入式和 ROS2 真正需要的工程表达能力。

   优先练这些模块：
   
   - **发布者节点**：定时发布一条消息。
   - **订阅者节点**：接收消息并打印。
   - **订阅 + 发布节点**：收到一个话题后，处理并发布另一个话题。
   - **PID 控制类**：输入误差，输出控制量。
   - **状态机**：例如车辆模式 `INIT`、`READY`、`RUNNING`、`ERROR`。
   - **串口协议解析器**：解析帧头、长度、数据、校验。
   - **环形缓冲区**：用于数据缓存。
   - **日志模块**：统一打印不同等级的信息。

   这些题更贴近工程：
   ```text
   传感器数据输入
       ↓
   C++ 类封装处理逻辑
       ↓
   输出控制量或 ROS2 消息
   ```

3. **基础算法题**

   目标：补逻辑能力和边界条件，不追求竞赛难度。

   必刷类型：

   - **数组**
   - **字符串**
   - **链表**
   - **栈和队列**
   - **哈希表**
   - **二分查找**
   - **简单递归**
   - **BFS / DFS 基础**

   可选 LeetCode 题目：

   | 题目 | 训练点 |
   |---|---|
   | `Two Sum` | 哈希表 |
   | `Valid Parentheses` | 栈 |
   | `Merge Two Sorted Lists` | 链表 |
   | `Binary Search` | 二分 |
   | `Linked List Cycle` | 快慢指针 |
   | `Maximum Depth of Binary Tree` | 递归 / DFS |

> [!warning]
> LeetCode 不能代替工程训练。算法题能提升逻辑，但不能直接训练 CMake、类设计、模块边界、调试能力和 ROS2 通信结构。

## 3.每日练习安排

1. **60 分钟版本**

   适合课业较忙时：
   ```text
   20 分钟：LearnCpp / Exercism 补 C++ 基础
   30 分钟：写一个 ROS2 或嵌入式 C++ 小模块
   10 分钟：复盘今天卡住的语法点
   ```

2. **90 分钟版本**

   适合专门补强 C++ 时：
   ```text
   30 分钟：LearnCpp / Exercism
   30 分钟：ROS2 C++ 工程练习
   20 分钟：LeetCode Easy
   10 分钟：整理到 Obsidian
   ```

3. **每周节奏**

| 时间 | 任务 |
|---|---|
| 周一到周三 | C++ 基础 + ROS2 小节点 |
| 周四 | 工程小模块，例如状态机、PID、环形缓冲区 |
| 周五 | LeetCode 基础算法 |
| 周六 | 整合一个小 demo |
| 周日 | 复盘报错、整理笔记、补薄弱点 |

## 4.阶段目标

1. **第一阶段：看懂 ROS2 C++ 代码**

   达标标准：
   - 能解释 `main()`、`rclcpp::init()`、`spin()`、`shutdown()`。
   - 能看懂 `class Node : public rclcpp::Node`。
   - 能理解构造函数里为什么创建发布者、订阅者。
   - 能看懂 `std::shared_ptr`、`std::bind`、`this`。
   
********
2. **第二阶段：能独立写 ROS2 C++ 节点**

   达标标准：
   - 能独立写一个发布者。
   - 能独立写一个订阅者。
   - 能写一个同时订阅和发布的节点。
   - 能配置 `CMakeLists.txt` 和 `package.xml`。
   - 能用 `ros2 topic`、`ros2 node` 排查问题。

3. **第三阶段：能写工程小模块**

   达标标准：
   - 能写一个 PID 类。
   - 能写一个状态机。
   - 能写一个串口数据解析模块。
   - 能把模块封装成类，而不是全部堆在 `main()` 里。

4. **第四阶段：能把 C++ 用到车辆/底盘方向**

   达标标准：
   - 能定义车辆状态数据结构。
   - 能处理传感器输入。
   - 能输出控制指令。
   - 能把算法模块接入 ROS2 通信。

## 5.当前最推荐的执行顺序

1. **先用 Exercism 建立 C++ 基础手感**
   每天 1-2 题即可，重点不是速度，而是把代码写顺。

2. **同步手写 ROS2 发布者和订阅者**
   当前最应该反复练：
   ```text
   publisher
   subscriber
   publisher + subscriber
   service server
   service client
   custom msg
   ```

3. **每周补 3-5 道 LeetCode Easy**
   只补基础数据结构，不追求高难度。
4. **每周写一个工程小模块**
   优先顺序：
   ```text
   状态机
      ↓
   PID 控制类
      ↓
   环形缓冲区
      ↓
   串口协议解析
      ↓
   ROS2 节点封装
   ```



## 6.LeetCode错题集+


### 6.1 没用过的函数/库

#### 6.1.1 Heap堆

- 大根堆创建：
```cpp
std::priority_queue<int,std::vector<int>,std::less<int> > gQ_Deadline_C;
std::priority_queue<int,std::vector<int>,std::less<int> > gQ_Deadline_C(Array.begin(), Array.end());
std::priority_queue<元素类型, 底层容器类型, 比较器类型> 变量名;
```

- 小根堆创建：
```cpp
std::priority_queue<int,std::vector<int>,std::greater<int> > gQ_Deadline_C;
```


- 底层容器需要支持下标访问、尾部插入、尾部删除、访问元素 
- 生成`priority_queue`对外提供`push()`、`top()`、`pop()`等接口


- **push：先准备好一个对象，再放进容器里面**
```cpp
minHeap_C.push(HeadNode(sum, i , j))
```
>  先在堆外构HeapNode，在放入堆中

- **emplace：不需要准备对象，直接将对象元素传入，内部自行构造**
```cpp
minHeap_C.emplace(sum, i, j)
```
> 这里直接把(sum, i, j)传给堆，由堆在自己的存储空间中构造



#### 6.1.2 tuple类模板

作为一个**类模板**。可以把多个、甚至不同类型的数据打包成一个对象

> [!NOTE] 例如：
>   
> ```cpp
>   std::tuple<int, float, char> gTuple_Data_C;
> ```
>   相当于创建一个“固定有3个成员”的组合：
> ```
> 第0个元素：int
> 第1个元素：flaot
> 第2个元素：char
> ```
> 

> [!NOTE] `std::get` 是从 `std::tuple` 中取出指定位置元素的标准方法：
> 
> ```cpp
> std::tuple<long long, size_t, size_t> node_C = {3, 0, 0};
> std::get<0>(node_C) -> 3   // 第 0 个元素：组合和
> std::get<1>(node_C) -> 0   // 第 1 个元素：nums1 下标
> std::get<2>(node_C) -> 0   // 第 2 个元素：nums2 下标
> ```
> **另一种写法：**
> ```cpp
> const auto [sum, i, j] = minHeap_C.top();
> ```
> 相当于把堆顶的3个元素拆开（这里已经自定义了三个变量）
> ```cpp
> const HeapNode node_C = minHeap_C.top();
> const long long sum = get<0>(node_C);
> const size_t i = get<1>(node_C);
> const size_t j = get<2>(node_C);
> ```



#### 6.1.3 size_t数据类型

  - 表示**无符号**的整型数据类型，最大值由平台决定
  - 省去了自行选择定义的uint8、16、32、64其中一种，统一为size_t
  - 位于`std`作用域下	

### 6.2 踩过坑

1. 不论在哪定义变量，一定要记得初始化
2. 


### 6.3 算法套路

##### (1) 计数数组套路：用下标代表数字，用值代表出现次数

```
count[i] 标识数字i出现的次数
```

**适用场景**：
1.数字范围明确： 1~n，0~100，A~Z
2.需要判断：出现次数、重复、缺失

**常见写法**：
```cpp
int n = nums.size();
vector<int> count(n + 1, 0);
for (int x : nums) {
    count[x]++;
}
```


##### (2) index 指针套路：

**用下标记录“当前目标进度”**


##### (3) 单调栈

**常用于解决**：
1. 正常片段
2. 找左边/右边第一个最大的数组
3. 对某一个数组进行单调增减的排列

**模板：找右边第一个更大元素**：
```cpp
vector<int> ans(n, 0);
stack<int> st;  // 存还没被解决的下标

for (int i = 0; i < n; i++) {
    while (!st.empty() && nums[i] > nums[st.top()]) {
        int prevIndex = st.top();
        st.pop();

        ans[prevIndex] = i - prevIndex;  // 或者 ans[prevIndex] = nums[i]
    }

    st.push(i);
}
```
其中：`stack<int> st` 是用于存储位于原来数组的==下标==，下标顺序可以是原容器==单调递增/递减==的顺序

#### (4)建堆

- 建堆：数组 -> 堆， 所有非叶子节点，从后向前，向下调整
- 插入：加入到新末尾节点，再向上比对调整
- 删除堆顶：新根节点，向下调整

小根堆的方法，整理数组(按照**每个==父结点== <= 它的左右孩子**的方法整理）
```cpp
/*
 * 功能：将 uIndex 指向的结点向下调整，恢复小根堆性质。
 * 规则：父结点的值必须小于或等于左右孩子。
 * 参数：
 *   pArray - 堆数组首地址
 *   uSize  - 数组中有效元素个数
 *   uIndex - 本次需要开始调整的结点下标
 */
void heap_siftDownMin(int* pArray, size_t uSize, size_t uIndex)
{
    // 当前结点可能要连续下沉，因此使用循环反复检查。
    while (true)
    {
        // 初始时假设当前父结点是“父、左孩子、右孩子”中的最小值。
        size_t uSmallestIndex = uIndex;

        // 根据完全二叉树的数组下标关系，计算左右孩子下标。
        const size_t uLeftIndex = 2U * uIndex + 1U;
        const size_t uRightIndex = 2U * uIndex + 2U;

        // 先检查左孩子：
        // 1. 左孩子下标不能越过数组有效范围；
        // 2. 左孩子值小于当前记录的最小值。
        if ((uLeftIndex < uSize) &&
            (pArray[uLeftIndex] < pArray[uSmallestIndex]))
        {
            // 左孩子更小，记录左孩子下标。
            uSmallestIndex = uLeftIndex;
        }

        // 再检查右孩子：
        // 注意这里和“目前最小者”比较，可能是父结点，也可能已是左孩子。
        if ((uRightIndex < uSize) &&
            (pArray[uRightIndex] < pArray[uSmallestIndex]))
        {
            // 右孩子更小，记录右孩子下标。
            uSmallestIndex = uRightIndex;
        }

        // 如果最小值仍是父结点，说明：
        // 父结点 <= 左孩子，且 父结点 <= 右孩子。
        // 当前结点已满足小根堆规则，调整结束。
        if (uSmallestIndex == uIndex)
        {
            break;
        }
        // 最小值在某个孩子结点中。
        // 父结点与较小的孩子交换，让较小值上浮到父结点位置。
        const int iTemp = pArray[uIndex];
        pArray[uIndex] = pArray[uSmallestIndex];
        pArray[uSmallestIndex] = iTemp;
        // 原父结点已下沉到孩子位置。
        // 它可能仍大于自己的新孩子，因此从新位置继续向下检查。
        uIndex = uSmallestIndex;
    }
}
/*
- 功能：将无序数组原地构造成小根堆。
- 规则：每个父结点的值必须小于或等于其左右孩子。
- 参数：
- pArray - 待构造堆的数组首地址，函数会修改数组元素顺序。
- uSize  - 数组中有效元素个数。
 */
void heap_buildMin(int* pArray, size_t uSize)
{
    // 空数组或只有一个元素时，天然满足小根堆规则，无需调整。
    if ((pArray == NULL) || (uSize < 2U))
    {
        return;
    }
    for (size_t uIndex = uSize / 2U; uIndex > 0U; --uIndex)
    {
         // 实际调整的结点下标为 uIndex - 1U。
         // 循环调整顺序为：uSize / 2 - 1、uSize / 2 - 2、...、0
         // 没有直接将 uIndex 初始化为 uSize / 2U - 1U，是为了避免 size_t 为无符号类型时，递减到 0 后发生下溢。
        heap_siftDownMin(pArray, uSize, uIndex - 1U);
    }
}
```


> [!NOTE] 键堆时
> - 一个节点只要有左叶，就一定是**非子叶节点** -> 最后一个非叶子节点下标为 `array.size()/2 - 1`
> - 每一次调整，只需要针对非子叶节点进行向下调整

大根堆的方法，整理数组(按照**每个==父结点== >= 它的左右孩子**的方法整理）
```cpp
/*
- 功能：将 uIndex 指向的结点向下调整，恢复大根堆性质。
- 规则：父结点的值必须大于或等于左右孩子。
- 参数：
- pArray - 堆数组首地址，函数会修改数组元素顺序。
- uSize  - 数组中有效元素个数。
- uIndex - 本次需要开始调整的结点下标。
 */
void heap_siftDownMax(int* pArray, size_t uSize, size_t uIndex)
{
    // 当前结点可能要连续下沉，因此使用循环反复检查。
    while (true)
    {
        // 初始时假设当前父结点是“父、左孩子、右孩子”中的最大值。
        size_t uLargestIndex = uIndex;

        // 根据完全二叉树的数组下标关系，计算左右孩子下标。
        const size_t uLeftIndex = 2U * uIndex + 1U;
        const size_t uRightIndex = 2U * uIndex + 2U;

        // 左孩子存在且更大时，记录左孩子下标。
        if ((uLeftIndex < uSize) &&
            (pArray[uLeftIndex] > pArray[uLargestIndex]))
        {
            uLargestIndex = uLeftIndex;
        }
        // 右孩子存在且比当前最大值更大时，记录右孩子下标。
        if ((uRightIndex < uSize) &&
            (pArray[uRightIndex] > pArray[uLargestIndex]))
        {
            uLargestIndex = uRightIndex;
        }
        // 最大值仍是父结点，说明当前结点已经满足大根堆规则。
        if (uLargestIndex == uIndex)
        {
            break;
        }
        // 父结点比某个孩子小，交换父结点与较大的孩子。
        const int iTemp = pArray[uIndex];
        pArray[uIndex] = pArray[uLargestIndex];
        pArray[uLargestIndex] = iTemp;
        // 原父结点下沉后，继续检查它的新位置。
        uIndex = uLargestIndex;
    }
}
```

#### (5) 多路归并


#### (6) 逆向推理

**什么时候考虑逆向推理:**

- 正向的每一步都有许多选择，搜索分支特别多的时候
- 逆向操作比正向操作更确定
- 题目只问“能否到达”而不要求输出完整推到路径  
- 是否存在重复减法，可以用除法或者取模加速？      

**逆向推理**：
```
M = 当前最大值
R = 其余值总和 = 总和 - M
Previous = 旧值 = M % R 
总和 ==  R + Previous 
```

	          












