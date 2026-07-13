#include <string>
#include <cctype>

class Solution
{
public:
    bool detectCapitalUse(std::string word)
    {
        std::size_t count = 0U;
        for (const char& letter: word)
        {

            if( std::isupper(static_cast<int>(letter)) )
                count++;
        }

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