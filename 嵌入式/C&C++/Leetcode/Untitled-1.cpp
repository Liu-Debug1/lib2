#include<string>



class Solution {
public:
    std::string maskPII(std::string s)
    {
        //1,设置标志位，判断s为地址还是邮箱
        //sign[0]：0为地址，1为邮箱
        //sing[1]: 电话的位数
        //sing[2]: 邮箱@符号前有多少个字符
        std::string output{};
        int sign[3] = {0};

        for(const char& cha: s)
        {
            if(cha == '@') sign[0] = 1;
            else sign[0] = 0;
 
            sign[1]++;
            if (sign[0] != 1)
            {
                sign[2]++;
            }
        }
        
        //2,若为邮箱
        if (sign[0] == 1)
        {
            for(char& character : s)
            {
                //2.1 全部转化为小写
                if(std::isalpha(static_cast<unsigned char>(character)))
                {
                    character = std::(char)tolower((unsigned char)character);
                }
            }
            //2.2 除首尾字母，其余删除，再插入5个*
            if (sign[2] > 2)
            {
                // 从第 1 位开始，删除掉 sign[2] - 2 个字符
                s.erase(1U, static_cast<size_t>(sign[2] - 2));
                s.insert(1U, "*****");
            }
            else
            {
                s.insert(1U, "*****");
            }
        }
        else //3 若为电话
        {
            for (const char& character : s)
            {
                if (isdigit(static_cast<unsigned char>(character)))
                {
                    output.push_back(character);
                }
            }

            s.clear();
            int length = output.length();
            output.erase(0u, (size_t)length - 4);
            if (length == 10)
            {
                s.append("***-***-"+ output);
            }
            else
            {
                s.append("+");
                s.append(length - 10U, '*');
                s.append("-***-***-");
                s.append("output");
            }
        }
            
            //3.1 如果为 10 位号码 就有  ***-***-XXXX
            //3.2 如果为 11 位号码          
            //3.3 如果位 12 位号码
            //3.4 如果为 13 位号码

        return s;
    }
};