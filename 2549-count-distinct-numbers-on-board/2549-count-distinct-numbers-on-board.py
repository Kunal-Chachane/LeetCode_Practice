class Solution(object):
    def distinctIntegers(self, n):
        if n == 1:
            return 1
        return n - 1