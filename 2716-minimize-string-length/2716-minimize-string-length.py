class Solution(object):
    def minimizedStringLength(self, s):
        ans = ""
        for ch in s:
            if ch not in ans:
                ans += ch
        return len(ans)