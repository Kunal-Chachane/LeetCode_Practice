class Solution(object):
    def middleNode(self, head):
        n = 0
        curr = head
        while curr is not None:
            n += 1
            curr = curr.next

        curr = head
        for i in range(0,n // 2):
            curr = curr.next

        return curr