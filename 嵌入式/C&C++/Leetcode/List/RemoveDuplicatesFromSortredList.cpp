/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 *     ListNode(int x, ListNode *next) : val(x), next(next) {}
 * };
 */
class Solution
{
public:
    struct ListNode
    {
        int val;
        ListNode *next;
        
        ListNode() : val(0), next(nullptr){} 
        ListNode(int x) : val(x), next(nullptr) {}
        ListNode(int x, ListNode *next) : val(x), next(next) {}
    };

    /*
     * 功能：删除有序单链表中的重复结点，每个值仅保留一个结点。
     * 参数：head 为链表头指针，允许为空；函数会原地修改结点之间的链接关系。
     * 返回：去重后的链表头指针。
     */
    ListNode *deleteDuplicates(ListNode *head)
    {
        ListNode temp;
        // currentNode 始终指向已保留结点序列的末尾。
        ListNode *currentNode = head;
        
        // 只有存在下一个结点时，才能比较相邻结点是否重复。
        while ((currentNode != nullptr)&&(currentNode->next !=nullptr))
        {
            if (currentNode -> val == currentNode ->next ->val)
            {
                ListNode *repeatedNode;
                repeatedNode = currentNode->next;

                // 有序链表的重复值必相邻；绕过重复结点即可保留当前结点。
                currentNode->next = (currentNode->next->next);

                // 重新链接后再释放重复结点，避免丢失后续链表入口。
                delete repeatedNode;
                repeatedNode = nullptr;
            }
            else
            {
                // 仅在值不重复时前移，才能继续删除连续出现的重复值。
                currentNode = currentNode->next;
            }
        }
        return head;
    }



};
