class Solution(object):
    def rearrangeArray(self, nums):
       m = len(nums)
       result = [0]*m
       pos=0
       neg=1
       for i in range (0,m):
            if nums[i]>=0:
                result[pos] = nums[i]
                pos+=2
            else : 
                result[neg] = nums[i]
                neg+=2
       return result

        