class Solution(object):
    def firstMissingPositive(self, nums):
        nums.sort()
        missing = 1

        for i in nums:
            if i == missing:
                missing += 1

        return missing