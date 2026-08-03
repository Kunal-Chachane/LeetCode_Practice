class Solution(object):
    def singleNumber(self, nums):
        freq = {}
        temp = []
        for num in nums:
            freq[num] = freq.get(num, 0) + 1

        for num in freq:
            if freq[num] == 1:
               temp.append(num)
        return temp