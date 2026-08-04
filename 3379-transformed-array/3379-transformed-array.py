class Solution(object):
    def constructTransformedArray(self, nums):
        n = len(nums)
        ans = []
        for i in range(n):
            index = (i + nums[i]) % n
            ans.append(nums[index])
        return ans