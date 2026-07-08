class Solution(object):
    def search(self, nums, target):
        for i in range(0,len(nums)):
            if nums[i]==target:
                return True
        return False