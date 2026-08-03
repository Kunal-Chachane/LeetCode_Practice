class Solution(object):
    def findCenter(self, edges):
        freq = {}

        for u, v in edges:
            freq[u] = freq.get(u, 0) + 1
            freq[v] = freq.get(v, 0) + 1

        for node in freq:
            if freq[node] == len(edges):
                return node