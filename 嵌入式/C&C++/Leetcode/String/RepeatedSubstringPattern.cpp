#include<string>



class Solution
{
public:
    /*
     * 功能: 判断字符串能否由某个非空子串重复至少两次构成。
     * 参数: s 为待判断字符串；函数不会修改输入字符串。
     * 返回: 能由重复子串构成返回 true，否则返回 false。
     */
    bool repeatedSubstringPattern(std::string s)
    {
        if(s.size() <= 1U)
        {
            return false;
        }

        // 双倍字符串包含所有循环位移，排除下标 0 和原串第二份起点即可判断周期性。
        const std::string doubled = s + s;
        const std::size_t pos = doubled.find(s, 1U);
        bool isReapeted = (pos != std::string::npos && pos < s.size());
        return isReapeted; 
    }
};
