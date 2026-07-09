class Solution(object):
    def removeStars(self, s):
        stack = []
        for ch in s:
            if ch == "*":
                stack.pop()
            else:
                stack.append(ch)

        return "".join(stack)