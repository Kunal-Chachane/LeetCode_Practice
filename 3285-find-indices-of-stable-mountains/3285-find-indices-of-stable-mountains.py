class Solution(object):
    def stableMountains(self, height, threshold):
        ans = []

        for i in range(1, len(height)):
            if height[i - 1] > threshold:
                ans.append(i)

        return ans