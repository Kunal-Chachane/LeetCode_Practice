class Solution(object):
    def kidsWithCandies(self, candies, extraCandies):
        max_candies = max(candies)
        answer = []
        for i in candies:
            if i + extraCandies >= max_candies:
                answer.append(True)
            else:
                answer.append(False)

        return answer