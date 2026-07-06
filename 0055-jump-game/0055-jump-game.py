class Solution(object):
    def canJump(self, nums):
      max_index = 0
      for i in range(0,len(nums)):
        if i > max_index:
            return False
        else:
            max_index = max(max_index,i+nums[i])
      return True
          
        