class Solution(object):
    def relativeSortArray(self, arr1, arr2):
        ans = []
        for x in arr2:
            while x in arr1:
                ans.append(x)
                arr1.remove(x)
        arr1.sort()
        return ans + arr1