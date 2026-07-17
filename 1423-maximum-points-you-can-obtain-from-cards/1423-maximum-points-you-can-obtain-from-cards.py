class Solution:
    def maxScore(self, cardPoints, k):
        if k == len(cardPoints):
            return sum(cardPoints)

        n = len(cardPoints)
        left_sum = 0
        right_sum = 0

        for i in range(k):
            left_sum += cardPoints[i]

        max_sum = left_sum
        right = n - 1

        for i in range(k - 1, -1, -1):
            left_sum -= cardPoints[i]
            right_sum += cardPoints[right]
            right -= 1
            max_sum = max(max_sum, left_sum + right_sum)

        return max_sum