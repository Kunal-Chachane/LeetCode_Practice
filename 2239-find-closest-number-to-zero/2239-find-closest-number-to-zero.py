class Solution(object):
    def findClosestNumber(self, nums):
        i = 0
        result = float("inf")
        final = nums[0]
        for i in range(0, len(nums)):
            if nums[i] < 0:
                temp = (nums[i] - 0) * (-1)
            else:
                temp = nums[i] - 0

            if temp < result:
                result = temp
                final = nums[i]
            elif temp == result and nums[i] > final:
                final = nums[i]

        return final