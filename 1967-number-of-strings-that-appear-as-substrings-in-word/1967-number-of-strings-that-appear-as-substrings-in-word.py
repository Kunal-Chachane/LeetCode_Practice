class Solution(object):
    def numOfStrings(self, patterns, word):
        count = 0
        for s in patterns:
            if s in word:
                count += 1
        return count