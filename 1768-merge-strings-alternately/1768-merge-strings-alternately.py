class Solution(object):
    def mergeAlternately(self, word1, word2):
        ans = ""
        n = min(len(word1), len(word2))

        for i in range(n):
            ans += word1[i]
            ans += word2[i]

        ans += word1[n:]
        ans += word2[n:]

        return ans