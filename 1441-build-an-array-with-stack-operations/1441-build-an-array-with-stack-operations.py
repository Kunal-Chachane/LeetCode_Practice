class Solution(object):
    def buildArray(self, target, n):
        ans = []
        i = 0
        for num in range(1, n + 1):
            if i == len(target):
                break
            ans.append("Push")
            if num == target[i]:
                i += 1
            else:
                ans.append("Pop")
        return ans
        