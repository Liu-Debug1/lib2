


`using namespace std;` **声明**后可以直接使用std的函数
```
#include<iostream>

using namespace std;

int main(void)
{
	int n;
	cin >> n;
	cout << "wohaoshuia!" << ++n << endl;

	return 0;
}
```

**如果不声明**，却要调用，则需要`std::函数`的形式进行使用
```
#include<iostream>


int main(void)
{
	int n;
	std::cin >> n;
	std::cout << "wohaoshuia!" << ++n << std::endl;

	return 0;
}
```

>[!note] 注意cin和cout的使用方式
>1. cin = scanf ，cout = printf。但是运行速度慢
>2.  cin箭头向右，cout箭头向左


头文件声明
	声明时不再需要`.h`, 直接在文件名前加一个`c`
```
#include<string.h> -> #include<cstirng>
```

变量声明
	可以在for循环内部建立循环变量

bool变量
>	`ture`  = 非0
>	`false` = 0

![[Pasted image 20260513155617.png]]

const 定义一个不可改变的常量
	const就像一个门钉一样，
![[Pasted image 20260513160024.png]]
