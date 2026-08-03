class Solution(object):
    def findDuplicates(self, nums):
        freq = {}

        for i in range(len(nums)):
            freq[nums[i]] = freq.get(nums[i], 0) + 1
            
        ans = []
        for key, value in freq.items():
            if value > 1:
                ans.append(key)

        return ans