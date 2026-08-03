class Solution(object):
    def numComponents(self, head, nums):
        nums = set(nums)
        count = 0

        while head:
            if head.val in nums:
                if head.next == None or head.next.val not in nums:
                    count += 1
            head = head.next

        return count