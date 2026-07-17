#include<string>
#include<cctype>



class Solution {
public:
    /*
     * 功能: 按题目规则脱敏电子邮箱地址或电话号码。
     * 参数: s 为邮箱地址或电话号码字符串；函数在本地副本上处理，不修改调用方输入。
     * 返回: 脱敏后的字符串。
     */
    std::string maskPII(std::string s)
    {
        // 以 @ 作为邮箱标志，分别进入邮箱和电话号码处理流程。
        if (s.find('@') != std::string::npos)
        {
            // 邮箱处理：统一小写后，仅保留用户名首尾字符和完整域名。
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
            // 电话处理：过滤括号、空格和连字符，仅保留数字。
            for (size_t i = 0; i < s.length(); i++)
            {
                if(std::isdigit(static_cast<unsigned char>(s.at(i))))
                {
                    contain.push_back(s.at(i));
                }
            }
            // 数字已提取完成，复用 s 组装最终脱敏格式。
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
