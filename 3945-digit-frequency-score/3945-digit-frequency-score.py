class Solution(object):
    def digitFrequencyScore(self, n):
        freq = {}
        result = 0
        for digit in str(n):
            freq[digit] = freq.get(digit, 0) + 1
        for digit, count in freq.items():
            result += int(digit) * count
        return result