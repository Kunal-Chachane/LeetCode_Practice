class Solution(object):
    def sortPeople(self, names, heights):
        index = list(range(len(names)))
        index.sort(key=lambda i: heights[i], reverse=True)
        ans = []
        for i in index:
            ans.append(names[i])
        return ans