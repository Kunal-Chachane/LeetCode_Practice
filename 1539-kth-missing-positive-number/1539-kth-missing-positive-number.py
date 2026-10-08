class Solution(object):
    def findKthPositive(self, arr, k):
        num = 1
        while k > 0:
            if num not in arr:
                k -= 1
            num += 1
        return num - 1