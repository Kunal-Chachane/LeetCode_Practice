class Solution(object):
    def findTheDifference(self, s, t):
        for ch in s:
            t = t.replace(ch, "", 1)
        return t