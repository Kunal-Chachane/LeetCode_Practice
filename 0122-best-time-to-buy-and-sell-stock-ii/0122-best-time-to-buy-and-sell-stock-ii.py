class Solution(object):
    def maxProfit(self, prices):
        profit = 0

        for i in range(1, len(prices)):
            if prices[i] > prices[i - 1]:
                profit += prices[i] - prices[i - 1]

        return profit

prices = [7, 1, 5, 3, 6, 4]

sol = Solution()
print(sol.maxProfit(prices))
