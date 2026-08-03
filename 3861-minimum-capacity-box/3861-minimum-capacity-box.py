class Solution(object):
    def minimumIndex(self, capacity, itemSize):
        ans = -1
        for i in range(len(capacity)):
            if capacity[i] >= itemSize:
                if ans == -1 or capacity[i] < capacity[ans]:
                    ans = i
        return ans