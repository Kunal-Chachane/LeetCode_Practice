class Solution(object):
    def maximumGap(self, nums):
        if len(nums) < 2:
            return 0
        nums.sort()
        ans = 0
        for i in range(0, len(nums)):
            ans = max(ans, nums[i] - nums[i - 1])
        return ans