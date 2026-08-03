class Solution(object):
    def longestPalindrome(self, s):
        res = ""

        for i in range(len(s)):

            # Odd length palindrome
            left = right = i
            while left >= 0 and right < len(s) and s[left] == s[right]:
                if right - left + 1 > len(res):
                    res = s[left:right+1]
                left -= 1
                right += 1

            # Even length palindrome
            left = i
            right = i + 1
            while left >= 0 and right < len(s) and s[left] == s[right]:
                if right - left + 1 > len(res):
                    res = s[left:right+1]
                left -= 1
                right += 1

        return res