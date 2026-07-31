class Solution(object):
    def sortArrayByParityII(self, nums):
        even = []
        odd = []
        for num in nums:
            if num % 2 == 0:
                even.append(num)
            else:
                odd.append(num)
        ans = []
        for i in range(len(even)):
            ans.append(even[i])
            ans.append(odd[i])
        return ans
        