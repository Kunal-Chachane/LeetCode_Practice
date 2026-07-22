class Solution(object):
    def backspaceCompare(self, s, t):
        return self.build(s) == self.build(t)
    def build(self, s):
        stack = []
        for ch in s:
            if ch != "#":
                stack.append(ch)
            elif stack:
                stack.pop()
        return stack