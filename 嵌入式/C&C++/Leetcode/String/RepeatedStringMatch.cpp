#include<string>

class Solution
{
public:
    /**
     * @brief 返回最少重复 a 的次数，使 b 成为重复结果的子串。
     *
     * @param a 非空基础字符串，不会被修改。
     * @param b 非空待匹配字符串，不会被修改。
     * @return 最少重复次数；无法匹配时返回 -1。
     * 本质
     */
    int repeatedStringMatch(std::string a, std::string b)
    {
        std::string repeated{};
        int repeatedCount{0};

        //1.先将 a 扩充到能够容下 b，重复次数一般是 minRepeatedCount = ceil(b.size()/a.size())
        while (repeated.size() < b.size())
        {
            repeated.append(a);
            repeatedCount++;
        }
        
        //2.在 repeated 中寻找 b
        if (repeated.find(b) != std::string:: npos)
        {
            //2.1 如果找到,直接返回重复次数
            return repeatedCount ;

        }
        else
        {
            // 2.2 如果没找到， 再扩充 1 次，再从其中获取 b 中,minRepeatedCount + 1
            repeated.append(a);
            repeatedCount++;
            if (repeated.find(b) != std::string:: npos)
            {
                return repeatedCount;
            }
            else
            {
                //2.3 如果还没有找到的话，说明不论 a 重复多少次都不可能拼凑的出 b
                return -1;
            }            
        }
    }
};