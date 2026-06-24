def maxProfit(nums):
    min_price = float("inf")
    max_profit = 0

    for i in range(len(nums)):
        min_price = min(min_price, nums[i])
        max_profit = max(max_profit, nums[i] - min_price)

    return min_price,max_profit


nums = [7, 2, 1, 5, 6, 4, 8]
print(maxProfit(nums))