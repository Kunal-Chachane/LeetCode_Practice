class Solution(object):
    def xorAfterQueries(self, nums, queries):

        mod = 1000000007

        for q in queries:
            l = q[0]
            r = q[1]
            k = q[2]
            v = q[3]

            i = l
            while i <= r:
                nums[i] = (nums[i] * v) % mod
                i += k

        ans = 0

        for x in nums:
            ans ^= x

        return ans