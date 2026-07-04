class Solution(object):
    def subsets(self, nums):
        n = len(nums)
        total_subset = 2**n
        result = []
        for i in range(0,total_subset):
            list = []
            for j in range(0,n):
                if i&(1<<j)!=0:
                    list.append(nums[j])
            result.append(list)
        return result     