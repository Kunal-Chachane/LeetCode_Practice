class Solution(object):
    def mergeKLists(self, lists):
        arr = []

        for head in lists:
            while head:
                arr.append(head.val)
                head = head.next

        arr.sort()

        dummy = ListNode(0)
        curr = dummy

        for num in arr:
            curr.next = ListNode(num)
            curr = curr.next

        return dummy.next