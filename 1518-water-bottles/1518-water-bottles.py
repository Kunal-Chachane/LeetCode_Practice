class Solution(object):
    def numWaterBottles(self, numBottles, numExchange):
        total = numBottles
        empty = numBottles

        while empty >= numExchange:
            # Exchange empty bottles for 1 full bottle
            empty = empty - numExchange

            # Drink the new bottle
            total += 1

            # After drinking, you get 1 empty bottle back
            empty += 1

        return total