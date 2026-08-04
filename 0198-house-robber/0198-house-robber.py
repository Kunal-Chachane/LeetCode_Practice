class Solution(object):
    def rob(self, nums):
        prev1 = 0
        prev2 = 0
        for i in nums:
            temp = max(prev1, prev2 + i)
            prev2 = prev1
            prev1 = temp
        return prev1
        