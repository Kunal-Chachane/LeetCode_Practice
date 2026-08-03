class Solution(object):
    def rotate(self, nums, k):
        if k==0:
            return nums
        k = k % len(nums)
        nums[:] = nums[-k:] + nums[:-k] 

        return nums
        