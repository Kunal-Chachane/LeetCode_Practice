class Solution(object):
    def findLongestChain(self, pairs):
        if not pairs:
            return 0

        pairs.sort(key=lambda x: x[1])
        counts = 1
        end = pairs[0][1]

        for i in range(1, len(pairs)):
            if pairs[i][0] > end:
                counts += 1
                end = pairs[i][1]
        return counts
        