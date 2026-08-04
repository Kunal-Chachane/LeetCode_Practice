class Solution(object):
    def topKFrequent(self, nums, k):
        freq = {}
        for num in nums:
            freq[num] = freq.get(num, 0) + 1
        arr = sorted(freq.items(), key=lambda x: -x[1])
        ans = []
        for i in range(k):
            ans.append(arr[i][0])
        return ans