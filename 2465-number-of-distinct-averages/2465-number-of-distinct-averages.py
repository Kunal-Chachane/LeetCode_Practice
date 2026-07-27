class Solution(object):
    def distinctAverages(self, nums):
        nums.sort()
        s = set()
        left = 0
        right = len(nums) - 1
        while left < right:
            s.add(nums[left] + nums[right]) 
            left += 1
            right -= 1
        return len(s)