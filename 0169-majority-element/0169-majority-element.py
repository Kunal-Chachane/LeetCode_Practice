class Solution(object):
    def majorityElement(self, nums):
        freq = {}
        for i in nums:
            freq[i] = freq.get(i, 0) + 1
        sorted_chars = sorted(freq.items(), key=lambda x: (-x[1], x[0]))
        return sorted_chars[0][0]