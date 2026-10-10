
class Solution(object):
    def rearrangeArray(self, nums):
        pos = []
        neg = []
        for i in nums:
            if i > 0:
                pos.append(i)
            else:
                neg.append(i)
        ans = []
        for i in range(len(pos)):
            ans.append(pos[i])
            ans.append(neg[i])
        return ans
