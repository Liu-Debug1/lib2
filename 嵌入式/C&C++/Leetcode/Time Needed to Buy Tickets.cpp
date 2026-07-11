#include <queue>
#include <vector>

class Solution
{
public:
    bool isPossible(std::vector<int> &target)
    {
        std::priority_queue<long long> maxHeap_C(
            target.begin(),target.end()
        );

        long long totalSum = 0LL;
        
        for(const int value: target){
            totalSum += value;
        }        

        while (!maxHeap_C.empty())
        {
            const long long maxValue = maxHeap_C.top();
            maxHeap_C.pop();
            const long long restValue = totalSum - maxValue;
            
            //最大值为1，满足堆要求的前提下，其余值都应该为1
            if(maxValue == 1LL)
            {
                return true;
            }
            //其余值都为1，任何值都可以通过不断减1得到
            if (restValue == 1LL)
            {
                return true;
            }
            


            // 越界1.restValue = 0时  —> array=[1] 单数情况绝对无法满足任何一个成员大于1的target
            // 越界2.restValue > maxValue时, 正常情况下：旧值 = 新值 - 其余值，则 新值 > 旧值
            if(restValue == 0 || maxValue < restValue)
            {
                return false;
            }

            const long long prevValue = maxValue % restValue;
            if(prevValue == 0LL)
                return false;
            maxHeap_C.push(prevValue);
        }
        return false;
    }
};