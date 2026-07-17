#include<string>



class Solution
{
public:
    /*
     * 功能: 判断字符串 s 经过若干次循环左移后能否得到 goal。
     * 参数: s 为原始字符串；goal 为目标字符串；函数不会修改两个输入字符串。
     * 返回: 存在合法循环左移时返回 true，否则返回 false。
     */
    bool rotateString(std::string s, std::string goal)
    {
        // 循环左移不会改变字符串长度，长度不同可直接判定失败。
        if (s.size() != goal.size())
        {
            return false;
        }

        // 所有循环左移结果都出现在 s + s 的长度范围内。
        const std::string doubled = s + s;
        const std::size_t pos = doubled.find(goal, 0U);
        bool isRotate = (pos != std::string::npos);
        return isRotate;
    }
};


