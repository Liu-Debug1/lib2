#include <string>
#include <cctype>

class Solution
{
public:
    /*
     * 功能: 判断单词的大写字母使用方式是否符合题目规则。
     * 参数: word 为仅含英文字母的非空单词；函数不会修改输入字符串。
     * 返回: 全大写、全小写或仅首字母大写时返回 true，否则返回 false。
     */
    bool detectCapitalUse(std::string word)
    {
        std::size_t count = 0U;
        // 统计单词中大写字母的数量，用于覆盖三种合法格式。
        for (const char& letter: word)
        {

            if( std::isupper(static_cast<int>(letter)) )
                count++;
        }

        // 合法情况：全小写、全大写，或唯一大写字母位于首位。
        if (count == 0U ||
             count == word.size() ||
              count == 1U&& std::isupper(static_cast<int>(word[0U])))
        {
        return true;
        }
        else
        {
            return false;
        }
        
    }
};
