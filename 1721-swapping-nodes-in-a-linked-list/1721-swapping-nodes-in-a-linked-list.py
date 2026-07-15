class Solution(object):
    def swapNodes(self, head, k):
        first = head
        second = head
        temp = head

        for i in range(k - 1):
            first = first.next

        temp = first

        while temp.next:
            temp = temp.next
            second = second.next

        first.val, second.val = second.val, first.val

        return head