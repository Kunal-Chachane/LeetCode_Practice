class Solution(object):
    def maxSubArray(self, nums):
        maxi = float("-inf")
        total = 0
        for i in range(0, len(nums)):
            total = max(nums[i], total + nums[i])
            maxi = max(maxi, total)
            if total<0:
                total = 0
        return maxi