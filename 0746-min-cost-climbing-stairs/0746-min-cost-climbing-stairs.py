class Solution(object):
    def minCostClimbingStairs(self, cost):
        first = 0
        second = 0

        for i in range(len(cost)):
            current = cost[i] + min(first, second)
            first = second
            second = current

        return min(first, second)