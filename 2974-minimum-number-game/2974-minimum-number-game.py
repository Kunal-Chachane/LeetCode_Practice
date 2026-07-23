class Solution(object):
    def numberGame(self, nums):
        nums.sort()
        ans = []
        for i in range(0, len(nums), 2):
            ans.append(nums[i + 1])
            ans.append(nums[i])
        return ans