class Solution(object):
    def countSubstrings(self, s, c):
        count = 0

        for ch in s:
            if ch == c:
                count += 1

        return count * (count + 1) // 2