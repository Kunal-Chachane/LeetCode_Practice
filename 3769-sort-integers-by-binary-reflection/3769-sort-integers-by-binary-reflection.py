class Solution(object):
    def sortByReflection(self, nums):
        def reflection(num):
            ans = 0
            while num > 0:
                ans = ans * 2 + (num % 2)
                num //= 2
            return ans

        nums.sort(key=lambda x: (reflection(x), x))
        return nums