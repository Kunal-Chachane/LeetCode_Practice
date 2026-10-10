
class Solution(object):
    def longestConsecutive(self, nums):
        nums = sorted(set(nums))
        count = 1
        longest = 0
        if len(nums) == 1:
            return 1
        for i in range(1, len(nums)):
            if nums[i] == nums[i-1] + 1:
                count += 1
            else:
                count = 1
            longest = max(longest, count)
        return longest
