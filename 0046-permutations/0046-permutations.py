class Solution(object):
    def permute(self, nums):
        result = [[]]
        for num in nums:
            new_result = []
            for arr in result:
                for i in range(len(arr) + 1):
                    new_result.append(arr[:i] + [num] + arr[i:])
            result = new_result
        return result