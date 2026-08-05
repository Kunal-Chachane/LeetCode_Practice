class Solution(object):
    def mostFrequentEven(self, nums):
        freq = {}
        for num in nums:
            if num % 2 == 0:
                freq[num] = freq.get(num, 0) + 1
        if not freq:
            return -1
        ans = min(freq)
        for num in freq:
            if freq[num] > freq[ans]:
                ans = num
            elif freq[num] == freq[ans] and num < ans:
                ans = num
        return ans