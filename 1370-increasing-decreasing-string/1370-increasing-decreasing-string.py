class Solution(object):
    def sortString(self, s):
        ans = ""
        while s:
            # Increasing order
            for ch in sorted(set(s)):
                ans += ch
                s = s.replace(ch, "", 1)

            # Decreasing order
            for ch in sorted(set(s), reverse=True):
                ans += ch
                s = s.replace(ch, "", 1)
        return ans