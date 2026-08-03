class Solution(object):
    def missingNumber(self, nums):
        result = [0] * (len(nums) + 1)
        for i in nums:
            result[i] = 1
        for j in range(len(result)):
            if result[j] == 0:
                return j