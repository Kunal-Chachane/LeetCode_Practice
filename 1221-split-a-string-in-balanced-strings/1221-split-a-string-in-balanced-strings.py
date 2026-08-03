class Solution(object):
    def balancedStringSplit(self, s):

        count = 0
        ans = 0
        for i in s:
            if i == "L":
                count += 1
            else:
                count -= 1

            if count == 0:
                ans += 1
        return ans