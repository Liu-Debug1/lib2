#include<string>



class Solution {
public:
    std::string maskPII(std::string s)
    {
        //判断是邮箱还`是电话号码
        if (s.find('@') != std::string::npos)
        {
            //邮箱处理
            for (char &character : s)
            {
                // 全部转化为小写
                if (std::isalpha(static_cast<unsigned char>(character)))
                {
                    character = std::tolower((unsigned char)character);
                }
            }
            if (s.find('@') > 2U)
            {
                // 从第 1 位开始，删除掉  s.find('@')-2U 个字符
                s.erase(1U, s.find('@')-2U);
                s.insert(1U, "*****");
            }
            else
            {
                s.insert(1U, "*****");
            }
        }
        else
        {
            std::string contain{};
            //电话处理,去除字符
            for (size_t i = 0; i < s.length(); i++)
            {
                if(std::isdigit(static_cast<unsigned char>(s.at(i))))
                {
                    contain.push_back(s.at(i));
                }
            }
            s.clear();

            if(contain.length() == 10U)
            {
                s.append("***-***-");
                s.append(contain.substr(contain.size() - 4U, 4U));
            }
            else 
            {
                s.push_back('+');
                s.append(contain.size() - 10U, '*');
                s.append("-***-***-");
                s.append(contain.substr(contain.size() - 4U, 4U));
            }
        }
        return s;
    }

};