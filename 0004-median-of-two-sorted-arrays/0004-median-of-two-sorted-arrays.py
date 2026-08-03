class Solution(object):
    def findMedianSortedArrays(self, nums1, nums2):
        temp = nums1 + nums2
        temp.sort()

        n = len(temp)
        mid = n // 2

        if n % 2 == 0:
            return (temp[mid - 1] + temp[mid]) / 2.0
        else:
            return temp[mid]