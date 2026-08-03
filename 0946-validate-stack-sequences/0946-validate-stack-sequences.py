class Solution(object):
    def validateStackSequences(self, pushed, popped):
        stack = []
        j = 0

        for num in pushed:
            stack.append(num)

            while stack and stack[-1] == popped[j]:
                stack.pop()
                j += 1

        return len(stack) == 0