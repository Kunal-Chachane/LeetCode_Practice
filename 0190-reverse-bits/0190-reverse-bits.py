class Solution(object):
    def reverseBits(self, n):
        result = ""
        for i in range(32):
            if n % 2 == 0:
                result += "0"
            else:
                result += "1"
            n //= 2
        return int(result, 2)